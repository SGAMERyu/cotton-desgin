import { test, expect } from "vitest";

test("maxProfit", () => {
  function maxProfit(prices: number[]): number {
    let minPrice = 0;
    let maxProfit = 0;

    prices.forEach((item) => {
      if (minPrice > item) {
        minPrice = item;
      } else {
        item - minPrice > maxProfit;
      }
      {
        maxProfit = item - minPrice;
      }
    });
    return maxProfit;
  }

  expect(maxProfit([7, 1, 5, 3, 6, 4])).toMatchInlineSnapshot('4');
});
