# Android Clean Architecture — Reference

## Module Structure

```
project/
├── app/                  # Android entry point, DI wiring
├── core/                 # Shared utilities, base classes, error types
├── domain/               # UseCases, domain models, repository interfaces (pure Kotlin)
├── data/                 # Repository implementations, DataSources, DB, network
├── presentation/         # Screens, ViewModels, UI models, navigation
├── design-system/        # Reusable Compose components, theme, typography
└── feature/              # Feature modules (optional)
    ├── auth/
    └── profile/
```

### Dependency Rules
```
app → presentation, domain, data, core
presentation → domain, design-system, core
data → domain, core
domain → core (or no dependencies)
core → (nothing)
```

**Critical**: `domain` must NEVER depend on `data`, `presentation`, or any framework.

## Domain Layer

### UseCase Pattern
```kotlin
class GetItemsByCategoryUseCase(private val repository: ItemRepository) {
    suspend operator fun invoke(category: String): Result<List<Item>> {
        return repository.getItemsByCategory(category)
    }
}
class ObserveUserProgressUseCase(private val repository: UserRepository) {
    operator fun invoke(userId: String): Flow<UserProgress> {
        return repository.observeProgress(userId)
    }
}
```

### Domain Models (pure Kotlin, no annotations)
```kotlin
data class Item(val id: String, val title: String, val description: String,
    val tags: List<String>, val status: Status, val category: String)
enum class Status { DRAFT, ACTIVE, ARCHIVED }
```

### Repository Interfaces
```kotlin
interface ItemRepository {
    suspend fun getItemsByCategory(category: String): Result<List<Item>>
    suspend fun saveItem(item: Item): Result<Unit>
    fun observeItems(): Flow<List<Item>>
}
```

## Data Layer

### Repository Implementation
```kotlin
class ItemRepositoryImpl(
    private val localDataSource: ItemLocalDataSource,
    private val remoteDataSource: ItemRemoteDataSource
) : ItemRepository {
    override suspend fun getItemsByCategory(category: String): Result<List<Item>> = runCatching {
        val remote = remoteDataSource.fetchItems(category)
        localDataSource.insertItems(remote.map { it.toEntity() })
        localDataSource.getItemsByCategory(category).map { it.toDomain() }
    }
    // ...
}
```

### Room Database
```kotlin
@Entity(tableName = "items")
data class ItemEntity(@PrimaryKey val id: String, val title: String, val description: String, val tags: String, val status: String, val category: String)

@Dao
interface ItemDao {
    @Query("SELECT * FROM items WHERE category = :category") suspend fun getByCategory(category: String): List<ItemEntity>
    @Upsert suspend fun upsert(items: List<ItemEntity>)
    @Query("SELECT * FROM items") fun observeAll(): Flow<List<ItemEntity>>
}
```

### Ktor Network Client
```kotlin
class ItemRemoteDataSource(private val client: HttpClient) {
    suspend fun fetchItems(category: String): List<ItemDto> = client.get("api/items") { parameter("category", category) }.body()
}
```

## Dependency Injection

### Koin
```kotlin
val domainModule = module { factory { GetItemsByCategoryUseCase(get()) } }
val dataModule = module {
    single<ItemRepository> { ItemRepositoryImpl(get(), get()) }
    single { ItemRemoteDataSource(get()) }
}
```

### Hilt
```kotlin
@Module @InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds abstract fun bindItemRepository(impl: ItemRepositoryImpl): ItemRepository
}
```

## Error Handling

### Result/Try Pattern
```kotlin
sealed interface Try<out T> {
    data class Success<T>(val value: T) : Try<T>
    data class Failure(val error: AppError) : Try<Nothing>
}
```

## Anti-Patterns
- Importing Android framework classes in `domain`
- Exposing DB entities/DTOs to the UI layer
- Business logic in ViewModels
- `GlobalScope` or unstructured coroutines
- Fat repository implementations
- Circular module dependencies
