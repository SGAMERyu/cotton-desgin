import { test, expect } from "vitest";

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

test("hasCycle", () => {
  function hasCycle(head: ListNode | null): boolean {
    if (!head) return false;
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
      if (slow === fast) return true;
      slow = slow.next;
      fast = fast.next.next;
    }
    return false;
  }
});
