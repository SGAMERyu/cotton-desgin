// 合并两个有序数组
import { test, expect } from "vitest";

// 合并两个有序数组
test("merge two order arrays", () => {
  function merge(nums1: number[], m: number, nums2: number[], n: number) {
    nums1.splice(m, nums1.length - m, ...nums2);
    nums1.sort((a, b) => a - b);
    return nums1.sort((a, b) => a - b);
  }

  // 双指针
  function merge2(nums1: number[], m: number, nums2: number[], n: number) {
    let p1 = 0;
    let p2 = 0;
    const sorted = new Array(m + n).fill(0);
    let cur;
    while (p1 < m || p2 < n) {
      if (p1 === m) {
        cur = nums2[p2++];
      } else if (p2 === n) {
        cur = nums1[p1++];
      } else if (nums1[p1] < nums2[p2]) {
        cur = nums1[p1++];
      } else {
        cur = nums2[p2++];
      }
      sorted[p2 + p1 - 1] = cur;
    }
    for (let i = 0; i < sorted.length; i++) {
      nums1[i] = sorted[i];
    }
    return nums1;
  }

  // 逆向双指针
  function merge3(nums1: number[], m: number, nums2: number[], n: number) {
    let p1 = m - 1;
    let p2 = n - 1;
    let tail = m + n - 1;
    let cur;
    while (p1 >= 0 || p2 >= 0) {
      if (p1 === -1) {
        cur = nums2[p2--];
      } else if (p2 === -1) {
        cur = nums1[p1--];
      } else if (nums1[p1] > nums1[p2]) {
        cur = nums1[p1--];
      } else {
        cur = nums2[p2--]
      }
      nums1[tail--] = cur;
    }
    return nums1;
  }

  const nums1 = [1, 2, 3, 0, 0, 0];
  const nums2 = [2, 5, 7];

  expect(merge3(nums1, 3, nums2, 3)).toMatchInlineSnapshot(`
    [
      1,
      2,
      2,
      5,
      3,
      7,
    ]
  `);
});
