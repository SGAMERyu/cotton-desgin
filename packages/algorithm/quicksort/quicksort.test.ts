import { test, expect } from "vitest";

test("quick sort", () => {
  function sortAry(nums: number[]) {
    const n = nums.length;
    quickSort(nums, 0, n - 1);
    return nums;
  }

  function quickSort(nums: number[], left: number, right: number) {
    if (left >= right) return;
    const dummy = nums[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;
    while (i < j) {
      while (dummy > nums[i]) i++;
      while (dummy < nums[j]) j--;

      if (i < j) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
    }

    quickSort(nums, left, j);
    quickSort(nums, j + 1, right);
  }

  expect(sortAry([3, 1, 2, 5, 6, 4])).toMatchInlineSnapshot(
    `
    [
      1,
      2,
      3,
      4,
      5,
      6,
    ]
  `
  );
});
