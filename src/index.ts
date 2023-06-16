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
  const describeAndTestNodes = extractDescribeAndTestNodes(ast.body)
  return describeAndTestNodes
}

const extractDescribeAndTestNodes = (nodes: any): any[] => {
  let result: any[] = []
  for (const node of nodes) {
    console.log(JSON.stringify(node, null, 2))
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      (node.expression.callee.value === 'describe' || node.expression.callee.value === 'test')
    ) {
      result.push(node)
      console.log('Matched node:')
      // console.log(JSON.stringify(node, null, 2))
    } else {
      console.log('Not a matched node:')
    }

    if (node.body && node.body.stmts) {
      for (const childNode of node.body.stmts) {
        const childResult = extractDescribeAndTestNodes(childNode)
        result = result.concat(childResult)
      }
    }
  }

  return result
}

const jestCode = `
import { App } from './App'
describe('App.vue', () => {
  test('test 1', () => {
    expect(true).toBe(true)
  })

  describe('inner', () => {
    test('test 2', () => {
      expect(42).toEqual(42)
    })
    test('test 3', () => {
      expect(22).toEqual(22)
    })
  })
})
`

const ast = parse(jestCode)
// console.log(JSON.stringify(ast, null, 2))
