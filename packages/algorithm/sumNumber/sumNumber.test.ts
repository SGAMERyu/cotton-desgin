import { test, expect } from "vitest";

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

test("sum number", () => {
  function sumNumber(treeNode: TreeNode) {
    if (!treeNode) return 0;
    const result = [];

    dfs(treeNode, treeNode.val + "");

    function dfs(treeNode: TreeNode, val: string) {
      if (!treeNode.left && !treeNode.right) {
        result.push(val);
        return;
      }
      if (treeNode.left) dfs(treeNode.left, `${val}` + `${treeNode.left.val}`);
      if (treeNode.right)
        dfs(treeNode.right, `${val}` + `${treeNode.right.val}`);
    }

    const sum = result.reduce((pre, cur) => {
      return pre + parseInt(cur);
    }, 0);

    return sum;
  }
  const node = new TreeNode(4);
  node.left = new TreeNode(9);
  node.right = new TreeNode(0);
  node.left.left = new TreeNode(5);
  node.left.right = new TreeNode(1);
  expect(sumNumber(node)).toMatchInlineSnapshot('1026');
});
