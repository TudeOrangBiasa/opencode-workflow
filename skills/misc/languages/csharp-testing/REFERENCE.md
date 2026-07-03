# C# Testing — Reference

## Framework Stack
| Tool | Purpose |
|---|---|
| xUnit | Test framework |
| FluentAssertions | Readable assertions |
| NSubstitute/Moq | Mocking |
| Testcontainers | Real infra for integration tests |
| WebApplicationFactory | ASP.NET Core integration tests |
| Bogus | Test data generation |

## Unit Test Patterns

### Arrange-Act-Assert
```csharp
public sealed class OrderServiceTests {
    private readonly IOrderRepository _repository = Substitute.For<IOrderRepository>();
    private readonly OrderService _sut;
    public OrderServiceTests() { _sut = new OrderService(_repository); }

    [Fact]
    public async Task PlaceOrderAsync_ReturnsSuccess_WhenRequestIsValid() {
        var result = await _sut.PlaceOrderAsync(request, CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
        result.Value.CustomerId.Should().Be("cust-123");
    }
}
```

### Parameterized Tests
```csharp
[Theory]
[InlineData("", false)]
[InlineData("user@example.com", true)]
public void IsValidEmail_ReturnsExpected(string email, bool expected) { ... }
```

## Mocking with NSubstitute
```csharp
_repository.FindByIdAsync(orderId, Arg.Any<CancellationToken>()).Returns((Order?)null);
await _repository.Received(1).AddAsync(Arg.Is<Order>(o => o.CustomerId == "cust-1"), Arg.Any<CancellationToken>());
```

## ASP.NET Core Integration Tests
```csharp
public sealed class OrderApiTests : IClassFixture<WebApplicationFactory<Program>> {
    private readonly HttpClient _client;
    public OrderApiTests(WebApplicationFactory<Program> factory) {
        _client = factory.WithWebHostBuilder(builder => {
            builder.ConfigureServices(services => {
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetOrder_Returns404_WhenNotFound() {
        var response = await _client.GetAsync($"/api/orders/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
```

### Testcontainers for Real DB
```csharp
public sealed class PostgresOrderRepositoryTests : IAsyncLifetime {
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder().WithImage("postgres:16-alpine").Build();
    // await _postgres.StartAsync(); use Npgsql connection
}
```

## Test Organization
```
tests/MyApp.UnitTests/Services/
tests/MyApp.IntegrationTests/Api/
tests/MyApp.TestHelpers/Builders/
```

## Anti-Patterns
- Testing implementation details → test behavior
- Shared mutable state → fresh instance per test
- `Thread.Sleep` in async → `Task.Delay`
- Ignoring `CancellationToken` → always pass it
- Giant assertions → one logical assertion per test

## Running Tests
```bash
dotnet test
dotnet test --collect:"XPlat Code Coverage"
dotnet test --filter "FullyQualifiedName~OrderService"
dotnet watch test --project tests/MyApp.UnitTests/
```
