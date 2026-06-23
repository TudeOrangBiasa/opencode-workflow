---
name: modular-monolith-patterns
description: Use when designing modular monolith architecture — domain separation, Client/Implementation pattern, cross-module contracts, no foreign keys across domains, ArchUnit enforcement, migration to microservices. Use only when structuring monolith for future microservice extraction or when refactoring tightly-coupled monolith.
---

# Modular Monolith Patterns

Based on "Modular Monolith: Arsitektur Terbaik Sebelum Microservices" by Programmer Zaman Now.

Strong boundaries like microservices, simple deployment like monolith.

## When to Activate

- Designing new monolith that may become microservices later
- Refactoring traditional monolith with spaghetti code
- Planning domain separation for e-commerce or complex business
- Enforcing architecture boundaries between modules
- Migrating from monolith to microservices incrementally

## When NOT to Use Microservices

- Business is new / small team (< 5 developers)
- User base is small / no scale requirements
- Team can't handle complex infrastructure (K8s, service discovery, API gateway)
- No need for independent deployment per module

Microservices problems:
- Complex infrastructure (CI/CD, deployment, monitoring)
- Network overhead (HTTP/gRPC calls instead of direct)
- Distributed transactions (saga pattern, 2PC)
- Over-engineering for small teams

## Core Pattern: Client/Implementation

Each domain module is split into two parts:

```
module-product/
├── product-client/        # Interface/contract (exposed to other modules)
│   ├── ProductClient.java
│   └── ProductClientResponse.java
└── product-implementation/ # Actual logic (internal)
    ├── ProductService.java
    ├── ProductController.java
    ├── ProductRepository.java
    └── Product.java
```

**Client** = interface/contract that other modules can use
**Implementation** = actual business logic, hidden from other modules

### Rules

1. Only expose what other modules need (not full CRUD)
2. Response objects are minimal (only needed fields)
3. Other modules depend on Client, never on Implementation
4. Implementation can change without touching callers

## Domain Separation (E-Commerce Example)

```
e-commerce/
├── customer/          # Profile, data pelanggan
├── product/           # Katalog barang
├── order/             # Orkestrasi order (calls customer, product, payment, notification)
├── payment/           # Pembayaran
├── notification/      # Email/SMS/push
└── app/               # Aggregator — runs all modules as single monolith
```

### Module Dependencies

```
order → customer-client (get customer data)
order → product-client (get product, reduce stock)
order → payment-client (create payment)
order → notification-client (send notification)
```

Order module NEVER directly calls customer/product/payment/notification implementation.

## No Foreign Keys Across Domains

**Critical rule:** No database foreign keys between modules.

```sql
-- BAD: order table has FK to customer table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(id)  -- NO!
);

-- GOOD: customer_id is just a number, no FK
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    customer_id BIGINT  -- just a number, no constraint
);
```

### Why No FK?

- Modules may split to different databases later
- FK creates tight coupling at DB level
- Joins across modules become impossible (which is intentional)
- Each module owns its own tables exclusively

### Handling Cross-Module Data

Instead of JOIN, use two-step query:

```java
// BAD: direct join
SELECT o.*, c.name FROM orders o JOIN customers c ON o.customer_id = c.id;

// GOOD: two-step
List<Order> orders = orderRepository.findAll();
List<Long> customerIds = orders.stream().map(Order::getCustomerId).toList();
Map<Long, Customer> customers = customerClient.getByIds(customerIds);  // batch call
```

## Expose Only What's Needed

```java
// Product module has full CRUD
public interface ProductService {
    Product create(CreateProductRequest request);
    Product getById(Long id);
    List<Product> search(String query);
    Product update(Long id, UpdateProductRequest request);
    void delete(Long id);
    void decreaseStock(Long id, int quantity);
    void restoreStock(Long id, int quantity);
}

// But ProductClient only exposes what other modules need
public interface ProductClient {
    ProductClientResponse getById(Long id);
    List<ProductClientResponse> search(String query);
    void decreaseStock(Long id, int quantity);
    void restoreStock(Long id, int quantity);
}
```

Response objects are minimal:

