/**
 * @file HolyC grammar for tree-sitter
 * @license MIT
 *
 * Syntax informed by TempleOS / Terry Davis HolyC, Jamesbarford/holyc-lang,
 * Ma11ock/holyc (hclang), and jamesalbert/HolyC-for-Linux (secularize).
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  ASSIGN: 1,
  CALL: 2,
  UNARY: 3,
  MUL: 4,
  ADD: 5,
  REL: 6,
  AND: 7,
  OR: 8,
};

const HOLY_TYPES = [
  "U0",
  "I8",
  "I16",
  "I32",
  "I64",
  "U8",
  "U16",
  "U32",
  "U64",
  "F32",
  "F64",
  "Bool",
  "auto",
];

module.exports = grammar({
  name: "holyc",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.type_specifier, $.expression],
    [$.declaration, $.expression_statement],
    [$.bare_call_statement, $.expression_statement],
  ],

  supertypes: ($) => [$.statement, $.expression],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._top_level_item),

    _top_level_item: ($) =>
      choice(
        $.function_definition,
        $.declaration,
        $.expression_statement,
        $.bare_call_statement,
      ),

    comment: ($) =>
      token(choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))),

    function_definition: ($) =>
      seq(
        field("type", $.type_specifier),
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        field("body", $.compound_statement),
      ),

    parameter_list: ($) =>
      seq("(", commaSep(optional($.parameter_declaration)), ")"),

    parameter_declaration: ($) =>
      seq($.type_specifier, field("name", $.identifier)),

    compound_statement: ($) => seq("{", repeat($._block_item), "}"),

    _block_item: ($) =>
      choice(
        $.declaration,
        $.statement,
        $.expression_statement,
        $.bare_call_statement,
      ),

    statement: ($) =>
      choice(
        $.compound_statement,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
      ),

    if_statement: ($) =>
      prec.right(
        seq(
          "if",
          field("condition", $.parenthesized_expression),
          field("consequence", $.statement),
          optional(seq("else", field("alternative", $.statement))),
        ),
      ),

    while_statement: ($) =>
      seq(
        "while",
        field("condition", $.parenthesized_expression),
        field("body", $.statement),
      ),

    for_statement: ($) =>
      seq(
        "for",
        "(",
        choice($.declaration, $.expression_statement, ";"),
        optional($.expression),
        ";",
        optional($.expression),
        ")",
        field("body", $.statement),
      ),

    return_statement: ($) =>
      seq("return", optional(field("value", $.expression)), ";"),

    break_statement: ($) => seq("break", ";"),
    continue_statement: ($) => seq("continue", ";"),

    declaration: ($) =>
      seq(
        field("type", $.type_specifier),
        commaSep1(
          seq(
            field("name", $.identifier),
            optional(seq("=", field("value", $.expression))),
          ),
        ),
        ";",
      ),

    expression_statement: ($) =>
      choice(
        seq(field("print", $.print_expression), ";"),
        prec(-1, seq($.expression, ";")),
      ),

    bare_call_statement: ($) =>
      prec(2, seq(field("name", $.identifier), ";")),

    print_expression: ($) =>
      prec(
        PREC.CALL,
        seq(
          field("format", $.string_literal),
          repeat(seq(",", field("argument", $.expression))),
        ),
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    expression: ($) =>
      choice(
        $.assignment_expression,
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.field_expression,
        $.subscript_expression,
        $.identifier,
        $.number_literal,
        $.string_literal,
        $.char_literal,
        $.parenthesized_expression,
      ),

    assignment_expression: ($) =>
      prec.right(
        PREC.ASSIGN,
        seq(
          field("left", $.identifier),
          "=",
          field("right", $.expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(PREC.OR, seq(field("left", $.expression), "||", field("right", $.expression))),
        prec.left(PREC.AND, seq(field("left", $.expression), "&&", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), "==", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), "!=", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), "<", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), "<=", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), ">", field("right", $.expression))),
        prec.left(PREC.REL, seq(field("left", $.expression), ">=", field("right", $.expression))),
        prec.left(PREC.ADD, seq(field("left", $.expression), "+", field("right", $.expression))),
        prec.left(PREC.ADD, seq(field("left", $.expression), "-", field("right", $.expression))),
        prec.left(PREC.MUL, seq(field("left", $.expression), "*", field("right", $.expression))),
        prec.left(PREC.MUL, seq(field("left", $.expression), "/", field("right", $.expression))),
        prec.left(PREC.MUL, seq(field("left", $.expression), "%", field("right", $.expression))),
      ),

    unary_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(field("operator", choice("+", "-", "!", "~", "&", "*")), field("argument", $.expression)),
      ),

    call_expression: ($) =>
      prec(
        PREC.CALL,
        seq(
          field("function", choice($.identifier, $.field_expression)),
          field("arguments", $.argument_list),
        ),
      ),

    field_expression: ($) =>
      prec(
        PREC.CALL,
        seq(field("object", $.expression), ".", field("field", $.identifier)),
      ),

    subscript_expression: ($) =>
      prec(
        PREC.CALL,
        seq(
          field("object", $.expression),
          "[",
          field("index", $.expression),
          "]",
        ),
      ),

    argument_list: ($) => seq("(", commaSep(optional($.expression)), ")"),

    type_specifier: ($) =>
      choice(
        ...HOLY_TYPES.map((t) => t),
        seq(
          field("base", choice(...HOLY_TYPES.map((t) => t))),
          "*",
          repeat("*"),
        ),
      ),

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,

    number_literal: ($) =>
      token(
        choice(
          /0[xX][0-9a-fA-F]+(\.[0-9a-fA-F]*)?([pP][+-]?[0-9]+)?/,
          /0[bB][01]+/,
          /[0-9]+(\.[0-9]*)?([eE][+-]?[0-9]+)?/,
        ),
      ),

    string_literal: ($) =>
      seq(
        '"',
        repeat(choice(token.immediate(/[^"\\]+/), /\\./)),
        '"',
      ),

    char_literal: ($) => seq("'", repeat1(choice(/[^'\\]+/, /\\./)), "'"),
  },
});

function commaSep(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}