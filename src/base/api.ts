// ------ 4W9D5 ------

// -----
import moment from 'moment';

// Must use relative path. `@/` will cause import error.
import { EnvConfig } from '../config/env_config';
import { BaseError } from './error';
import { makeError } from './error';
import { Logger } from './logging';
import { Toast } from './toast';


// -----
enum ApiResStatus {
  HTTP_200_BIZ_SUCC = 200,
  HTTP_299_BIZ_FAIL = 299,
  HTTP_300 = 300,
  HTTP_399 = 399,
  HTTP_400_ARG_ERR = 400,
  HTTP_429_FREQ_ERR = 429,
  HTTP_401_AUTHEN_ERR = 401,
  HTTP_403_AUTHOR_ERR = 403,
  HTTP_404_ROUTE_ERR = 404,
  HTTP_405_METHOD_ERR = 405,
  HTTP_406_ACCEPT_ERR = 406,
  HTTP_407_PROXY_AUTH_ERR = 407,
  HTTP_499 = 499,
  HTTP_500_EXC_ERR = 500,
  HTTP_501_IMP_ERR = 501,
  HTTP_502_GATEWAY_ERR = 502,
  HTTP_503_OVERLOAD_ERR = 503,
  HTTP_504_TIMEOUT_ERR = 504,
  HTTP_505_VERSION_ERR = 505,
  HTTP_599 = 599,
}


// -----
enum ApiResCode {
  BIZ_SUCC = 'BIZ_SUCC',
  BIZ_FAIL = 'BIZ_FAIL',
  ARG_ERR = 'ARG_ERR',
  ARG_PARSE_ERR = 'ARG_PARSE_ERR',
  EXC_ERR = 'EXC_ERR',
}


// -----
enum ApiResMsg {
  // ----- Base -----
  BIZ_SUCC = 'Operation success.',
  BIZ_FAIL = 'Operation failure',
  ARG_ERR = 'Argument error',
  ARG_PARSE_ERR = 'Argument parse error',
  AUTHEN_ERR = 'Authentication error',
  AUTHOR_ERR = 'Authorization error',
  ROUTE_ERR = 'Route error',
  METHOD_ERR = 'Request method error',
  ACCEPT_ERR = 'Request condition error',
  PROXY_AUTH_ERR = 'Proxy authentication error',
  FREQ_ERR = 'Operation too frequent. Please try later.',
  EXC_ERR = 'Backend exception error',
  IMP_ERR = 'Backend implementation error',
  BACKEND_UNRESP_ERR = 'Backend unresponsive. Please try later.',
  PROTO_VERSION_ERR = 'Protocol version error',
  UNKNOWN_2XX_ERR = 'Unknown business status code',
  UNKNOWN_3XX_ERR = 'Unknown redirect status code',
  UNKNOWN_4XX_ERR = 'Unknown argument, authentication, or authorization error',
  UNKNOWN_5XX_ERR = 'Unknown backend error',
  UNKNOWN_OTHER_ERR = 'Unknown other status code',
  PAGE_EXPIRED_ERR = 'Page might be expired.'
    + 'Please press `Ctrl+F5` or swipe down the phone screen to refresh the page.',

  // ----- Login -----
  LOGIN_SUCC = 'Login success',
  LOGIN_FAIL = 'Login failure',
  LOGOUT_SUCC = 'Logout success',
}


// -----
enum ApiResDebugMsg {
  EMPTY = '',
}


// -----
interface ApiReqInfoType {
  apiLoc: string;

  cliLoc: string;

  // Added by `callApi` at 1U3M4.
  apiVer?: string;

  // Added by `callApi` at 2C1P5.
  cliTime?: string;
}


// -----
interface ApiResInfoType {
  loc: string;

  status: bigint;

  code: string;

  msg: string;

  debugMsg: string;

  data: object;
}


