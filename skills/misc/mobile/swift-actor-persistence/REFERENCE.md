# Swift Actors for Thread-Safe Persistence — Reference

> Full code examples. See SKILL.md for when-to-use.

## Core Pattern: Actor-Based Repository

```swift
public actor LocalRepository<T: Codable & Identifiable> where T.ID == String {
    private var cache: [String: T] = [:]
    private let fileURL: URL

    public init(directory: URL = .documentsDirectory, filename: String = "data.json") {
        self.fileURL = directory.appendingPathComponent(filename)
        self.cache = Self.loadSynchronously(from: fileURL)
    }

    public func save(_ item: T) throws {
        cache[item.id] = item
        try persistToFile()
    }

    public func delete(_ id: String) throws {
        cache[id] = nil
        try persistToFile()
    }

    public func find(by id: String) -> T? { cache[id] }
    public func loadAll() -> [T] { Array(cache.values) }

    private func persistToFile() throws {
        let data = try JSONEncoder().encode(Array(cache.values))
        try data.write(to: fileURL, options: .atomic)
    }

    private static func loadSynchronously(from url: URL) -> [String: T] {
        guard let data = try? Data(contentsOf: url),
              let items = try? JSONDecoder().decode([T].self, from: data) else { return [:] }
        return Dictionary(uniqueKeysWithValues: items.map { ($0.id, $0) })
    }
}
```

## Usage with @Observable ViewModel

```swift
@Observable
final class QuestionListViewModel {
    private(set) var questions: [Question] = []
    private let repository: LocalRepository<Question>

    func load() async { questions = await repository.loadAll() }
    func add(_ question: Question) async throws {
        try await repository.save(question)
        questions = await repository.loadAll()
    }
}
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Actor (not class + lock) | Compiler-enforced thread safety |
| In-memory cache + file | Fast reads from cache, durable writes |
| Synchronous init loading | Avoids async init complexity |
| Dictionary keyed by ID | O(1) lookups |
| Generic Codable & Identifiable | Reusable across model types |
| Atomic file writes | Prevents partial writes on crash |

## Best Practices

- Sendable types for all data crossing actor boundaries
- Minimal public API
- .atomic writes for crash safety
- Combine with @Observable for reactive UI

## Anti-Patterns

DispatchQueue/NSLock instead of actors, exposing internal cache, forgetting await on actor method calls, using nonisolated to bypass actor isolation.
