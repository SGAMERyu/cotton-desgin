import { test, expect } from "vitest";

test("reverseList", () => {
  class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
      this.val = val === undefined ? 0 : val;
      this.next = next === undefined ? null : next;
    }
  }

  function reverseList(head: ListNode | null): ListNode | null {
   if (!head) return null;
   let pre = null;
   let next = head;
   while(next) {
       const temp = next.next;
       next.next = pre;
       pre = next;
       next = temp;
   }
   return pre;
  }
});
