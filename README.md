# tree-sitter-holyc

[tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for **HolyC** (TempleOS / Terry Davis dialect).

## Install

**Rust**

```toml
tree-sitter-holyc = "0.0.1"
```

```rust
use tree_sitter_holyc::LANGUAGE;

parser.set_language(&LANGUAGE.into())?;
```

**npm** (CLI only, for grammar development)

```bash
npm install
npx tree-sitter generate
```

## Supported syntax (v0)

- Types: `U0`, `I8`–`I64`, `U8`–`U64`, `F32`, `F64`, `Bool`, `auto`, pointers on type
- Functions, blocks, `if` / `while` / `for`, `return` / `break` / `continue`
- Print-as-statement: `"format", args…;`
- Bare calls: `Name;` (no parentheses)
- Top-level declarations and statements
- C-like expressions

Not covered yet: classes, `extern`, inline asm strings, preprocessor, full declarators (`F64 *x`).

## Develop

```bash
npm install
npx tree-sitter generate
npx tree-sitter test
cargo test
```

Tests live in `test/corpus/`. Example sources in `test/fixtures/`.

## License

ISC
