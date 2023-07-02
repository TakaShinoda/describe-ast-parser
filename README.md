# describe-ast-parser

![Static Badge](https://img.shields.io/badge/License-MIT-brightgreen)

Parses jest code to AST and extract nodes with `describe` and `test`


## Install

```
npm i describe-ast-parser
```


## Usage

```ts
// test.spec.ts

describe('test.spec.ts', () => {
  test('test 1', () => {
    expect('Hello World').toBe('Hello World')
  })

  test('test 2', () => {
    expect(true).toBe(true)
  })
})
```

```ts
// index.ts

import { parse } from 'describe-ast-parser'
import { readFileSync } from 'fs'

console.log(parse(readFileSync('src/test.spec.ts', 'utf8')))
```

```
[
  Node {
    type: 'StringLiteral',
    start: 9,
    end: 23,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      filename: undefined,
      identifierName: undefined
    },
    extra: { rawValue: 'test.spec.ts', raw: "'test.spec.ts'" },
    value: 'test.spec.ts'
  },
  Node {
    type: 'StringLiteral',
    start: 40,
    end: 48,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      filename: undefined,
      identifierName: undefined
    },
    extra: { rawValue: 'test 1', raw: "'test 1'" },
    value: 'test 1'
  },
  Node {
    type: 'StringLiteral',
    start: 117,
    end: 125,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      filename: undefined,
      identifierName: undefined
    },
    extra: { rawValue: 'test 2', raw: "'test 2'" },
    value: 'test 2'
  }
]
```


## License

This project is licensed [MIT license](https://github.com/TakaShinoda/describe-ast-parser/blob/main/LICENSE).
