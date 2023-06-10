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
  // let describeAndTestNodes
  // // ASTの最上位のノードが Module の場合、その body プロパティから抽出する
  // if (ast.type === 'Module' && Array.isArray(ast.body)) {
  //   describeAndTestNodes = extractDescribeAndTestNodes(ast.body)
  //   console.log('Extracted nodes:', describeAndTestNodes)
  // } else {
  //   describeAndTestNodes = extractDescribeAndTestNodes(ast)
  // }
  // console.log(JSON.stringify(ast, null, 2))
  const describeAndTestNodes = extractDescribeAndTestNodes(ast.body[0])
  return describeAndTestNodes
}

const extractDescribeAndTestNodes = (node: any): any[] => {
  // console.log("呼ばれた")
  // console.log(node)
  console.log(JSON.stringify(node, null, 2))

  let result: any[] = []

  if (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    (node.expression.callee.value === 'describe' || node.expression.callee.value === 'test')
  ) {
    result.push(node)
    console.log('Matched node:')
  } else {
    console.log('Not a matched node:')
  }

  if (node.body && node.body.stmts) {
    for (const childNode of node.body.stmts) {
      const childResult = extractDescribeAndTestNodes(childNode)
      result = result.concat(childResult)
    }
  }

  return result
}

const jestCode = `
describe('App.vue', () => {
  test('test 1', () => {
    expect(true).toBe(true)
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
