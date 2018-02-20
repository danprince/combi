type Parser = (src: string, index: number) => ParserResult;

interface ParserResult {
  status: boolean;
  value: any;
  index: number;
}

function success(index, value): ParserResult {
  return {
    status: true,
    value,
    index
  };
}

function failure(index): ParserResult {
  return {
    status: false,
    index
  };
}

function string(s): Parser {
  return (src, index) => {
    let actual = src.slice(index, index + str.length);

    if (actual === s) {
      return success(index + str.length, s);
    } else {
      return failure(index);
    }
  };
}

function map(parser: Parser, fn): Parser {
  return (src, index) => {
    let result = parser(src, index);

    if (result.status) {
      return result;
    }

    return { ...result, value: fn(result.value) };
  };
}

let lbrack = map(
  string("["),
  _ => ({ type: "LeftBracket" })
);


let number = map(
  Parsers.regex(/[0-9]+/),
  num => ({ type: "Number" })
);

let number = Parsers
  .regex(/[0-9]/+)
  .map(Nodes.NumberLiteral)


(src, index) => ({ status: true, value: "foo", index: 1 })
  |> map(result => ({ type: "FooLiteral" }))
  |> 
