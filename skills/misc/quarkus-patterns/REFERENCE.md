# Quarkus Development Patterns — Reference

> Full code examples and configuration. See SKILL.md for when-to-use.

## Service Layer with Multiple Dependencies

```java
@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class OrderProcessingService {
    private final OrderValidator orderValidator;
    private final EventService eventService;
    private final OrderRepository orderRepository;
    private final FulfillmentPublisher fulfillmentPublisher;
    private final AuditPublisher auditPublisher;

    @Transactional
    public OrderReceipt process(CreateOrderCommand command) {
        ValidationResult validation = orderValidator.validate(command);
        if (!validation.valid()) {
            eventService.createErrorEvent(command, "ORDER_REJECTED", validation.message());
            throw new WebApplicationException(validation.message(), Response.Status.BAD_REQUEST);
        }
        Order order = Order.from(command);
        orderRepository.persist(order);
        OrderReceipt receipt = OrderReceipt.from(order);
        fulfillmentPublisher.publishAsync(receipt);
        auditPublisher.publish("ORDER_ACCEPTED", receipt);
        eventService.createSuccessEvent(receipt, "ORDER_ACCEPTED");
        log.info("Processed order {}", order.id);
        return receipt;
    }
}
```

**Key Patterns:** `@RequiredArgsConstructor`, `@Slf4j`, `@Transactional`, validate before persist/publish, event tracking.

## Custom Logging Context Pattern (Logback)

Java code with LogContext propagation and LogstashEncoder configuration.

## Event Service Pattern

Success/error event creation with JSON serialization and repository persistence.

## Camel Message Publishing (RabbitMQ)

ProducerTemplate + RouteBuilder for RabbitMQ integration.

## Camel Direct Routes (In-Memory)

Document processing pipeline with error handling, conditional routing.

## Camel File Processing

File monitoring with move/moveFailed strategies.

## REST API Structure

JAX-RS resource with GET/POST endpoints, pagination, validation, URI creation.

## Repository Pattern (Panache Repository)

findByStatus, findByReferenceNumber, countByStatusAndDate.

## Service Layer with Transactions

Service methods with `@Transactional`, event publishing.

## DTOs and Validation

Record-based DTOs with Bean Validation annotations.

## Exception Mapping

ValidationExceptionMapper, GenericExceptionMapper with structured error responses.

## CompletableFuture Async Operations

Async S3 upload with LogContext propagation.

## Caching

@CacheResult, @CacheInvalidate, @CacheInvalidateAll.

## Configuration as YAML

Profile-aware application.yml for dev/test/prod with RabbitMQ and datasource config.

## Health Checks

DatabaseHealthCheck (Readiness), CamelHealthCheck (Liveness).

## Dependencies (Maven)

Quarkus BOM, Camel BOM, Lombok, Logback/Logstash dependency declarations.

## Best Practices

Architecture, event-driven, logging, async, configuration, validation, transactions, testing, Quarkus-specific.