// -----
function getHttpStatusMsg(status: number | null) {
  if (typeof status !== 'number') {
    return `No status code.${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  if (status === ApiResStatus.HTTP_200_BIZ_SUCC) {
    return ApiResMsg.BIZ_SUCC;
  }

  if (status === ApiResStatus.HTTP_299_BIZ_FAIL) {
    return ApiResMsg.BIZ_FAIL;
  }

  if (status > ApiResStatus.HTTP_200_BIZ_SUCC && status < ApiResStatus.HTTP_299_BIZ_FAIL) {
    return `${ApiResMsg.UNKNOWN_2XX_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  if (status >= ApiResStatus.HTTP_300 && status <= ApiResStatus.HTTP_399) {
    return `${ApiResMsg.UNKNOWN_3XX_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  if (status === ApiResStatus.HTTP_400_ARG_ERR) {
    return `${ApiResMsg.ARG_ERR}. ${ApiResMsg.PAGE_EXPIRED_ERR}.`;
  }

  if (status === ApiResStatus.HTTP_401_AUTHEN_ERR) {
    return ApiResMsg.AUTHEN_ERR;
  }

  if (status === ApiResStatus.HTTP_403_AUTHOR_ERR) {
    return ApiResMsg.AUTHOR_ERR;
  }

  if (status === ApiResStatus.HTTP_404_ROUTE_ERR) {
    return `${ApiResMsg.ROUTE_ERR}. ${ApiResMsg.PAGE_EXPIRED_ERR}.`;
  }

  if (status === ApiResStatus.HTTP_405_METHOD_ERR) {
    return `${ApiResMsg.METHOD_ERR}. ${ApiResMsg.PAGE_EXPIRED_ERR}.`;
  }

  if (status === ApiResStatus.HTTP_406_ACCEPT_ERR) {
    return ApiResMsg.ACCEPT_ERR;
  }

  if (status === ApiResStatus.HTTP_407_PROXY_AUTH_ERR) {
    return ApiResMsg.PROXY_AUTH_ERR;
  }

  if (status === ApiResStatus.HTTP_429_FREQ_ERR) {
    return ApiResMsg.FREQ_ERR;
  }

  if (status >= ApiResStatus.HTTP_400_ARG_ERR && status <= ApiResStatus.HTTP_499) {
    return `${ApiResMsg.UNKNOWN_4XX_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  if (status === ApiResStatus.HTTP_500_EXC_ERR) {
    return ApiResMsg.EXC_ERR;
  }

  if (status === ApiResStatus.HTTP_501_IMP_ERR) {
    return ApiResMsg.IMP_ERR;
  }

  if (status === ApiResStatus.HTTP_502_GATEWAY_ERR
    || status === ApiResStatus.HTTP_503_OVERLOAD_ERR
    || status === ApiResStatus.HTTP_504_TIMEOUT_ERR) {
    return ApiResMsg.BACKEND_UNRESP_ERR;
  }

  if (status === ApiResStatus.HTTP_505_VERSION_ERR) {
    return ApiResMsg.PROTO_VERSION_ERR;
  }

  if (status >= ApiResStatus.HTTP_500_EXC_ERR && status <= ApiResStatus.HTTP_599) {
    return `${ApiResMsg.UNKNOWN_5XX_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  return `${ApiResMsg.UNKNOWN_OTHER_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
}


//
function getErrMsgShown<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  resInfo: ResInfoType | null,
  extInfo: CallApiExtInfoType<ReqInfoType, ResInfoType>,
) {
  //
  const respStatus = extInfo.resp === null ? 0 : extInfo.resp.status;

  //
  let respMsg: string;

  if (extInfo.resp === null) {
    respMsg = 'Network request error';
  }
  else if (resInfo && resInfo.msg) {
    respMsg = resInfo.msg;
  }
  else {
    respMsg = getHttpStatusMsg(respStatus);
  }

  //
  const errMsgArg = extInfo.errMsg;

  // Client side custom message has first priority.
  // Server side response message has second priority.
  // Default HTTP error message has third priority.
  let errMsgShown: string;

  if (typeof errMsgArg === 'string') {
    errMsgShown = errMsgArg;
  }
  else if (typeof errMsgArg === 'function') {
    errMsgShown = (errMsgArg as Function)(respStatus, respMsg);
  }
  else if (typeof errMsgArg === 'object') {
    errMsgShown = (errMsgArg as object)[respStatus];
  }
  else {
    errMsgShown = respMsg;
  }

  if (!errMsgShown) {
    errMsgShown = respMsg;

    if (!errMsgShown) {
      errMsgShown = 'Network request error';
    }
  }

  //
  return errMsgShown;
}


// -----
const ABORT_CONTROLLERS: AbortController[] = [];


// -----
function addAbortController(abortController: AbortController) {
  ABORT_CONTROLLERS.push(abortController);
}


// -----
function removeAbortController(abortController: AbortController) {
  if (!ABORT_CONTROLLERS.length) {
    return;
  }

  const index = ABORT_CONTROLLERS.findIndex(
    (x) => {return x === abortController;},
  );

  if (index >= 0) {
    ABORT_CONTROLLERS.splice(index, 1);
  }
}


// -----
function abortApiCalls() {
  while (ABORT_CONTROLLERS.length) {
    const abortController = ABORT_CONTROLLERS.pop();

    if (abortController !== undefined) {
      abortController.abort();
    }
  }
}


// -----
type CallApiResCallbackType<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType,
  > = ((
  resInfo: ResInfoType,
  extInfo: CallApiExtInfoType<ReqInfoType, ResInfoType>,
) => Promise<ResInfoType | null>);


// -----
type CallApiResCallbackPlusLocType<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
> = CallApiResCallbackType<ReqInfoType, ResInfoType> &
  {
    // Added by `callApi` at 1T4N3.
    aoikAntDesignReactStarterApiResCallbackLoc: string
  };


// -----
function onSuccessDefault<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  resInfo: ResInfoType,
  extInfo: CallApiExtInfoType<ReqInfoType, ResInfoType>,
): Promise<ResInfoType>
{
  const { loc } = resInfo;

  if (!loc) {
    throw makeError(
      '5T7C3',
      'res_info_no_loc_err',
    );
  }

  Toast.success(
    extInfo.msgShown,
    extInfo.msgTitle,
    {
      timeOut: extInfo.msgTimeout,
      extendedTimeOut: extInfo.msgTimeout,
    },
  );

  return Promise.resolve(resInfo);
}

onSuccessDefault.aoikAntDesignReactStarterApiResCallbackLoc = '6U8J3';


// -----
function onFailureDefault<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  resInfo: ResInfoType,
  extInfo: CallApiExtInfoType<ReqInfoType, ResInfoType>,
): Promise<ResInfoType>
{
  const { loc } = resInfo;

  if (!loc) {
    throw makeError(
      '7C5S6',
      'res_info_no_loc_err',
    );
  }

  Toast.error(
    extInfo.msgShown,
    extInfo.msgTitle,
    {
      timeOut: extInfo.msgTimeout,
      extendedTimeOut: extInfo.msgTimeout,
    },
  );

  return Promise.resolve(resInfo);
}

onFailureDefault.aoikAntDesignReactStarterApiResCallbackLoc = '8V3R4';


// -----
function onErrorDefault<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  resInfo: ResInfoType,
  extInfo: CallApiExtInfoType<ReqInfoType, ResInfoType>,
): Promise<ResInfoType>
{
  Toast.error(
    extInfo.msgShown,
    extInfo.msgTitle,
    {
      timeOut: extInfo.msgTimeout,
      extendedTimeOut: extInfo.msgTimeout,
    },
  );

  return Promise.resolve(resInfo);
}

onErrorDefault.aoikAntDesignReactStarterApiResCallbackLoc = '9O2Z1';


// -----
const SAFE_FUNC_ERROR = {};


// -----
function makeApiResCallback<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  loc: string,
  func: CallApiResCallbackType<ReqInfoType, ResInfoType>,
): CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType>
{
  //
  const funcWithLoc = func as CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType>;

  // ----- 1T4N3 -----
  funcWithLoc.aoikAntDesignReactStarterApiResCallbackLoc = loc;

  //
  return funcWithLoc;
}


// -----
type CallApiGetIsMountedType = () => boolean;

type CallApiGetCallCountType = () => number;

type CallApiSetCallCountType = (count: number) => void;


// -----
interface CallApiFuncParamsType<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
> {
  uri: string;

  method?: string;

  headers?: object;

  body: ReqInfoType;

  getIsMounted: CallApiGetIsMountedType;

  getCallCount: CallApiGetCallCountType;

  setCallCount: CallApiSetCallCountType;

  ignoreCallCount?: boolean;

  onStart?: Function;

  onEnd?: Function;

  onSuccess?: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType>;

  onFailure?: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType>;

  onError?: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType>;

  errMsg?: string | object | Function;

  msgTimeout?: number;

  propErr?: boolean;
}


// -----
interface CallApiExtInfoType<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
> extends CallApiFuncParamsType<ReqInfoType, ResInfoType> {
  resp: Response | null;

  msgTitle: string;

  msgShown: string;
}


// -----
async function callApi<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  funcParams: CallApiFuncParamsType<ReqInfoType, ResInfoType>,
): Promise<ResInfoType | null>
{
  let cliLoc = '';

  try {
    //
    cliLoc = funcParams.body.cliLoc;

    if (typeof cliLoc !== 'string' || !cliLoc || cliLoc.length !== 5) {
      throw makeError(
        '2F8Y3',
        'invalid_cliloc_err',
      );
    }

    //
    const { apiLoc } = funcParams.body;

    if (typeof apiLoc !== 'string' || !apiLoc || apiLoc.length !== 5) {
      throw makeError(
        '3W6E7',
        'Invalid `body.apiLoc`',
      );
    }

    //
    if (funcParams.onStart) {
      let onStartRes = funcParams.onStart();

      if (onStartRes instanceof Promise) {
        onStartRes = await onStartRes.catch(
          (err: any) => {
            handleError(
              `${cliLoc}-8X1N2`,
              err,
            );

            return SAFE_FUNC_ERROR;
          },
        );
      }

      if (onStartRes === SAFE_FUNC_ERROR) {
        return null;
      }
    }

    //
    const callRes = callApiImp<ReqInfoType, ResInfoType>(funcParams);

    //
    if (!(callRes instanceof Promise) || funcParams.propErr) {
      return callRes;
    }

    //
    return callRes.catch(
      (err: any) => {
        handleError(
          `${cliLoc}-4W7F9`,
          err,
        );

        return null;
      },
    );
  }
  catch (err: any) {
    if (funcParams.propErr) {
      return Promise.reject(err);
    }

    handleError(
      `${cliLoc ? `${cliLoc}-` : ''}5S6N8`,
      err,
    );

    return null;
  }
  finally {
    try {
      if (funcParams.onEnd) {
        const onEndRes = funcParams.onEnd();

        if (onEndRes instanceof Promise) {
          await onEndRes.catch(
            (err: any) => {
              handleError(
                `${cliLoc}-9D3B5`,
                err,
              );

              return SAFE_FUNC_ERROR;
            },
          );
        }
      }
    }
    catch(err: any) {
      handleError(
        `${cliLoc ? `${cliLoc}-` : ''}6V8Y5`,
        err,
      );
    }
  }
}


