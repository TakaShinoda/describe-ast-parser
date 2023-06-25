import * as parser from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

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
})
`

export function extractTestNodes(jestCode: string): (t.Expression | t.StringLiteral)[] {
  const ast = parser.parse(jestCode, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  const testNodes: (t.Expression | t.StringLiteral)[] = []
  const visitedNodes = new Set<t.Expression | t.StringLiteral>()

  function traverseCallExpressions(path: NodePath<t.CallExpression>) {
    const { node } = path
    if (
      t.isIdentifier(node.callee, { name: 'test' }) &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0]
      if (!visitedNodes.has(arg as any)) {
        visitedNodes.add(arg as any)
        testNodes.push(arg as any)
      }
    }
    // 引数が関数の場合は再帰的に探索
    path.traverse({
      CallExpression: function (nestedPath: NodePath<t.CallExpression>) {
        if (!visitedNodes.has(nestedPath.node)) {
          visitedNodes.add(nestedPath.node)
          traverseCallExpressions(nestedPath)
        }
      }
    })
  }

  traverse(ast, {
    CallExpression: traverseCallExpressions,
    StringLiteral(path: NodePath<t.StringLiteral>) {
      const { node } = path
      if (
        t.isCallExpression(path.parent) &&
        t.isIdentifier(path.parent.callee, { name: 'describe' }) &&
        !visitedNodes.has(node)
      ) {
        visitedNodes.add(node)
        testNodes.push(node)
      }
    }
  })

  console.log('testNodes')
  console.log(JSON.stringify(testNodes, null, 2))
  console.log('testNodes')

  return testNodes
}

extractTestNodes(jestCode)