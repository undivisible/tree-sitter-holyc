# tree-sitter-holyc

HolyC grammar for [tree-sitter](https://tree-sitter.github.io/tree-sitter/), aimed at
[inauguration](https://github.com/semitechnological/inauguration) Core IR extraction.

Repository: **https://github.com/undivisible/tree-sitter-holyc**

## Syntax sources (existing compilers / transpilers)

| Project | Role | Notes |
|---------|------|--------|
| [Jamesbarford/holyc-lang](https://github.com/Jamesbarford/holyc-lang) | Full HC compiler (C), SSA IR, x86_64/aarch64 | `U0 Main()`, `"fmt", args;` prints, `Main;` bare calls, `auto`, classes/inheritance in README |
| [Ma11ock/holyc](https://github.com/Ma11ock/holyc) (hclang) | LLVM AOT front | Same print-as-string-stmt, top-level `Main;`, C-like control flow |
| [jamesalbert/HolyC-for-Linux](https://github.com/jamesalbert/HolyC-for-Linux) | secularize HC→C | `Print(...)`, `U0`/`I16`/`F64` types, top-level statements |
| TempleOS / Terry Davis | Reference language | Bare `identifier;` calls, inline asm strings, `U8*` strings |

No published **tree-sitter-holyc** on GitHub/npm at time of writing; this repo is greenfield.

## Grammar v0 coverage

- HolyC type keywords (`U0`, `I8`…`F64`, `auto`) and pointer suffix on type
- Functions, blocks, `if` / `while` / `for` / `return` / `break` / `continue`
- **Print statements**: `"format", expr, …;` (TempleOS style)
- **Bare calls**: `Main;` (no parentheses)
- Top-level declarations, expressions, and bare calls
- C-like expressions (calls, fields, subscripts, binary/unary)

**Not yet**: classes, `extern`, asm string statements, range-for, preprocessor, old-style param lists, full declarator grammar (`F64 *s` needs C-style declarators).

## Develop

```bash
cd grammars/tree-sitter-holyc
npm install
npx tree-sitter generate
npx tree-sitter test    # needs a working C toolchain (Xcode CLT on macOS)
cargo test              # Rust binding smoke test (also needs cc)
```

Corpus samples are derived from holyc-lang / hclang / secularize examples in `test/corpus/basics.txt`.

## inauguration wiring (later)

1. `tree-sitter-holyc = { path = "../../tree-sitter-holyc" }` or crates.io once published in `in-cli/Cargo.toml`
2. Add `ParserId::HolyC`, extension `hc` / `HC`, `tree_front::extract_holyc`
3. Map `function_definition`, `print_expression`, `bare_call_statement` → `UnifiedModule`