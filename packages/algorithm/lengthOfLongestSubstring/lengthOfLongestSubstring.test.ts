// 无重复字符的最长子串
// 采用滑动窗口加双指针

function lengthOfLongestSubstring(s: string): number {
  const occ = new Set();
  const len = s.length;
  let ans = 0;
  let rk = -1;
  for (let i = 0; i < len; i++) {
    // 防止前面的项目干扰
    if (i !== 0) {
      occ.delete(s[i]);
    }
    while (rk + 1 < len && !occ.has(s[rk + 1])) {
      occ.add(s[rk + 1]);
      rk++;
    }
    ans = Math.max(ans, rk - i + 1);
  }
  return ans;
}
