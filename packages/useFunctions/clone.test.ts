import { test, expect } from "vitest";

interface Config {
  // 是否有循环引用
  circular: boolean;
  // 克隆的深度
  depth: number;
  // 设置克隆对象的原型
  prototype: Record<string, any>;
  // 如果不可枚举属性设置为true，也应该被克隆，原型上不可枚举的属性将被忽略
  includeNonEnumerable: boolean;
}

const defaultConfig: Config = {
  circular: true,
  depth: Infinity,
  prototype: undefined,
  includeNonEnumerable: false,
};

function findType(parent: any) {
  return Object.prototype.toString.call(parent).slice(8, -1);
}

test("clone", () => {
  function clone(parent: any, config: Partial<Config> = {}) {
    config = Object.assign(defaultConfig, config);
    // 为循环引用维护两个数组，其中对应的父数组
    // 子数组也有相应的索引
    const allParent = [];
    const allChildren = [];
    const useBuffer = typeof Buffer !== "undefined";

    function _clone(parent: any, depth: number = 0) {
      if (parent === null) return null;
      if (depth === 0) return parent;
      if (typeof parent !== "object") return parent;

      let child: any;
      let proto: any;

      if (findType(parent) === "Map") {
        child = new Map();
      } else if (findType(parent) === "Set") {
        child = new Set();
      } else if (findType(parent) === "Promise") {
        child = new Promise((resolve, reject) => {
          (parent as Promise<any>).then(
            (value) => {
              resolve(_clone(value, config.depth - 1));
            },
            (err) => {
              reject(_clone(err, config.depth - 1));
            }
          );
        });
      } else if (useBuffer && Buffer.isBuffer(parent)) {
        child = Buffer.from(parent);
        return child;
      } else if (Array.isArray(parent)) {
        child = [];
      } else if (findType(parent) === "RegExp") {
        child = new RegExp(parent.source, parent.flags);
        if (parent.lastIndex) {
          child.lastIndex = parent.lastIndex;
        }
      } else if (findType(parent) === "Date") {
        child = new Date(parent.getTime());
      } else if (findType(parent) === "Error") {
        child = Object.create(parent);
      } else {
        if (typeof config.prototype === "undefined") {
          proto = Object.getPrototypeOf(parent);
          child = Object.create(proto);
        } else {
          child = Object.create(config.prototype);
          proto = config.prototype;
        }
      }

      if (config.circular) {
        const index = allParent.indexOf(parent);
        if (index !== -1) {
          return allChildren[index];
        }
        allParent.push(parent);
        allChildren.push(child);
      }

      if (findType(parent) === "Map") {
        parent.forEach((value, key) => {
          const keyChild = _clone(key, config.depth - 1);
          const valueChild = _clone(value, config.depth - 1);
          child.set(keyChild, valueChild);
        });
      }
      if (findType(parent) === "Set") {
        parent.forEach((value) => {
          const valueChild = _clone(value, config.depth - 1);
          child.add(valueChild);
        });
      }
      for (const i in parent) {
        const attrs = Object.getOwnPropertyDescriptor(parent, i);
        if (attrs) {
          child[i] = _clone(parent[i], config.depth - 1);
        }
      }

      const symbols = Object.getOwnPropertySymbols(parent);
      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (
          descriptor &&
          !descriptor.enumerable &&
          !config.includeNonEnumerable
        ) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], config.depth - 1);
        Object.defineProperty(child, symbol, descriptor);
      }

      if (config.includeNonEnumerable) {
        const allPropertyNames = Object.getOwnPropertyNames(parent);
        for (let i = 0; i < allPropertyNames.length; i++) {
          const propertyName = allPropertyNames[i];
          const descriptor = Object.getOwnPropertyDescriptor(
            parent,
            propertyName
          );
          if (descriptor && descriptor.enumerable) {
            continue;
          }
          child[propertyName] = _clone(parent[propertyName], config.depth - 1);
          Object.defineProperty(child, propertyName, descriptor);
        }
      }
      return child;
    }

    return _clone(parent, config.depth);
  }

  const obj = {
    a: "1",
  };

  Object.defineProperty(obj, "a", {
    get: function () {
      return undefined;
    },
  });

  expect(clone(obj)).toMatchInlineSnapshot(`
    {
      "a": undefined,
    }
  `);
});