```java
// Full entity has 50 columns
public class Product {
    Long id, String name, String description, BigDecimal price, 
    Integer stock, Long categoryId, Long brandId, ...  // 50 fields
}

// Client response only exposes what callers need
public class ProductClientResponse {
    Long id, String name, BigDecimal price, Integer stock  // 4 fields
}
```

## Enforce Architecture with ArchUnit

Prevent developers from breaking module boundaries:

```java
@AnalyzeClasses(packages = "com.example")
public class ArchitectureTest {

    @ArchTest
    static final ArchRule order_should_only_depend_on_clients =
        classes()
            .that().resideInAPackage("..order..")
            .should().onlyDependOnClassesThat()
            .resideInAnyPackage(
                "..order..",
                "..customer-client..",
                "..product-client..",
                "..payment-client..",
                "..notification-client..",
                "java..",
                "org.springframework.."
            );

    @ArchTest
    static final ArchRule modules_should_not_cross_depend =
        noClasses()
            .that().resideInAPackage("..product-implementation..")
            .should().dependOnClassesThat()
            .resideInAPackage("..order..");
}
```

If someone directly imports `ProductService` from `order` module → build fails.

## Migration to Microservices

### Step 1: Extract Module

When a module needs independent scaling:

1. Create new microservice (e.g., `product-service`)
2. Move implementation code to microservice
3. Change Client implementation to HTTP/gRPC caller
4. **Caller code stays untouched**

```java
// Before: direct implementation
@Component
public class ProductClientImpl implements ProductClient {
    @Autowired
    private ProductService productService;
    
    public ProductClientResponse getById(Long id) {
        return productService.getById(id);  // direct call
    }
}

// After: HTTP call to microservice
@Component
public class ProductHttpClient implements ProductClient {
    @Autowired
    private RestTemplate restTemplate;
    
    public ProductClientResponse getById(Long id) {
        return restTemplate.getForObject(
            "http://product-service/api/products/" + id, 
            ProductClientResponse.class
        );  // HTTP call
    }
}
```

### Step 2: Zero Caller Changes

```java
// Order service — UNTOUCHED
@Service
public class OrderService {
    @Autowired
    private ProductClient productClient;  // still uses interface
    
    public Order createOrder(CreateOrderRequest request) {
        ProductClientResponse product = productClient.getById(request.getProductId());
        // ... same code as before
    }
}
```

Order doesn't know or care that Product is now a separate microservice.

### Step 3: Event-Driven Migration

For fire-and-forget communication (e.g., notifications):

```java
// Before: direct call
@Component
public class NotificationClientImpl implements NotificationClient {
    @Autowired
    private NotificationService notificationService;
    
    public void send(NotificationRequest request) {
        notificationService.send(request);  // sync, direct
    }
}

// After: Kafka publish
@Component
public class NotificationKafkaClient implements NotificationClient {
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void send(NotificationRequest request) {
        kafkaTemplate.send("notification-events", request);  // async, event-driven
    }
}
```

Order module → zero changes. Only notification Client implementation changed.

## Anti-Patterns

```java
// BAD: Order directly imports Product implementation
import com.example.product.service.ProductService;  // NO!

// BAD: Cross-module foreign key
REFERENCES products(id)  // NO!

// BAD: Exposing full entity via client
public interface ProductClient {
    Product getById(Long id);  // returns full entity with 50 fields
}

// GOOD: Expose minimal response
public interface ProductClient {
    ProductClientResponse getById(Long id);  // returns 4 fields
}
```

## Checklist

- [ ] Each domain has client + implementation modules
- [ ] Client only exposes what other modules need
- [ ] Response objects are minimal (not full entities)
- [ ] No foreign keys across module boundaries
- [ ] ArchUnit tests enforce module boundaries
- [ ] Order module depends on clients, not implementations
- [ ] Migration path: change Client implementation only, caller untouched

## Source

Video: "Modular Monolith: Arsitektur Terbaik Sebelum Microservices" by Programmer Zaman Now
Source code: https://github.com/ProgrammerZamanNow/modular-monolith-demo

For the WHEN/WHY of evolution stages (when to add API gateway, broker, cache layer), see `modular-monolith-decisions`.
