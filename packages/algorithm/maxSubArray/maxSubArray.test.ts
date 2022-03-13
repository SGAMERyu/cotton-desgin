import { expect, test } from "vitest";

test("maxSubArray", () => {
  function maxSubArray(nums: number[]): number {
    let pre = 0;
    let maxAns = nums[0];
    for (let i = 0; i < nums.length; i++) {
        pre = Math.max(pre + nums[i], nums[i]);
        maxAns = Math.max(maxAns, pre);
    }

    return maxAns;
  }

  expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toMatchInlineSnapshot('6');
});
