import * as Parsers from "./Parsers";

let number = Parsers.regex(/-?[0-9]*.?[0-9]+/).map(n => ({
  type: "NumberLiteral",
  value: Number(n)
}));

let string = Parsers.regex(/".*?"/).map(value => ({
  type: "StringLiteral",
  value
}));

let boolean = Parsers.alt([
  Parsers.string("true").map(_ => true),
  Parsers.string("false").map(_ => false)
]).map(value => ({
  type: "BooleanLiteral",
  value
}));

let value = Parsers.alt([number, string, boolean]);

// Arrays

let elements = Parsers.zeroOrMore(value);

let array = Parsers.seq([
  Parsers.string("["),
  elements,
  Parsers.string("]")
]).map(([open, elements, close]) => ({
  type: "ArrayLiteral",
  elements
}));

// Object

let property = Parsers.seq([
  string,
  Parsers.string(":"),
  value,
  Parsers.string(",")
]).map(([key, colon, value, comma]) => ({
  type: "ObjectProperty",
  key,
  value
}));

let object = Parsers.seq([
  Parsers.string("{"),
  Parsers.zeroOrMore(property),
  Parsers.string("}")
]).map(([open, properties, close]) => ({
  type: "ObjectLiteral",
  properties
}));

let ast = property.parse(`"hello":"3",`);
console.log(JSON.stringify(ast, null, 2));
