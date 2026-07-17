# .NET Patterns — Reference

## Core Principles
1. **Immutability**: records and init-only properties
2. **Explicit**: clear nullability, access modifiers, intent
3. **Abstractions**: interfaces for boundaries, DI registration

## Async/Await
```csharp
// Good: async all the way with CancellationToken
public async Task<OrderSummary> GetOrderSummaryAsync(Guid orderId, CancellationToken ct) {
    var order = await _repository.FindByIdAsync(orderId, ct) ?? throw new NotFoundException();
    var customer = await _customerService.GetAsync(order.CustomerId, ct);
    return new OrderSummary(order, customer);
}

// Good: parallel independent operations
await Task.WhenAll(ordersTask, metricsTask, alertsTask);
```

## Options Pattern
```csharp
public sealed class SmtpOptions {
    public const string SectionName = "Smtp";
    public required string Host { get; init; }
    public int Port { get; init; }
}
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection(SmtpOptions.SectionName));
```

## Result Pattern
```csharp
public sealed record Result<T> {
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);
}
```

## EF Core Repository
```csharp
public sealed class SqlOrderRepository : IOrderRepository {
    private readonly AppDbContext _db;
    public async Task<Order?> FindByIdAsync(Guid id, CancellationToken ct) =>
        await _db.Orders.Include(o => o.Items).AsNoTracking().FirstOrDefaultAsync(o => o.Id == id, ct);
    public async Task AddAsync(Order order, CancellationToken ct) { _db.Orders.Add(order); await _db.SaveChangesAsync(ct); }
}
```

## Middleware
```csharp
public sealed class RequestTimingMiddleware {
    private readonly RequestDelegate _next;
    public async Task InvokeAsync(HttpContext context) {
        var sw = Stopwatch.StartNew();
        try { await _next(context); }
        finally { sw.Stop(); _logger.LogInformation("{Method} {Path} took {ElapsedMs}ms", ...); }
    }
}
```

## Minimal APIs
```csharp
var orders = app.MapGroup("/api/orders").RequireAuthorization();
orders.MapGet("/{id:guid}", async (Guid id, IOrderRepository repo, CancellationToken ct) => {
    var order = await repo.FindByIdAsync(id, ct);
    return order is not null ? TypedResults.Ok(order) : TypedResults.NotFound();
});
```

## Guard Clauses
```csharp
ArgumentNullException.ThrowIfNull(request);
if (request.Amount <= 0) throw new ArgumentOutOfRangeException(...);
```

## Anti-Patterns
| Anti-Pattern | Fix |
|---|---|
| `async void` | Return Task |
| `.Result`/`.Wait()` | Use await |
| Catch Exception {} | Handle or rethrow |
| `new Service()` in constructors | Constructor injection |
| Public fields | Properties |
| Mutable static state | DI scoping |
