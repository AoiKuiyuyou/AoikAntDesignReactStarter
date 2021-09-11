// +++++ 1Z3X9 +++++


// -----
const waitTime = (timeoutMs: number) => {
  return new Promise(
    (resolve) => {
      setTimeout(() => {
        resolve(true);
      }, timeoutMs);
    },
  );
};


// -----
export {
  waitTime,
};
