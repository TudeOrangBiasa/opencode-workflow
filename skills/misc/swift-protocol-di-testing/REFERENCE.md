# Swift Protocol-Based DI — Reference

> Full examples. See SKILL.md for when-to-use.

## Core Pattern

1. Define small, focused protocols (FileSystemProviding, FileAccessorProviding, BookmarkStorageProviding)
2. Create default (production) implementations
3. Create mock implementations for testing (configurable errors)
4. Inject dependencies with default parameters
5. Write tests with Swift Testing

## Mock Implementation Pattern

```swift
public final class MockFileAccessor: FileAccessorProviding, @unchecked Sendable {
    public var files: [URL: Data] = [:]
    public var readError: Error?
    public var writeError: Error?

    public func read(from url: URL) throws -> Data {
        if let error = readError { throw error }
        guard let data = files[url] else { throw CocoaError(.fileReadNoSuchFile) }
        return data
    }
    public func write(_ data: Data, to url: URL) throws {
        if let error = writeError { throw error }
        files[url] = data
    }
}
```

## Test Examples (Swift Testing)

- Missing container test
- Read data test
- Read error handling test

## Best Practices

Single responsibility protocols, Sendable conformance for actor boundaries, default parameters for production code, error simulation in mocks, only mock boundaries.

## Anti-Patterns

God protocols, mocking internal types, #if DEBUG conditionals instead of DI, forgetting Sendable, over-engineering.
