interface ParseResult {
  status: boolean;
  value?: any;
  index: number;
  expected?: any;
}

type ParserRule = (src: string, index: number) => ParseResult;

class Parser {
  parser: ParserRule;

  constructor(parser: ParserRule) {
    this.parser = parser;
  }

  parse(src: string, index = 0) {
    return this.parser(src, index);
  }

  map(fn) {
    return new Parser((src, index) => {
      let result = this.parse(src, index);

      if (result.status) {
        return { ...result, value: fn(result.value) };
      } else {
        return result;
      }
    });
  }
}

export default Parser;
