# Testing Intmen-lib

This directory contains tests for the Intmen-lib library. The tests are written using Jest and TypeScript.

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests with watch mode (automatically rerun when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The tests follow the same structure as the source code:

- `tests/core/` - Tests for core classes and managers
  - `tests/core/builders/` - Tests for builder classes
- `tests/utils/` - Tests for utility classes
- `tests/setup.ts` - Global test setup and mocks

## Writing Tests

### Basic Test Structure

```typescript
import { YourClass } from '../../src/path/to/your/class';

describe('YourClass', () => {
  // Optional setup before each test
  beforeEach(() => {
    // Setup code
  });

  // Optional teardown after each test
  afterEach(() => {
    // Cleanup code
  });

  it('should do something specific', () => {
    // Arrange - set up test data
    const instance = new YourClass();
    
    // Act - perform the action being tested
    const result = instance.someMethod();
    
    // Assert - verify the expected outcome
    expect(result).toBe(expectedValue);
  });
});
```

### Mocking Discord.js

The `tests/setup.ts` file contains mocks for Discord.js classes and methods. If you need to use additional Discord.js functionality in your tests, add it to the mock in `setup.ts`.

### Testing Guidelines

1. Each test should cover a single functionality or aspect
2. Use descriptive test names that explain what is being tested
3. Follow the Arrange-Act-Assert pattern
4. Mock external dependencies and services
5. Test edge cases and error conditions

## Coverage

Run `npm run test:coverage` to generate a coverage report. This will show which parts of the code are covered by tests and which are not.

The coverage report can be found in the `coverage/` directory after running the coverage command.

## Continuous Integration

These tests are automatically run in the CI pipeline to ensure that changes do not break existing functionality. 