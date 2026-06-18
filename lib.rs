//! HolyC grammar for [tree-sitter](https://tree-sitter.github.io/tree-sitter/).

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_holyc() -> *const ();
}

/// Tree-sitter language for HolyC.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_holyc) };

/// Static node types for this grammar.
pub const NODE_TYPES: &str = include_str!("src/node-types.json");

/// Highlight queries for HolyC syntax.
pub const HIGHLIGHTS_QUERY: &str = include_str!("queries/highlights.scm");

#[cfg(test)]
mod tests {
    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading HolyC language");
    }
}