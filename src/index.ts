import { parseSync, ParseOptions } from '@swc/core'

export const parse = (jestCode: string) => {
  const parseOptions: ParseOptions = {
    syntax: 'typescript',
    target: 'es2020',
    tsx: true,
    dynamicImport: true,
    decorators: true
  }

  const ast = parseSync(jestCode, parseOptions)
  const describeAndTestNodes = extractDescribeAndTestNodes(ast)
  return describeAndTestNodes
}

const extractDescribeAndTestNodes = (node: any): any[] => {
  console.log(node)
  // console.log(JSON.stringify(node, null, 2))

  let result = []

  if (node.type === 'CallExpression' || node.type === 'ExpressionStatement') {
    if (
      node.expression.callee.type === 'Identifier' &&
      (node.expression.callee.value === 'describe' || node.expression.callee.value === 'test')
    ) {
      result.push(node)
    }
  }

  if (node.body) {
    for (const childNode of node.body) {
      const childResult = extractDescribeAndTestNodes(childNode)
      result = result.concat(childResult)
    }
  }

  return result
}

const jestCode = `
describe('App.vue', () => {
  test('test 1', () => {
    const value = "123"
    expect(value).toBe("123")
  })

  describe('inner', () => {
    test('test 2', () => {
      expect(42).toEqual(42)
    })
  })
})
`

const ast = parse(jestCode)
// console.log(JSON.stringify(ast, null, 2))
