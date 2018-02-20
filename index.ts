import * as Parsers from "./Parsers";

let number = Parsers.regex(/-?[0-9]+.[0-9]+/).map(num => ({
  type: "Number",
  value: Number(num)
}));

let operator = Parsers.alt([
  Parsers.string("+"),
  Parsers.string("-"),
  Parsers.string("/"),
  Parsers.string("*")
]).map(operator => ({
  type: "Operator",
  value: operator
}));

let expr = Parsers.seq([number, operator, number]).map(([lhs, op, rhs]) => ({
  type: "Expression",
  lhs,
  op,
  rhs
}));

let list = Parsers.seq([
  Parsers.string("("),
  Parsers.zeroOrMore(Parsers.alt([Parsers.whitespace(), operator])),
  Parsers.string(")")
]).map(([lp, elements, rp]) => ({
  type: "List",
  elements
}));

console.log(list.parse("(+ - +)"));
