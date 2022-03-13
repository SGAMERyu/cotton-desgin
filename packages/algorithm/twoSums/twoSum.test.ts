// 两数之和

import { test, expect } from "vitest";

test("two sums", () => {
  function twoSums(nums: number[], target: number) {
    const map = new Map();
    let result = [];
    for (let i = 0; i < nums.length; i++) {
      const temp = target - nums[i];
      if (map.has(nums[i])) {
        result = [map.get(nums[i]), i];
      }
      map.set(temp, i);
    }
    return result;
  }
  expect(twoSums([2, 7, 11, 15], 9)).toMatchInlineSnapshot(`
    [
      0,
      1,
    ]
  `);
});
