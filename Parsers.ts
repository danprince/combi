import Parser from "./Parser";

export function string(str: string) {
  return new Parser((src, index) => {
    let i = index;
    let j = index + str.length;
    let actual = src.slice(i, j);

    if (actual === str) {
      return {
        status: true,
        value: actual,
        index: j
      };
    } else {
      return {
        status: false,
        index: 1,
        expected: str
      };
    }
  });
}

export function regex(regex: RegExp) {
  let pattern = new RegExp(`^${regex.source}`);

  return new Parser((src, index) => {
    let actual = src.slice(index);
    let matches = actual.match(pattern);

    if (matches === null) {
      return {
        status: false,
        expected: regex,
        index
      };
    }

    let match = matches[0];

    return {
      status: true,
      index: index + match.length,
      value: match
    };
  });
}

export function alt(parsers: Parser[]) {
  return new Parser((src, index) => {
    let result;

    for (let parser of parsers) {
      result = parser.parse(src, index);

      if (result.status) {
        return result;
      }
    }

    return result;
  });
}

export function seq(parsers: Parser[]) {
  return new Parser((src, index) => {
    let values: any[] = [];
    let nextIndex = index;

    for (let parser of parsers) {
      let result = parser.parse(src, nextIndex);

      if (result.status) {
        values.push(result.value);
        nextIndex = result.index;
      } else {
        return {
          status: false,
          expected: result.expected,
          index
        };
      }
    }

    return {
      status: true,
      index: nextIndex,
      value: values
    };
  });
}

export function zeroOrMore(parser: Parser) {
  return new Parser((src, index) => {
    let values: any[] = [];
    let nextIndex = index;

    while (true) {
      let result = parser.parse(src, nextIndex);

      if (result.status === false) {
        break;
      }

      values.push(result.value);
      nextIndex = result.index;

      if (nextIndex >= src.length) {
        break;
      }
    }

    return {
      status: true,
      index: nextIndex,
      value: values
    };
  });
}

export function oneOrMore(parser: Parser) {
  return new Parser((src, index) => {
    let values: any[] = [];
    let result = parser.parse(src, index);

    if (result.status === false) {
      return result;
    }

    values.push(result.value);
    let nextIndex = result.index;

    for (let result = parser.parse(src, nextIndex); result.status; ) {
      values.push(result.value);
      nextIndex = result.index;

      if (nextIndex >= src.length) {
        break;
      }
    }

    return {
      status: true,
      index: nextIndex,
      value: values
    };
  });
}

export function whitespace() {
  return regex(/\s+/);
}

export function optionalWhitespace() {
  return regex(/\s*/);
}
