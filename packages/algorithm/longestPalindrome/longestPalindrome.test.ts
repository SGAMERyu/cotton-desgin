import { test, expect } from "vitest";

test("longestPalindrome", () => {
  function longestPalindrome(str: string) {
    const n = str.length;
    let ans = "";
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j <= n; j++) {
        const sub = str.substring(i, j);
        if (isPalindrome(sub) && sub.length > ans.length) {
          ans = sub;
        }
      }
    }
    return ans;
  }

  function isPalindrome(str: string) {
    const n = str.length;
    for (let i = 0; i < n / 2; i++) {
      if (str.charAt(i) !== str.charAt(n - 1 - i)) return false;
    }
    return true;
  }

  expect(longestPalindrome("babad")).toMatchInlineSnapshot('"bab"');
});
