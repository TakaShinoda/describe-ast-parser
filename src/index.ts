import * as parser from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

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

  traverse(ast, {
    CallExpression: traverseCallExpressions
  })

  return extractionNodes
}
