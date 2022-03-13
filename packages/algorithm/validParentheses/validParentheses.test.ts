// 有效的括号
import { test, expect } from "vitest";

test("valid Parentheses", () => {
  function isValid(s: string): boolean {
    let stack: string[] = [];
    const map: Record<string, string> = {
      "(": ")",
      "{": "}",
      "[": "]",
    };
    for (let i = 0; i < s.length; i++) {
      if (stack.length > 0 && map[stack[0]] === s[i]) {
        stack.shift();
      } else {
        stack.unshift(s[i]);
      }
    }

    return stack.length === 0;
  }

  expect(isValid("[()]")).toMatchInlineSnapshot('true');
});
