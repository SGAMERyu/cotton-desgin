// 层序遍历 + bfs
import { test, expect } from "vitest";

test("levelOrder", () => {
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

  function levelOrder(root: TreeNode | null): number[][] {
    if (!root) return [];
    const result = [];
    bfs(root);

    function bfs(treeNode: TreeNode) {
      const queue: TreeNode[] = [];
      queue.push(treeNode);
      while (queue.length > 0) {
        const size = queue.length;
        const level: number[] = [];
        // size无意义，只是为了收集不同层数
        for (let i = 0; i < size; i++) {
          const node = queue.shift();
          level.push(node.val);
          if (node.left) {
            queue.push(node.left);
          }
          if (node.right) {
            queue.push(node.right);
          }
        }
        result.push(level);
      }
    }
  }
});
