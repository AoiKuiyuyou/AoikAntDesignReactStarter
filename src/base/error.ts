// +++++ 9L3U8 +++++


// -----
class BaseError extends Error {
  loc: string;

  msg: string;

  srcError: Error | null;

  constructor(
    loc: string,
    msg: string,
    srcError: Error | null = null,
  ) {
    super(`${loc}: ${msg}`);

    this.loc = loc;

    this.msg = msg;

    this.srcError = srcError;
  }

  getLoc() {
    return this.loc;
  }

  getMsg() {
    return this.msg;
  }

  getLocMsg() {
    return `${this.loc}: ${this.msg}`;
  }

  getSrcError() {
    return this.srcError;
  }
}


// -----
function makeError(
  loc: string,
  msg: string,
  srcError: Error | null = null,
): BaseError {
  return new BaseError(
    loc,
    msg,
    srcError,
  );
}


// -----
export {
  BaseError,
  makeError,
};
