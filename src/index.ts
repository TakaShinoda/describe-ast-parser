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

export const parse = (jestCode: string): t.Expression[] => {
  const ast = parser.parse(jestCode, {
    sourceType: 'module',
    plugins: ['jsx']
  })

  const extractionNodes: t.Expression[] = []
  const visitedNodes = new Set<t.Expression>()

  const traverseCallExpressions = (path: NodePath<t.CallExpression>) => {
    const { node } = path
    if (
      (t.isIdentifier(node.callee, { name: 'describe' }) ||
        t.isIdentifier(node.callee, { name: 'test' })) &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0]
      if (!visitedNodes.has(arg as any)) {
        visitedNodes.add(arg as any)
        extractionNodes.push(arg as any)
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
    CallExpression: traverseCallExpressions
  })

  console.log('extractionNodes')
  console.log(JSON.stringify(extractionNodes, null, 2))
  console.log('extractionNodes')

  return extractionNodes
}

parse(jestCode)
