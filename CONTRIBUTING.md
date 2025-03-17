# Contributing Guide

Thank you for your interest in improving Intmen-lib! This guide will help you set up the project for development and prepare your changes for submission.

## Getting Started

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests to make sure everything works: `npm test`

## Development

### Branching

Create a separate branch for each feature or fix you're developing:

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bugfix
```

### Project Structure

- `/src` - library source code
  - `/core` - core classes and logic
  - `/types` - TypeScript types and interfaces
  - `/utils` - helper functions and classes
- `/examples` - usage examples
- `/tests` - unit tests

### Code Style

The project uses ESLint and Prettier to ensure consistent code style. Before submitting changes, run:

```bash
npm run lint
```

### Testing

Always write tests for new features and bug fixes:

```bash
npm test
```

## Submitting Changes

1. Make sure your code adheres to the project style: `npm run lint`
2. Make sure tests pass: `npm test`
3. Create a clear and detailed commit: `git commit -m "Add new feature: X"`
4. Push changes: `git push origin feature/my-feature`
5. Create a Pull Request on GitHub

## Semantic Versioning

Intmen-lib follows [semantic versioning](https://semver.org/). Please consider this when proposing changes:

- **Patch (1.0.x)**: backwards-compatible bug fixes
- **Minor (1.x.0)**: backwards-compatible new features
- **Major (x.0.0)**: breaking changes

## Issue Reporting

If you found a bug or have suggestions for improvement:

1. Check existing issues to avoid duplicates
2. Create a new issue with a detailed description of the problem or suggestion

---

Thank you for your contribution! 💙 