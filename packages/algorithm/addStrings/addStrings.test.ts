// 字符串想加

import { expect, test } from "vitest";

test("add strings", () => {
  function addStrings(num1: string, num2: string) {
    console.log(1);
    let p1 = num1.length - 1;
    let p2 = num2.length - 1;
    let ca = 0;
    let result = "";
    while (p1 >= 0 || p2 >= 0) {
      const ele1 = p1 !== -1 ? num1[p1--] : 0;
      const ele2 = p2 !== -1 ? num2[p2--] : 0;
      const sum = Number(ele1) + Number(ele2) + ca;
      const str = sum % 10;
      ca = Math.floor(sum / 10);
      result = str + result;
    }
    if (ca !== 0) {
        result = ca + result;
    }
    return result;
  }

  expect(addStrings('456', '77')).toMatchInlineSnapshot('"533"')});
