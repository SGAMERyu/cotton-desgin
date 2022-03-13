// 路径总和
import { test, expect } from "vitest";

test("hasPathSum", () => {
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

  function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (!root) return false;
    const result = [];

    dfs(root, root.val);

    console.log(result);

    function dfs(rootNode: TreeNode | null, val: number) {
      if (!rootNode.left && !rootNode.right) {
        result.push(val);
        return;
      }
      rootNode.left && dfs(rootNode.left, rootNode.left.val + val);
      rootNode.right && dfs(rootNode.right, rootNode.right.val + val);
    }

    return result.includes(targetSum);
  }

  const tree = new TreeNode(1);
  tree.left = new TreeNode(2);
  tree.right = new TreeNode(3);

  expect(hasPathSum(tree, 3)).toMatchInlineSnapshot("true");
});
