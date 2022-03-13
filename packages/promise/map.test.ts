interface Iterator<T> {
  next(value?: any): IteratorResult<T>;
  return?(value?: any): IteratorResult<T>;
  throw?(e?: any): IteratorResult<T>;
}

interface Config {
  concurrency: number;
  stopOnError: boolean;
}

const defaultConfig: Config = {
  concurrency: Number.POSITIVE_INFINITY,
  stopOnError: true,
};

function promiseMap<T>(
  iterable: Iterable<T>,
  mapper: (value: any, index: number) => any,
  config: Partial<Config> = {}
) {
  return new Promise((resolve, _reject) => {
    if (
      iterable[Symbol.iterator] === undefined &&
      iterable[Symbol.asyncIterator] === undefined
    ) {
      throw new TypeError("Object is not iterable");
    }

    if (typeof mapper !== "function") {
      throw new TypeError("mapper is not a function");
    }

    config = Object.assign(defaultConfig, config);
    const { concurrency, stopOnError } = config;

    if (
      !(
        (Number.isSafeInteger(concurrency) ||
          concurrency === Number.POSITIVE_INFINITY) &&
        concurrency >= 1
      )
    ) {
      throw new RangeError(
        "concurrency must be a positive integer or Infinity"
      );
    }

    const result = [];
    const errors = [];
    let isRejected = false;
    let isResolved = false;
    let isIterableDone = false;
    let resolvingCount = 0;
    let currentIndex = 0;
    const iterator =
      iterable[Symbol.iterator] === undefined
        ? iterable[Symbol.asyncIterator]()
        : iterable[Symbol.iterator]();

    const reject = (reason) => {
      isRejected = true;
      isResolved = true;
      _reject(reason);
    };

    const next = async () => {
      if (isResolved) return;

      const nextItem = await iterator.next();
      const index = currentIndex;
      currentIndex++;

      if (nextItem.done) {
        isIterableDone = true;
        if (resolvingCount === 0 && !isResolved) {
          if (!stopOnError && errors.length > 0) {
            _reject(errors);
            return;
          }
          isResolved = true;

          const pureResult = [];

          for (const [index, value] of result.entries()) {
            pureResult.push(value);
          }

          resolve(pureResult);
        }
        return;
      }

      resolvingCount++;

      (async () => {
        try {
          console.log(nextItem.value);
          const element = await nextItem.value;
          console.log(element, Date.now());

          // if (isResolved) {
          //   return;
          // }

          const value = await mapper(element, index);

          result[index] = value;

          resolvingCount--;
          await next();
        } catch (error) {
          if (stopOnError) {
            reject(error);
          } else {
            errors.push(error);
            resolvingCount--;

            try {
              await next();
            } catch (error) {
              reject(error);
            }
          }
        }
      })();
    };

    (async () => {
      for (let index = 0; index < concurrency; index++) {
        try {
          await next();
        } catch (error) {
          reject(error);
          break;
        }

        if (isIterableDone || isRejected) {
          break;
        }
      }
    })();
  });
}

const testPromise = (timeout: number, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });
};

const test = async () => {
  const result = await promiseMap<any>(
    [
      testPromise(1000, 1),
      async () => {
        return 2;
      },
      testPromise(1000, 3),
      testPromise(5000, 4),
      testPromise(5000, 5),
    ],
    async (value) => {
      return await value;
    },
    { concurrency: 2 }
  );
  console.log(result);
};
test();

// describe("promise map", () => {
//   beforeEach(() => {
//     vi.useFakeTimers();
//   });

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   it("promise map", () => {
//     const test = async () => {
//       const result = await promiseMap<any>(
//         [testPromise(5000, 1), testPromise(2000, 2), testPromise(10000, 3)],
//         (value) => {
//           return value;
//         },
//         { concurrency: 2 }
//       );
//       console.log(result);
//     };
//     test();
//     vi.advanceTimersByTime(10000);
//   });
// });
