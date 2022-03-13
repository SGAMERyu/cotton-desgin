import { test, expect } from "vitest";

test("binary search", () => {
  function binarySearch(nums: number[], target: number): number {
    if (nums === null || nums.length === 0) return -1;
    const len = nums.length;
    let medium = Math.floor(len / 2);
    let i = 0;
    let j = len - 1;
    while (i <= j) {
        if (nums[medium] === target) return medium;
        if (nums[medium] > target) {
            j = medium - 1;
        } else {
            i = medium + 1;
        }
        medium = Math.floor((i + j) / 2);
    }
    return medium
  }

  expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 8)).toMatchInlineSnapshot('7');
});
