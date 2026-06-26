# Compose Multiplatform — Reference

## State Management

### ViewModel + Single State Object
```kotlin
data class ItemListState(val items: List<Item> = emptyList(), val isLoading: Boolean = false, val error: String? = null, val searchQuery: String = "")

class ItemListViewModel(private val getItems: GetItemsUseCase) : ViewModel() {
    private val _state = MutableStateFlow(ItemListState())
    val state: StateFlow<ItemListState> = _state.asStateFlow()

    fun onSearch(query: String) { _state.update { it.copy(searchQuery = query) }; loadItems(query) }

    private fun loadItems(query: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            getItems(query).fold(
                onSuccess = { items -> _state.update { it.copy(items = items, isLoading = false) } },
                onFailure = { e -> _state.update { it.copy(error = e.message, isLoading = false) } }
            )
        }
    }
}
```

### Collecting State in Compose
```kotlin
@Composable
fun ItemListScreen(viewModel: ItemListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    ItemListContent(state = state, onSearch = viewModel::onSearch)
}
```

### Event Sink Pattern (single lambda instead of many callbacks)
```kotlin
sealed interface ItemListEvent { data class Search(val query: String) : ItemListEvent; data class Delete(val itemId: String) : ItemListEvent; data object Refresh : ItemListEvent }
// In ViewModel: fun onEvent(event: ItemListEvent) { when(event) { ... } }
// In Composable: ItemListContent(state, onEvent = viewModel::onEvent)
```

## Navigation (Type-Safe, Compose Navigation 2.8+)

```kotlin
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController, startDestination = HomeRoute) {
        composable<HomeRoute> { HomeScreen(onNavigateToDetail = { navController.navigate(DetailRoute(it)) }) }
        composable<DetailRoute> { DetailScreen(id = it.toRoute<DetailRoute>().id) }
        dialog<ConfirmDeleteRoute> { ConfirmDeleteDialog(itemId = it.toRoute<ConfirmDeleteRoute>().itemId) }
    }
}
```

## Composable Design

### Slot-Based APIs
```kotlin
@Composable
fun AppCard(modifier: Modifier = Modifier, header: @Composable () -> Unit = {}, content: @Composable ColumnScope.() -> Unit, actions: @Composable RowScope.() -> Unit = {}) { ... }
```

### Modifier Ordering: padding → clip → background → clickable

## KMP Platform-Specific UI (expect/actual)
```kotlin
// commonMain: @Composable expect fun PlatformStatusBar(darkIcons: Boolean)
// androidMain: actual fun ... { systemUiController.setStatusBarColor(...) }
```

## Performance
- Mark data classes `@Immutable` for skippable recomposition
- Use `key()` in LazyList for stable identity
- `derivedStateOf` for deferred reads
- Precompute filtered lists in `remember {}`

## Theming (Material 3 Dynamic)
```kotlin
@Composable
fun AppTheme(darkTheme: Boolean = isSystemInDarkTheme(), dynamicColor: Boolean = true, content: @Composable () -> Unit) {
    val colorScheme = when { dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> if (darkTheme) dynamicDarkColorScheme(LocalContext.current) else dynamicLightColorScheme(LocalContext.current); darkTheme -> darkColorScheme(); else -> lightColorScheme() }
    MaterialTheme(colorScheme = colorScheme, content = content)
}
```

## Anti-Patterns
- `mutableStateOf` in ViewModels (use `MutableStateFlow`)
- Passing `NavController` deep into composables (pass lambdas)
- Heavy computation in `@Composable` functions
- `LaunchedEffect(Unit)` as ViewModel init substitute
- New object instances in composable parameters
