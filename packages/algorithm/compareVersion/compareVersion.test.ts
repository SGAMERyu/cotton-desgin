// 比较版本号码

import { test, expect } from "vitest";

test("compareVersion", () => {
  function replaceZero(str: string) {
    return Number(str.replace(/^0+/, ""));
  }
  function compareVersion(version1: string, version2: string): number {
    const version1List = version1.split(".");
    const version2List = version2.split(".");
    let p1 = 0;
    let p2 = 0;
    let nonFinish = true;
    let result = 0;
    while (
      (p1 < version1List.length || p2 < version2List.length) &&
      nonFinish
    ) {
      const version1 =
        p1 < version1List.length ? replaceZero(version1List[p1]) : 0;
      const version2 =
        p2 < version2List.length ? replaceZero(version2List[p2]) : 0;

      if (version1 === version2) {
        p1++;
        p2++;
      } else {
        nonFinish = false;
        result = version1 > version2 ? 1 : -1;
      }
    }
    return result;
  }

  expect(compareVersion("1.0.0", "1.0")).toMatchInlineSnapshot("0");
});