// -----
function callApiImp<
  ReqInfoType extends ApiReqInfoType,
  ResInfoType extends ApiResInfoType
>(
  funcParams: CallApiFuncParamsType<ReqInfoType, ResInfoType>,
): Promise<ResInfoType | null>
{
  //
  const extInfo = { ...funcParams } as CallApiExtInfoType<ReqInfoType, ResInfoType>;

  //
  const { cliLoc } = funcParams.body;

  if (typeof cliLoc !== 'string' || !cliLoc || cliLoc.length !== 5) {
    throw makeError(
      '7Y9T1',
      'cliloc_arg_err',
    );
  }

  if (window.fetch === undefined || window.localStorage === undefined) {
    const loc = `${cliLoc}-8T2K6`;

    if (funcParams.propErr) {
      return Promise.reject(loc);
    }

    const errMsg = `Unsupported browser. <br/><br/>Loc: ${loc}`;

    const errTitle = `Error${EnvConfig.DEV_ON ? ` (${loc})` : ''}`;

    Toast.error(errMsg, errTitle);

    return Promise.resolve(null);
  }

  //
  const { uri } = extInfo;

  if (!uri) {
    throw makeError(
      '9O3N1',
      'uri_arg_err',
    );
  }

  if (!uri.startsWith('/api/')) {
    throw makeError(
      '1H6D5',
      'uri_prefix_err',
    );
  }

  //
  const { getIsMounted } = extInfo;

  //
  if (!(getIsMounted instanceof Function)) {
    throw makeError(
      '2F4V6',
      'getismounted_arg_err',
    );
  }

  //
  const { getCallCount } = extInfo;

  //
  if (!(getCallCount instanceof Function)) {
    throw makeError(
      '3U2Y6',
      'getcallcount_arg_err',
    );
  }

  //
  const { setCallCount } = extInfo;

  //
  if (!(setCallCount instanceof Function)) {
    throw makeError(
      '4A9X8',
      'setcallcount_arg_err',
    );
  }

  //
  let ignoreCallCount: boolean = extInfo.ignoreCallCount || false;

  if ((typeof ignoreCallCount) !== 'boolean') {
    ignoreCallCount = false;
  }

  //
  if (!ignoreCallCount && getCallCount() !== 0) {
    const loc = `${cliLoc}-5H8J6`;

    const errMsg = `Please wait for the previous network request to finish. <br/><br/>Loc: ${loc}`;

    const errTitle = `Error${EnvConfig.DEV_ON ? ` (${loc})` : ''}`;

    Toast.error(errMsg, errTitle);

    return Promise.resolve(null);
  }

  //
  const incrCallCount = () => {
    setCallCount(getCallCount() + 1);
  };

  //
  const decrCallCount = (loc: string) => {
    const callCount = getCallCount();

    if (callCount <= 0) {
      throw makeError(
        `${loc}-6Z9N3`,
        'call_count_decremented_to_negative_err',
      );
    }

    setCallCount(callCount - 1);
  };

  //
  const onSuccessFunc: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType> = extInfo.onSuccess
    || onSuccessDefault;

  if (typeof onSuccessFunc !== 'function') {
    throw makeError(
      '7I8O2',
      'onsuccess_arg_err',
    );
  }

  //
  const onFailureFunc: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType> = extInfo.onFailure
    || onFailureDefault;

  if (typeof onFailureFunc !== 'function') {
    throw makeError(
      '8L7B9',
      'onfailure_arg_err',
    );
  }

  //
  const onErrorFunc: CallApiResCallbackPlusLocType<ReqInfoType, ResInfoType> = extInfo.onError
    || onErrorDefault;

  if (typeof onErrorFunc !== 'function') {
    throw makeError(
      '9R8T6',
      'onerror_arg_err',
    );
  }

  //
  const method: string = extInfo.method || 'POST';

  //
  const headers: object = extInfo.headers || {};

  //
  headers['Content-Type'] = 'application/json';

  // ----- 1U3M4 -----
  extInfo.body.apiVer = EnvConfig.API_VER;

  // ----- 2C1P5 -----
  extInfo.body.cliTime = moment().format('YYYY-MM-DD HH:mm:ss');

  //
  const reqBody = JSON.stringify(extInfo.body);

  //
  incrCallCount();

  let callCountIsDecremented = false;

  const controller: AbortController = new AbortController();

  addAbortController(controller);

  const { signal } = controller;

  const fetchPromise = window.fetch(
    uri,
    <RequestInit>{
      method,
      headers,
      body: reqBody,
      mode: 'same-origin',
      credentials: 'same-origin',
      cache: 'no-store',
      signal,
    },
  );

  const timeoutHandle = setTimeout(
    () => {return controller.abort();},
    EnvConfig.API_CALL_REQ_TIMEOUT_MS,
  );

  extInfo.resp = null;

  let respStatus: number | null = null;

  let callbackLoc: string | null = null;

  // -----
  return fetchPromise.then((resp) => {
    //
    extInfo.resp = resp;

    //
    respStatus = resp.status;

    //
    clearTimeout(timeoutHandle);

    //
    if (!getIsMounted()) {
      return null;
    }

    if (!callCountIsDecremented) {
      decrCallCount('3S9U2');

      callCountIsDecremented = true;
    }

    return resp.json();
  }).then((resInfo) => {
    //
    if (!getIsMounted()) {
      return null;
    }

    //
    if (!resInfo) {
      throw makeError(
        '4H9Z3',
        '`res_info_err',
      );
    }

    //
    if (!((typeof extInfo.msgTimeout === 'number') && !Number.isNaN(extInfo.msgTimeout))) {
      extInfo.msgTimeout = EnvConfig.API_CALL_MSG_TIMEOUT_MS;
    }

    // -----
    if (typeof respStatus !== 'number'
      || respStatus < ApiResStatus.HTTP_200_BIZ_SUCC
      || respStatus > ApiResStatus.HTTP_299_BIZ_FAIL
    ) {
      //
      const loc = `${cliLoc}-${resInfo && resInfo.loc || '5K1E6'}`;

      //
      extInfo.msgTitle = `Error${EnvConfig.DEV_ON ? ` (${loc})` : ''}`;

      //
      extInfo.msgShown = getErrMsgShown<ReqInfoType, ResInfoType>(
        resInfo,
        extInfo,
      );

      extInfo.msgShown += `<br/><br/>Loc: ${loc}`;

      //
      callbackLoc = onErrorFunc.aoikAntDesignReactStarterApiResCallbackLoc;

      //
      return onErrorFunc(
        resInfo,
        extInfo,
      );
    }

    //
    if (!getIsMounted()) {
      return null;
    }

    //
    if (!resInfo.loc) {
      throw makeError(
        '6R9D5',
        'res_info_no_loc_err',
      );
    }

    //
    if (!resInfo.code) {
      throw makeError(
        '7W9I5',
        'res_info_no_code_err',
      );
    }

    //
    if (!resInfo.msg) {
      throw makeError(
        '8A1G4',
        'res_info_no_msg_err',
      );
    }

    //
    extInfo.msgShown = resInfo.msg;

    //
    if (respStatus !== ApiResStatus.HTTP_200_BIZ_SUCC) {
      //
      extInfo.msgTitle = `Failure${EnvConfig.DEV_ON ? ` (${resInfo.loc})` : ''}`;

      extInfo.msgShown += `<br/><br/>Loc: ${resInfo.loc}`;

      //
      callbackLoc = onFailureFunc.aoikAntDesignReactStarterApiResCallbackLoc;

      //
      return onFailureFunc(
        resInfo,
        extInfo,
      );
    }

    //
    extInfo.msgTitle = `Success${EnvConfig.DEV_ON ? ` (${resInfo.loc})` : ''}`;

    //
    callbackLoc = onSuccessFunc.aoikAntDesignReactStarterApiResCallbackLoc;

    //
    return onSuccessFunc(
      resInfo,
      extInfo,
    );
  }).catch((err) => {
    try {
      if (!getIsMounted()) {
        return null;
      }

      if (!callCountIsDecremented) {
        decrCallCount('9I7C4');

        callCountIsDecremented = true;
      }

      if (err instanceof SyntaxError) {
        if (extInfo.resp) {
          const loc = `${cliLoc}-1N2H5`;

          const errMsg = getErrMsgShown(
            null,
            extInfo,
          );

          const msgShown = `${errMsg}<br/><br/>Loc: ${loc}`;

          const msgTitle = `Error${EnvConfig.DEV_ON ? ` (${loc})` : ''}`;

          Toast.error(msgShown, msgTitle);

          return null;
        }
      }
    }
    catch (err2) {
      let loc = '2F6Y1';

      if (callbackLoc) {
        loc = `${callbackLoc}-${loc}`;
      }

      if (cliLoc) {
        loc = `${cliLoc}-${loc}`;
      }

      //
      handleError(
        loc,
        err2,
      );
    }

    // To be handled at 5S6N8.
    return Promise.reject(err);
  }).finally(() => {
    try {
      //
      if (!callCountIsDecremented) {
        decrCallCount('3R2Q4');

        callCountIsDecremented = true;
      }

      //
      removeAbortController(controller);
    }
    catch (err: any) {
      //
      let loc = '4P1W3';

      if (callbackLoc) {
        loc = `${callbackLoc}-${loc}`;
      }

      if (cliLoc) {
        loc = `${cliLoc}-${loc}`;
      }

      //
      handleError(
        loc,
        err,
      );
    }
  });
}


