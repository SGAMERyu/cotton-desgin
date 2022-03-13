// 全排列
import { test, expect } from "vitest";

test("permute", () => {
  function permute(nums: number[]): number[][] {
    const res = [];
    backtrack([]);
    return res;

    function backtrack(path) {
      if (path.length === nums.length) {
        res.push(path);
        return;
      }
      for (let i = 0; i < nums.length; i++) {
        if (path.includes(nums[i])) {
          continue;
        }
        backtrack(path.concat(nums[i]));
      }
    }
  }

  expect(permute([1, 2, 3])).toMatchInlineSnapshot(`
    [
      [
        1,
        2,
        3,
      ],
      [
        1,
        3,
        2,
      ],
      [
        2,
        1,
        3,
      ],
      [
        2,
        3,
        1,
      ],
      [
        3,
        1,
        2,
      ],
      [
        3,
        2,
        1,
      ],
    ]
  `);
});
