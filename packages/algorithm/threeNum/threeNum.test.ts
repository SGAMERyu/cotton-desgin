// 三数之和

import { test, expect } from "vitest";

// 排序+双指针

test("three sum", () => {
  function threeSum(nums: number[]): number[][] {
    if (nums === null || nums.length < 3) return [];
    let ans = [];
    const len = nums.length;
    nums.sort((a, b) => a - b);
    for (let i = 0; i < len; i++) {
      if (nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0 结束循环
      if (i > 0 && nums[i] === nums[i - 1]) continue; // 去重
      let l = i + 1;
      let r = len - 1;
      while (l < r) {
        const sum = nums[i] + nums[l] + nums[r];
        if (sum === 0) {
          ans.push([nums[i], nums[l], nums[r]]);
          while (l < r && nums[l] === nums[l + 1]) l++;
          while (l < r && nums[r] === nums[r - 1]) r--;
          l++;
          r--;
        } else if (sum > 0) {
          r--;
        } else {
          l++;
        }
      }
    }
    return ans;
  }

  expect(threeSum([-1, 0, 1, 2, -1, -4])).toMatchInlineSnapshot(`
    [
      [
        -1,
        -1,
        2,
      ],
      [
        -1,
        0,
        1,
      ],
    ]
  `);
});