// -----
function handleError(
  loc: string,
  err: any,
): void {
  //
  Logger.error(`${loc}: Caught Error`, err);

  //
  if (err instanceof DOMException) {
    if (err.name === 'AbortError') {
      const fullLoc = `${loc}-5R9Y7`;

      const msgShown = `Network request timeout<br/><br/>Loc: ${fullLoc}`;

      const msgTitle = `Error${EnvConfig.DEV_ON ? ` (${fullLoc})` : ''}`;

      Toast.error(msgShown, msgTitle);

      return undefined;
    }
  }

  //
  const errLoc = err instanceof BaseError ? err.getLoc() : '';

  const fullLoc = loc + (errLoc ? `-${errLoc}` : '');

  //
  const errMsg = `<br/>Loc: ${fullLoc}`;

  const errTitle = `Exception error${EnvConfig.DEV_ON ? ` (${fullLoc})` : ''}`;

  //
  Toast.error(errMsg, errTitle);

  //
  return undefined;
}


// -----
function makeSafeFunc(
  loc: string,
  func: Function,
) {
  return (...args: any[]) => {
    try {
      const callRes = func(...args);

      if (callRes instanceof Promise) {
        return callRes.catch(
          (err: any) => {
            handleError(
              `${loc}-6X8G1`,
              err,
            );

            return SAFE_FUNC_ERROR;
          },
        );
      }

      return callRes;
    }
    catch (err: any) {
      handleError(
        `${loc}-7I3S9`,
        err,
      );

      return SAFE_FUNC_ERROR;
    }
  };
}


// -----
function makeGetSetCallCount(): [CallApiGetCallCountType, CallApiSetCallCountType] {
  let callCount = 0;

  const getCallCount = () => {
    return callCount;
  };

  const setCallCount = (callCountNew: number) => {
    callCount = callCountNew;
  };

  return [getCallCount, setCallCount];
}


// -----
export {
  abortApiCalls,
  ApiReqInfoType,
  ApiResCode,
  ApiResDebugMsg,
  ApiResInfoType,
  ApiResMsg,
  ApiResStatus,
  callApi,
  CallApiExtInfoType,
  CallApiFuncParamsType,
  CallApiGetCallCountType,
  CallApiGetIsMountedType,
  CallApiResCallbackPlusLocType,
  CallApiSetCallCountType,
  makeApiResCallback,
  makeGetSetCallCount,
  makeSafeFunc,
  SAFE_FUNC_ERROR,
};
