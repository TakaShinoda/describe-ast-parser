import { parseSync, ParseOptions, ExpressionStatement } from '@swc/core'

export const parse = (jestCode: string) => {
  const parseOptions: ParseOptions = {
    syntax: 'typescript',
    target: 'es2020',
    tsx: true,
    dynamicImport: true,
    decorators: true
  }

  const ast = parseSync(jestCode, parseOptions)
  const extractionNodes: ExpressionStatement[] = []
  const describeAndTestNodes = extractDescribeAndTestNodes(ast.body, extractionNodes)
  return describeAndTestNodes
}

const extractDescribeAndTestNodes = (nodes: any[], result: ExpressionStatement[]) => {
  for (const node of nodes) {
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.type === 'Identifier' &&
      (node.expression.callee.value === 'describe' || node.expression.callee.value === 'test') &&
      node.expression.arguments.length &&
      node.expression.arguments[0].expression.type === 'StringLiteral'
    ) {
      result.push(node)
      console.log('Matched node:')
      // console.log(JSON.stringify(node, null, 2))
    } else {
      console.log('Not a matched node:')
    }

    if (node.body && node.body.stmts) {
      extractDescribeAndTestNodes(node.body.stmts, result)
    }
  }

  return result
}

const jestCode = `
import { App } from './App.vue'
import { mount } from '@vue/test-utils'

describe('App.vue', () => {
  test('test App Component', function () {
    const wrapper = mount(App)
    expect(wrapper.text()).toBe('Hello World')
  })

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

const resultAst = parse(jestCode)
console.log(JSON.stringify(resultAst, null, 2))

