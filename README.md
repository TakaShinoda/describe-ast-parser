# describe-ast-parser

![NPM](https://img.shields.io/npm/l/describe-ast-parser)
![npm](https://img.shields.io/npm/v/describe-ast-parser)


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
  {
    "type": "StringLiteral",
    "start": 9,
    "end": 23,
    "loc": {
      "start": {
        "line": 1,
        "column": 9,
        "index": 9
      },
      "end": {
        "line": 1,
        "column": 23,
        "index": 23
      }
    },
    "extra": {
      "rawValue": "test.spec.ts",
      "raw": "'test.spec.ts'"
    },
    "value": "test.spec.ts"
  },
  {
    "type": "StringLiteral",
    "start": 40,
    "end": 48,
    "loc": {
      "start": {
        "line": 2,
        "column": 7,
        "index": 40
      },
      "end": {
        "line": 2,
        "column": 15,
        "index": 48
      }
    },
    "extra": {
      "rawValue": "test 1",
      "raw": "'test 1'"
    },
    "value": "test 1"
  },
  {
    "type": "StringLiteral",
    "start": 117,
    "end": 125,
    "loc": {
      "start": {
        "line": 6,
        "column": 7,
        "index": 117
      },
      "end": {
        "line": 6,
        "column": 15,
        "index": 125
      }
    },
    "extra": {
      "rawValue": "test 2",
      "raw": "'test 2'"
    },
    "value": "test 2"
  }
]
```


## License

This project is licensed [MIT license](https://github.com/TakaShinoda/describe-ast-parser/blob/main/LICENSE).
