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

  const traverseCallExpressions = (path: NodePath<t.CallExpression>) => {
    const { node } = path

    if (
      (t.isIdentifier(node.callee, { name: 'describe' }) ||
        t.isIdentifier(node.callee, { name: 'test' })) &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0]
      extractionNodes.push(arg as any)
    }
  }

  // traverse 関数は、AST のノードを再帰的に走査し、指定したノードタイプにマッチするノードが見つかるたびに
  // 指定されたコールバック関数（この場合は traverseCallExpressions 関数）を呼び出す
  // traverseCallExpressions 関数は、CallExpression ノードが見つかるたびに呼び出される
  traverse(ast, {
    // コールバック関数には現在のノードの情報が渡される、
    // それを受け取るためのパラメータが  `path: NodePath<t.CallExpression>`
    CallExpression: traverseCallExpressions
  })

  console.log('extractionNodes')
  console.log(JSON.stringify(extractionNodes, null, 2))
  console.log('extractionNodes')

  return extractionNodes
}

parse(jestCode)
