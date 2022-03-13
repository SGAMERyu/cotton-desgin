import { test, expect } from "vitest";

test("findKthLargest", () => {
  // 数组中第k大的元素
  function findKthLargest(nums: number[], k: number): number {
    const n = nums.length;
    return quickSort(nums, 0, n - 1, n - k);
  }

  function quickSort(
    nums: number[],
    left: number,
    right: number,
    k: number
  ): number {
    // 如果 left>=right，说明已经找到了第k大的元素
    if (left >= right) return nums[left];
    // 将nums[(left + right) / 2]作为基准元素
    const pivot = nums[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;
    // 如果i < j，说明还没有找到第k大的元素
    while (i < j) {
      while (nums[i] < pivot) i++;
      while (nums[j] > pivot) j--;
      // 交换
      if (i < j) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
        j--;
      }
    }
    // 如果 j < k，说明第k大的元素在左边
    if (j < k) {
      return quickSort(nums, j + 1, right, k);
    }
    return quickSort(nums, left, j, k);
  }

  expect(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toMatchInlineSnapshot(
    "4"
  );
});
