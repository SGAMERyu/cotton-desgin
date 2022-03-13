import { test, expect } from "vitest";

interface LruOptionsInterface {
  maxSize: number;
  maxAge: number;
  onEviction: (key: any, value: any) => void;
}

test("inline", () => {
  class LRUCache {
    #maxSize: number;
    #maxAge: number;
    #cache: Map<any, any>;
    #oldCache: Map<any, any>;
    #size: number;
    #onEviction: (key: any, value: any) => void;
    constructor(options: Partial<LruOptionsInterface> = {}) {
      if (!(options.maxSize && options.maxSize > 0)) {
        throw new TypeError("maxSize must be a number");
      }

      if (typeof options.maxAge === "number" && options.maxAge === 0) {
        throw new TypeError("maxAge must be a number");
      }

      this.#maxSize = options.maxSize;
      this.#maxAge = options.maxAge || Number.POSITIVE_INFINITY;
      this.#onEviction = options.onEviction;
      this.#cache = new Map();
      this.#oldCache = new Map();
      this.#size = 0;
    }
    #emitEvictions(cache: Map<any, any>) {
      if (typeof this.#onEviction !== "function") return;
      for (const [key, item] of cache) {
        this.#onEviction(key, item.value);
      }
    }
    #set(key, value) {
      this.#cache.set(key, value);
      this.#size++;
      // 如果大于最大容量，清空操作
      if (this.#size >= this.#maxSize) {
        this.#size = 0;
        this.#emitEvictions(this.#oldCache);
        this.#oldCache = this.#cache;
        this.#cache = new Map();
        expect(this.#oldCache).toMatchInlineSnapshot(`
          Map {
            "a" => {
              "expiry": undefined,
              "value": 1,
            },
            "b" => {
              "expiry": undefined,
              "value": 2,
            },
            "c" => {
              "expiry": undefined,
              "value": 4,
            },
          }
        `);
      }
    }
    #deleteIfExpired(key, item) {
      if (typeof item.expiry === "number" && item.expiry <= Date.now()) {
        if (typeof this.#onEviction === "function") {
          this.#onEviction(key, item.value);
        }
        return this.delete(key);
      }
      return false;
    }
    #getOrDeleteIfExpired(key, item) {
      const deleted = this.#deleteIfExpired(key, item);
      if (!deleted) {
        return item.value;
      }
    }
    #getItemValue(key, item) {
      return item.expiry ? this.#getOrDeleteIfExpired(key, item) : item.value;
    }
    #moveToRecent(key, item) {
      this.#oldCache.delete(key);
      this.#set(key, item);
    }
    #peek(key, cache) {
      const item = cache.get(key);
      return this.#getItemValue(key, item);
    }
    set(key: any, value: any, { maxAge = this.#maxAge } = {}) {
      const expiry =
        typeof maxAge === "number" && maxAge != Number.POSITIVE_INFINITY
          ? Date.now() + maxAge
          : undefined;
      if (this.#cache.has(key)) {
        this.#cache.set(key, { value, expiry });
      } else {
        this.#set(key, { value, expiry });
      }
    }
    get(key: any) {
      if (this.#cache.has(key)) {
        const item = this.#cache.get(key);
        return this.#getItemValue(key, item);
      }
      if (this.#oldCache.has(key)) {
        const item = this.#oldCache.get(key);
        if (this.#deleteIfExpired(key, item) === false) {
          this.#moveToRecent(key, item);
          return item.value;
        }
      }
    }
    delete(key) {
      const deleted = this.#cache.delete(key);
      if (deleted) {
        this.#size--;
      }

      return this.#oldCache.delete(key) || deleted;
    }
    clear() {
      this.#cache.clear();
      this.#oldCache.clear();
      this.#size = 0;
    }
    peek(key) {
      if (this.#cache.has(key)) {
        return this.#peek(key, this.#cache);
      }
      if (this.#oldCache.has(key)) {
        return this.#peek(key, this.#oldCache);
      }
    }
    get size() {
      if (!this.#size) {
        return this.#oldCache.size;
      }

      let oldCacheSize = 0;
      for (const key of this.#oldCache.keys()) {
        if (!this.#cache.has(key)) {
          oldCacheSize++;
        }
      }

      return Math.min(this.#size + oldCacheSize, this.#maxSize);
    }
  }
  const map = new LRUCache({ maxSize: 3 });
  map.set("a", 1);
  map.set("b", 2);
  map.set("c", 4);
  expect(map).toMatchInlineSnapshot("LRUCache2 {}");
  expect(map.get("a")).toMatchInlineSnapshot("1");
});
