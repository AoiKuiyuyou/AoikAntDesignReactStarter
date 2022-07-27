// +++++ 4W9D5 +++++


// -----
// Must use relative path. `@/` will cause import error.
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import moment from 'moment';

// Must use relative path. `@/` will cause import error.
import { gotoPath } from "../base/cli";
import { EnvConfig as CONFIG } from '../config/env_config';
import { AbortRestError } from './error';
import { BaseError } from './error';
import { makeError } from './error';
import { Logger } from './logging';
import { Toast } from './toast';
import { toastError } from './toast';


// -----
export enum ApiResStatus {
  HTTP_200_BIZ_SUCC = 200,
  HTTP_299_BIZ_FAIL = 299,
  HTTP_300 = 300,
  HTTP_301 = 301,
  HTTP_302 = 302,
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
export enum ApiResCode {
  BIZ_SUCC = 'BIZ_SUCC',
  BIZ_FAIL = 'BIZ_FAIL',
  ARG_ERR = 'ARG_ERR',
  ARG_PARSE_ERR = 'ARG_PARSE_ERR',
  EXC_ERR = 'EXC_ERR',
}


// -----
export enum ApiResMsg {
  // ----- Base -----
  FRONTEND_PROC_ERR = 'Frontend error',
  FRONTEND_PROC_ERR_TITLE = 'Frontend error',
  BROWSER_VERSION_LOW = 'Browser version is low, please upgrade',
  BROWSER_VERSION_LOW_TITLE = 'Browser version error',
  WAIT_PREV_REQ = 'Please wait for the previous request to complete',
  WAIT_PREV_REQ_TITLE = 'Operation too fast',
  REQ_ERR = 'Network request error',
  REQ_TIMEOUT =  'Network request timeout',
  REQ_TIMEOUT_TITLE =  'Network request error',
  REP_NO_STATUS = 'Network response no status code',
  REP_FMT_ERR = 'Network response format error',
  LOGIN_INVALID = 'Please log in',
  LOGIN_INVALID_TITLE = 'Login invalid',
  BACKEND_PROC_ERR_TITLE = 'Backend error',

  BIZ_SUCC = 'Operation success',
  BIZ_SUCC_TITLE = 'Success',
  BIZ_FAIL = 'Operation failure',
  BIZ_FAIL_TITLE = 'Failure',
  ARG_ERR = 'Argument error',
  ARG_PARSE_ERR = 'Argument parse error',
  AUTHEN_ERR = 'Authentication error',
  AUTHOR_ERR = 'Authorization error',
  ROUTE_ERR = 'Route error',
  METHOD_ERR = 'Request method error',
  ACCEPT_ERR = 'Request condition error',
  PROXY_AUTH_ERR = 'Proxy authentication error',
  PROTO_VERSION_ERR = 'Protocol version error',
  FREQ_ERR = 'Operation too frequent. Please try later',
  EXC_ERR = 'Backend exception error',
  IMP_ERR = 'Backend implementation error',
  UNRESP_ERR = 'Backend unresponsive. Please try later',
  UNKNOWN_2XX_ERR = 'Unknown business status code',
  UNKNOWN_3XX_ERR = 'Unknown redirect status code',
  UNKNOWN_4XX_ERR = 'Unknown argument, authentication, or authorization error',
  UNKNOWN_5XX_ERR = 'Unknown backend error',
  UNKNOWN_OTHER_ERR = 'Unknown other status code',
  PAGE_EXPIRED_ERR = 'Page might be expired. Please press `Ctrl+F5` or swipe down the phone screen to refresh the page',
  ERR_LOC_POSTFIX = 'Location:',

  // ----- Login -----
  LOGIN_SUCC = 'Login success',
  LOGIN_FAIL = 'Login failure',
  LOGOUT_SUCC = 'Logout success',
}


// -----
export function makeToastMsg(
  loc: string,
  msg: string,
): string {
  if (!msg.endsWith('.')) {
    // eslint-disable-next-line no-param-reassign
    msg += '.';
  }

  const locStr = loc.replace('/', '<br/>/');

  const toastMsg = `${msg}<br/><br/>${ApiResMsg.ERR_LOC_POSTFIX}：<br/>${locStr}`;

  return toastMsg;
}


// -----
export interface ApiReqParams {
  base: {
    apiLoc: string;

    cliLoc: string;

    // Added by `callApi` at 2D8Q7.
    apiVer?: string;

    // Added by `callApi` at 3V7S1.
    cliTime?: string;
  }
}


// -----
export interface ApiRepParams {
  base: {
    loc: string;

    status: number;

    code: string;

    msg: string;

    redTo?: string;
  },
}


// -----
export function getHttpStatusMsg(status: number | null) {
  if (typeof status !== 'number') {
    return `${ApiResMsg.REP_NO_STATUS}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
  }

  if (status === ApiResStatus.HTTP_200_BIZ_SUCC) {
    return ApiResMsg.BIZ_SUCC;
  }

  if (status === ApiResStatus.HTTP_299_BIZ_FAIL) {
    return ApiResMsg.BIZ_FAIL;
  }

  if (status > ApiResStatus.HTTP_200_BIZ_SUCC && status < ApiResStatus.HTTP_299_BIZ_FAIL) {
    return `${ApiResMsg.UNKNOWN_2XX_ERR}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
  }

  if (status >= ApiResStatus.HTTP_300 && status <= ApiResStatus.HTTP_399) {
    return `${ApiResMsg.UNKNOWN_3XX_ERR}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
  }

  if (status === ApiResStatus.HTTP_400_ARG_ERR) {
    return `${ApiResMsg.ARG_ERR}.${ApiResMsg.PAGE_EXPIRED_ERR}.`;
  }

  if (status === ApiResStatus.HTTP_401_AUTHEN_ERR) {
    return ApiResMsg.AUTHEN_ERR;
  }

  if (status === ApiResStatus.HTTP_403_AUTHOR_ERR) {
    return ApiResMsg.AUTHOR_ERR;
  }

  if (status === ApiResStatus.HTTP_404_ROUTE_ERR) {
    return `${ApiResMsg.ROUTE_ERR}.${ApiResMsg.PAGE_EXPIRED_ERR}.`;
  }

  if (status === ApiResStatus.HTTP_405_METHOD_ERR) {
    return `${ApiResMsg.METHOD_ERR}.${ApiResMsg.PAGE_EXPIRED_ERR}.`;
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
    return `${ApiResMsg.UNKNOWN_4XX_ERR}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
  }

  if (status === ApiResStatus.HTTP_500_EXC_ERR) {
    return ApiResMsg.EXC_ERR;
  }

  if (status === ApiResStatus.HTTP_501_IMP_ERR) {
    return ApiResMsg.IMP_ERR;
  }

  if (
    status === ApiResStatus.HTTP_502_GATEWAY_ERR
    ||
    status === ApiResStatus.HTTP_503_OVERLOAD_ERR
    ||
    status === ApiResStatus.HTTP_504_TIMEOUT_ERR
  ) {
    return ApiResMsg.UNRESP_ERR;
  }

  if (status === ApiResStatus.HTTP_505_VERSION_ERR) {
    return ApiResMsg.PROTO_VERSION_ERR;
  }

  if (status >= ApiResStatus.HTTP_500_EXC_ERR && status <= ApiResStatus.HTTP_599) {
    return `${ApiResMsg.UNKNOWN_5XX_ERR}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
  }

  return `${ApiResMsg.UNKNOWN_OTHER_ERR}${CONFIG.DEV_ON ? `（${status}）` : ''}`;
}


//
export function getErrMsgShown<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams | null,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
) {
  //
  const repStatus = extInfo.rep === null ? 0 : extInfo.rep.status;

  //
  let repMsg: string;

  if (extInfo.rep === null) {
    repMsg = ApiResMsg.REQ_ERR;
  }
  else if (repInfo && repInfo.base && repInfo.base.msg) {
    repMsg = repInfo.base.msg;
  }
  else {
    repMsg = getHttpStatusMsg(repStatus);
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
    errMsgShown = (errMsgArg as Function)(repStatus, repMsg);
  }
  else if (typeof errMsgArg === 'object') {
    errMsgShown = (errMsgArg as object)[repStatus];
  }
  else {
    errMsgShown = repMsg;
  }

  if (!errMsgShown) {
    errMsgShown = repMsg;

    if (!errMsgShown) {
      errMsgShown = ApiResMsg.REQ_ERR;
    }
  }

  //
  return errMsgShown;
}


// -----
export interface AbortControllerWrapper {
  controller: AbortController,
  extInfo: any,
}


// -----
const ABORT_CONTROLLER_WRAPPERS: AbortControllerWrapper[] = [];


// -----
function addAbortControllerWrapper(wrapper: AbortControllerWrapper) {
  ABORT_CONTROLLER_WRAPPERS.push(wrapper);
}


// -----
function removeAbortControllerWrapper(wrapper: AbortControllerWrapper) {
  if (!ABORT_CONTROLLER_WRAPPERS.length) {
    return;
  }

  const index = ABORT_CONTROLLER_WRAPPERS.findIndex(
    (x) => {return x === wrapper;},
  );

  if (index >= 0) {
    ABORT_CONTROLLER_WRAPPERS.splice(index, 1);
  }
}


// -----
export function abortApiCalls() {
  while (ABORT_CONTROLLER_WRAPPERS.length) {
    const wrapper = ABORT_CONTROLLER_WRAPPERS.pop();

    if (wrapper !== undefined) {
      wrapper.extInfo.isAborted = true;

      wrapper.controller.abort();
    }
  }
}


// -----
type CallApiResCallbackType<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams,
  > = ((
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
) => Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]>);


// -----
export type CallApiResCallbackPlusLocType<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams> = CallApiResCallbackType<ReqParams, RepParams> &
  {
    // Added by `callApi` at 4U6D7.
    aoikAntDesignReactStarterApiResCallbackLoc: string
  };

// -----
function onSuccessDummy<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  return Promise.resolve([repInfo, extInfo]);
}

// ----- 4M6N2 -----
onSuccessDummy.aoikAntDesignReactStarterApiResCallbackLoc = '4M6N2';


// -----
function onSuccessDefault<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  const loc = repInfo.base?.loc;

  if (!loc) {
    // ----- 5Z1U2 -----
    throw makeError(
      '5Z1U2',
      'rep_info_no_loc_err',
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

  return Promise.resolve([repInfo, extInfo]);
}

// ----- 1O9F4 -----
onSuccessDefault.aoikAntDesignReactStarterApiResCallbackLoc = '1O9F4';


// -----
function onFailureDummy<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  return Promise.resolve([repInfo, extInfo]);
}

// ----- 5C8D7 -----
onFailureDummy.aoikAntDesignReactStarterApiResCallbackLoc = '5C8D7';


// -----
function onFailureDefault<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  const loc = repInfo.base?.loc;

  if (!loc) {
    // ----- 6C9Z8 -----
    throw makeError(
      '6C9Z8',
      'rep_info_no_loc_err',
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

  return Promise.resolve([repInfo, extInfo]);
}

// ----- 2G8S6 -----
onFailureDefault.aoikAntDesignReactStarterApiResCallbackLoc = '2G8S6';


// -----
function onErrorDummy<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  return Promise.resolve([repInfo, extInfo]);
}

// ----- 6T3M9 -----
onErrorDummy.aoikAntDesignReactStarterApiResCallbackLoc = '6T3M9';


// -----
function onErrorDefault<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  repInfo: RepParams,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  Toast.error(
    extInfo.msgShown,
    extInfo.msgTitle,
    {
      timeOut: extInfo.msgTimeout,
      extendedTimeOut: extInfo.msgTimeout,
    },
  );

  return Promise.resolve([repInfo, extInfo]);
}

// ----- 3X2M6 -----
onErrorDefault.aoikAntDesignReactStarterApiResCallbackLoc = '3X2M6';


// -----
export const SAFE_FUNC_ERROR = {};


// -----
export function makeApiResCallback<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  loc: string,
  func: CallApiResCallbackType<ReqParams, RepParams>,
): CallApiResCallbackPlusLocType<ReqParams, RepParams> {
  //
  const funcWithLoc = func as CallApiResCallbackPlusLocType<ReqParams, RepParams>;

  // ----- 4U6D7 -----
  funcWithLoc.aoikAntDesignReactStarterApiResCallbackLoc = loc;

  //
  return funcWithLoc;
}


// -----
export type CallApiGetIsMountedType = () => boolean;

export type CallApiGetCallCountType = () => number;

export type CallApiSetCallCountType = (count: number) => void;


//
export interface OnRepHandlerParams {
  loc: string,
  repInfo: any,
  extInfo: any,
}


//
export type OnRepHandler = (
  params: OnRepHandlerParams,
) => boolean | undefined;


// -----
export function makeOnRepAuthErrGotoLoginPage(
  loc: string,
  loginUrl: string,
): OnRepHandler {
  return (
    params: OnRepHandlerParams,
  ) => {
    //
    if (params.repInfo?.base?.status !== 401) {
      // Continue response handling.
      return true;
    }

    // ----- 1W8H3 -----
    toastError(
      '1W8H3',
      ApiResMsg.LOGIN_INVALID,
      ApiResMsg.LOGIN_INVALID_TITLE,
    );

    // ----- 7M5V4 -----
    gotoPath({
      loc: `${loc}+(7M5V4)`,
      path: loginUrl,
    });

    // ----- 1V6Z3 -----
    throw new AbortRestError(
      `${loc}+(1V6Z3)`,
      ApiResMsg.LOGIN_INVALID_TITLE,
    );
  };
}


// -----
export interface CallApiFuncParamsType<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams> {
  uri: string;

  method?: string;

  headers?: object;

  body: ReqParams;

  getIsMounted: CallApiGetIsMountedType;

  getCallCount?: CallApiGetCallCountType;

  setCallCount?: CallApiSetCallCountType;

  ignoreCallCount?: boolean;

  onStart?: Function;

  onEnd?: Function;

  onSuccess?: CallApiResCallbackPlusLocType<ReqParams, RepParams> | boolean;

  onFailure?: CallApiResCallbackPlusLocType<ReqParams, RepParams> | boolean;

  onError?: CallApiResCallbackPlusLocType<ReqParams, RepParams> | boolean;

  onRep?: OnRepHandler | false;

  onRepAuthErrGoto?: string,

  errMsg?: string | object | Function;

  msgTimeout?: number;

  propErr?: boolean;
}


// -----
export interface CallApiExtInfoType<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams> extends CallApiFuncParamsType<ReqParams, RepParams> {
  rep: Response | null;

  msgTitle: string;

  msgShown: string;

  msgNoLoc: string;

  isAborted: boolean;

  isError: boolean;

  isFailure: boolean;

  isSuccess: boolean;
}


// -----
export async function callApi<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  funcParams: CallApiFuncParamsType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  // ----- 9O7D1 -----
  let cliLoc = `*@${CONFIG.APP_LOC}+(9O7D1)`;

  //
  const extInfo = { ...funcParams } as CallApiExtInfoType<ReqParams, RepParams>;

  //
  extInfo.isAborted = false;
  extInfo.isError = false;
  extInfo.isFailure = false;
  extInfo.isSuccess = false;

  //
  try {
    //
    cliLoc = funcParams.body.base?.cliLoc;

    if (typeof cliLoc !== 'string' || !cliLoc || cliLoc.length < 5) {
      // ----- 1Q5S6 -----
      cliLoc = `*@${CONFIG.APP_LOC}+(1Q5S6)`;

      throw makeError(
        cliLoc,
        'invalid_cliloc_err',
      );
    }

    if (!cliLoc.startsWith('*@')) {
      cliLoc = `*@${CONFIG.APP_LOC}-#${cliLoc}`;

      // eslint-disable-next-line no-param-reassign
      funcParams.body.base.cliLoc = cliLoc;
    }

    //
    const { apiLoc } = funcParams.body.base;

    if (typeof apiLoc !== 'string' || !apiLoc || apiLoc.length !== 5) {
      // ----- 8Q4E6 -----
      throw makeError(
        '8Q4E6',
        'Invalid `body.apiLoc`',
      );
    }

    //
    if (funcParams.onStart) {
      let onStartRes = funcParams.onStart();

      if (onStartRes instanceof Promise) {
        onStartRes = await onStartRes.catch(
          (err: any) => {
            // ----- 2U5Y9 -----
            handleError(
              cliLoc,
              '2U5Y9',
              err,
            );

            return SAFE_FUNC_ERROR;
          },
        );
      }

      if (onStartRes === SAFE_FUNC_ERROR) {
        return [null, extInfo];
      }
    }

    //
    const callRes = callApiImp<ReqParams, RepParams>(funcParams, extInfo);

    //
    if (!(callRes instanceof Promise) || funcParams.propErr) {
      extInfo.isError = true;
      extInfo.isFailure = false;
      extInfo.isSuccess = false;

      return callRes;
    }

    //
    return callRes.catch(
      (err: any) => {
        //
        if (err instanceof AbortRestError) {
          //
          throw err;
        }

        //
        if (extInfo.isAborted) {
          return [null, extInfo];
        }

        // ----- 9D3E7 -----
        handleError(
          cliLoc,
          '9D3E7',
          err,
        );

        extInfo.isError = true;
        extInfo.isFailure = false;
        extInfo.isSuccess = false;

        return [null, extInfo];
      },
    );
  }
  catch (err: any) {
    //
    if (err instanceof AbortRestError) {
      //
      throw err;
    }

    //
    if (funcParams.propErr) {
      return Promise.reject(err);
    }

    // ----- 1R7Z5 -----
    handleError(
      cliLoc,
      '1R7Z5',
      err,
    );

    extInfo.isError = true;
    extInfo.isFailure = false;
    extInfo.isSuccess = false;

    return [null, extInfo];
  }
  finally {
    try {
      if (funcParams.onEnd) {
        const onEndRes = funcParams.onEnd();

        if (onEndRes instanceof Promise) {
          await onEndRes;
        }
      }
    }
    catch (err: any) {
      //
      if (err instanceof AbortRestError) {
        //
        throw err;
      }

      // ----- 2V6T4 -----
      handleError(
        cliLoc,
        '2V6T4',
        err,
      );
    }
  }
}


// -----
function callApiImp<ReqParams extends ApiReqParams,
  RepParams extends ApiRepParams>(
  funcParams: CallApiFuncParamsType<ReqParams, RepParams>,
  extInfo: CallApiExtInfoType<ReqParams, RepParams>,
): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> {
  //
  let { cliLoc } = funcParams.body.base;

  //
  if (typeof cliLoc !== 'string') {
    // ----- 1H5I4 -----
    cliLoc = `*@${CONFIG.APP_LOC}+(1H5I4)`;

    throw makeError(
      cliLoc,
      'cliloc_arg_err',
    );
  }

  //
  if (window.fetch === undefined || window.localStorage === undefined) {
    // ----- 4J7H5 -----
    const fullLoc = `${cliLoc}+(4J7H5)`;

    if (funcParams.propErr) {
      return Promise.reject(fullLoc);
    }

    const errMsg = makeToastMsg(
      fullLoc,
      ApiResMsg.BROWSER_VERSION_LOW,
    );

    const errTitle = ApiResMsg.BROWSER_VERSION_LOW_TITLE;

    Toast.error(errMsg, errTitle);

    return Promise.resolve([null, extInfo]);
  }

  //
  const { uri } = extInfo;

  if (!uri) {
    // ----- 5Q7H6 -----
    throw makeError(
      '5Q7H6',
      'uri_arg_err',
    );
  }

  if (!uri.startsWith('/api/')) {
    // ----- 6Z5Y8 -----
    throw makeError(
      '6Z5Y8',
      'uri_prefix_err',
    );
  }

  //
  let getIsMounted = extInfo.getIsMounted;

  //
  if (getIsMounted === undefined || getIsMounted === null) {
    //
    getIsMounted = function() {
      return true;
    }
  }

  //
  if (!(getIsMounted instanceof Function)) {
    // ----- 7R2S5 -----
    throw makeError(
      '7R2S5',
      'getismounted_arg_err',
    );
  }

  //
  let ignoreCallCount: boolean = extInfo.ignoreCallCount || true;

  //
  if ((typeof ignoreCallCount) !== 'boolean') {
    // ----- 9O3E5 -----
    throw makeError(
      '9O3E5',
      'ignorecallcount_arg_err',
    );
  }

  //
  const getCallCount = extInfo.getCallCount;

  //
  if (!ignoreCallCount && !(getCallCount instanceof Function)) {
    // ----- 8T3Q2 -----
    throw makeError(
      '8T3Q2',
      'getcallcount_arg_err',
    );
  }

  //
  const setCallCount = extInfo.setCallCount;

  //
  if (!ignoreCallCount && !(setCallCount instanceof Function)) {
    // ----- 9X5B1 -----
    throw makeError(
      '9X5B1',
      'setcallcount_arg_err',
    );
  }

  // @ts-ignore
  if (!ignoreCallCount && getCallCount() !== 0) {
    // ----- 1K7Y5 -----
    const fullLoc = `${cliLoc}+(1K7Y5)`;

    //
    const errMsg = ApiResMsg.WAIT_PREV_REQ;

    //
    const errMsgToasted = makeToastMsg(
      fullLoc,
      errMsg,
    );

    //
    const errTitle = ApiResMsg.WAIT_PREV_REQ_TITLE;

    //
    Toast.error(errMsgToasted, errTitle);

    // ----- 2H3R7 -----
    throw new AbortRestError(
      '2H3R7',
      errMsg,
    );
  }

  //
  const incrCallCount = () => {
    if (ignoreCallCount) {
      return;
    }

    // @ts-ignore
    setCallCount(getCallCount() + 1);
  };

  //
  const decrCallCount = (loc: string) => {
    if (ignoreCallCount) {
      return;
    }

    // @ts-ignore
    const callCount = getCallCount();

    if (callCount <= 0) {
      // ----- 2Y4G6 -----
      throw makeError(
        `${loc}+(2Y4G6)`,
        'call_count_decremented_to_negative_err',
      );
    }

    // @ts-ignore
    setCallCount(callCount - 1);
  };

  // @ts-ignore
  let onSuccessFunc: CallApiResCallbackPlusLocType<ReqParams, RepParams>;

  if (extInfo.onSuccess === false) {
    onSuccessFunc = onSuccessDummy;
  }
  else if (extInfo.onSuccess === true) {
    onSuccessFunc = onSuccessDefault;
  }
  else {
    onSuccessFunc = extInfo.onSuccess || onSuccessDefault;
  }

  if (typeof onSuccessFunc !== 'function') {
    // ----- 3C7X4 -----
    throw makeError(
      '3C7X4',
      'onsuccess_arg_err',
    );
  }

  // @ts-ignore
  let onFailureFunc: CallApiResCallbackPlusLocType<ReqParams, RepParams>;

  if (extInfo.onFailure === false) {
    onFailureFunc = onFailureDummy;
  }
  else if (extInfo.onFailure === true) {
    onFailureFunc = onFailureDefault;
  }
  else {
    onFailureFunc = extInfo.onFailure || onFailureDefault;
  }

  if (typeof onFailureFunc !== 'function') {
    // ----- 4T1C2 -----
    throw makeError(
      '4T1C2',
      'onfailure_arg_err',
    );
  }

  // @ts-ignore
  let onErrorFunc: CallApiResCallbackPlusLocType<ReqParams, RepParams>;

  if (extInfo.onError === false) {
    onErrorFunc = onErrorDummy;
  }
  else if (extInfo.onError === true) {
    onErrorFunc = onErrorDefault;
  }
  else {
    onErrorFunc = extInfo.onError || onErrorDefault;
  }

  if (typeof onErrorFunc !== 'function') {
    // ----- 5D2X6 -----
    throw makeError(
      '5D2X6',
      'onerror_arg_err',
    );
  }

  //
  if (funcParams.onRepAuthErrGoto !== undefined && funcParams.onRepAuthErrGoto !== null) {
    //
    if (typeof funcParams.onRepAuthErrGoto !== 'string') {
      // ----- 8P6D1 -----
      throw makeError(
        '8P6D1',
        'onrepautherrgoto_arg_not_string_err',
      );
    }

    //
    if (funcParams.onRep !== undefined && funcParams.onRep !== null) {
      // ----- 9W4Q3 -----
      throw makeError(
        '9W4Q3',
        'onrep_onrepautherrgoto_coexist_err',
      );
    }

    // ----- 1C2G7 -----
    funcParams.onRep = makeOnRepAuthErrGotoLoginPage(
      `${cliLoc}+(1C2G7)`,
      funcParams.onRepAuthErrGoto,
    );
  }

  //
  const method: string = extInfo.method || 'POST';

  //
  const headers: object = extInfo.headers || {};

  //
  headers['Content-Type'] = 'application/json';

  // ----- 2D8Q7 -----
  // eslint-disable-next-line no-param-reassign
  extInfo.body.base.apiVer = CONFIG.API_VER;

  // ----- 3V7S1 -----
  // eslint-disable-next-line no-param-reassign
  extInfo.body.base.cliTime = moment().format('YYYY-MM-DD HH:mm:ss');

  //
  const reqBody = JSON.stringify(extInfo.body);

  //
  incrCallCount();

  let callCountIsDecremented = false;

  const controller: AbortController = new AbortController();

  const controllerWrapper: AbortControllerWrapper = {
    controller,
    extInfo,
  };

  addAbortControllerWrapper(controllerWrapper);

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
    CONFIG.API_CALL_REQ_TIMEOUT_MS,
  );

  // eslint-disable-next-line no-param-reassign
  extInfo.rep = null;

  let repStatus: number | null = null;

  let callbackLoc: string | null = null;

  // -----
  return fetchPromise.then((rep) => {
    // eslint-disable-next-line no-param-reassign
    extInfo.rep = rep;

    //
    repStatus = rep.status;

    //
    clearTimeout(timeoutHandle);

    //
    if (!callCountIsDecremented) {
      // ----- 6H3Z9 -----
      decrCallCount('6H3Z9');

      callCountIsDecremented = true;
    }

    //
    return rep.json();
  }).then((
    repInfo: RepParams,
  ): Promise<[RepParams | null, CallApiExtInfoType<ReqParams, RepParams>]> => {
    //
    if (!getIsMounted()) {
      //
      return Promise.resolve([null, extInfo]);
    }

    //
    let fullLoc;

    // @ts-ignore
    const repLoc = repInfo?.base?.loc ?? repInfo?.loc;

    if (!repLoc) {
      // ----- 9N2A1 -----
      fullLoc = `${cliLoc}+(9N2A1)`;
    } else if (repLoc.startsWith('*')) {
      fullLoc = repLoc;
    } else if (repLoc.startsWith('/')) {
      fullLoc = `${cliLoc}${repLoc}`;
    } else {
      fullLoc = `${cliLoc}/${repLoc}`;
    }

    //
    const onRep = funcParams.onRep;

    //
    if (onRep === false) {
      return Promise.resolve([repInfo, extInfo]);
    }

    //
    if (onRep !== undefined) {
      const toContinue = onRep({
        loc: fullLoc,
        repInfo,
        extInfo,
      });

      if (!toContinue) {
        // eslint-disable-next-line no-param-reassign
        extInfo.isAborted = true;

        return Promise.resolve([repInfo, extInfo]);
      }
    }

    //
    if (!repInfo) {
      // ----- 7K4W6 -----
      throw makeError(
        '7K4W6',
        '`rep_info_err',
      );
    }

    //
    if (!((typeof extInfo.msgTimeout === 'number') && Number.isInteger(extInfo.msgTimeout))) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgTimeout = CONFIG.API_CALL_MSG_TIMEOUT_MS;
    }

    // -----
    if (
      typeof repStatus !== 'number'
      ||
      repStatus < ApiResStatus.HTTP_200_BIZ_SUCC
      ||
      repStatus > ApiResStatus.HTTP_299_BIZ_FAIL
    ) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgTitle = ApiResMsg.BACKEND_PROC_ERR_TITLE;

      // eslint-disable-next-line no-param-reassign
      extInfo.msgNoLoc = getErrMsgShown<ReqParams, RepParams>(
        repInfo,
        extInfo,
      );

      //
      if (typeof extInfo.msgNoLoc === 'string' && extInfo.msgNoLoc) {
        if (!extInfo.msgNoLoc.endsWith('.')) {
          // eslint-disable-next-line no-param-reassign
          extInfo.msgNoLoc += '.';
        }
      }

      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = makeToastMsg(
        fullLoc,
        extInfo.msgNoLoc,
      );

      //
      callbackLoc = onErrorFunc.aoikAntDesignReactStarterApiResCallbackLoc;

      // eslint-disable-next-line no-param-reassign
      extInfo.isError = true;
      // eslint-disable-next-line no-param-reassign
      extInfo.isFailure = false;
      // eslint-disable-next-line no-param-reassign
      extInfo.isSuccess = false;

      //
      return onErrorFunc(
        repInfo,
        extInfo,
      );
    }

    //
    if (!getIsMounted()) {
      return Promise.resolve([null, extInfo]);
    }

    //
    if (!repInfo.base) {
      // ----- 1D8H5 -----
      throw makeError(
        '1D8H5',
        '`rep_info_base_err',
      );
    }

    //
    if (!repInfo.base.loc) {
      // ----- 9L6Z8 -----
      throw makeError(
        '9L6Z8',
        'rep_info_no_loc_err',
      );
    }

    //
    if (!repInfo.base.code) {
      // ----- 1E2Q9 -----
      throw makeError(
        '1E2Q9',
        'rep_info_no_code_err',
      );
    }

    //
    if (!repInfo.base.msg) {
      // ----- 2Y3T8 -----
      throw makeError(
        '2Y3T8',
        'rep_info_no_msg_err',
      );
    }

    // eslint-disable-next-line no-param-reassign
    extInfo.msgNoLoc = repInfo.base.msg;

    //
    if (typeof extInfo.msgNoLoc === 'string' && extInfo.msgNoLoc) {
      if (!extInfo.msgNoLoc.endsWith('.')) {
        // eslint-disable-next-line no-param-reassign
        extInfo.msgNoLoc += '.';
      }
    }

    //
    extInfo.msgShown = extInfo.msgNoLoc;

    //
    if (repStatus !== ApiResStatus.HTTP_200_BIZ_SUCC) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgTitle = ApiResMsg.BIZ_FAIL_TITLE;

      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = makeToastMsg(
        fullLoc,
        extInfo.msgNoLoc,
      );

      //
      callbackLoc = onFailureFunc.aoikAntDesignReactStarterApiResCallbackLoc;

      // eslint-disable-next-line no-param-reassign
      extInfo.isError = false;
      // eslint-disable-next-line no-param-reassign
      extInfo.isFailure = true;
      // eslint-disable-next-line no-param-reassign
      extInfo.isSuccess = false;

      //
      return onFailureFunc(
        repInfo,
        extInfo,
      );
    }

    // eslint-disable-next-line no-param-reassign
    extInfo.msgTitle = ApiResMsg.BIZ_SUCC_TITLE;

    //
    if (CONFIG.SUCCESS_TOAST_SHOW_LOC) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = makeToastMsg(
        fullLoc,
        extInfo.msgNoLoc,
      );
    }

    //
    callbackLoc = onSuccessFunc.aoikAntDesignReactStarterApiResCallbackLoc;

    // eslint-disable-next-line no-param-reassign
    extInfo.isError = false;
    // eslint-disable-next-line no-param-reassign
    extInfo.isFailure = false;
    // eslint-disable-next-line no-param-reassign
    extInfo.isSuccess = true;

    //
    return onSuccessFunc(
      repInfo,
      extInfo,
    );
  }).catch(async (err): Promise<[
      RepParams | null,
    CallApiExtInfoType<ReqParams, RepParams>
  ]> => {
    try {
      if (!getIsMounted()) {
        return await Promise.resolve([null, extInfo]);
      }

      if (!callCountIsDecremented) {
        // ----- 3R1C2 -----
        decrCallCount('3R1C2');

        callCountIsDecremented = true;
      }

      // If the response body format is not JSON.
      if (err instanceof SyntaxError) {
        // If has response.
        if (extInfo.rep) {
          // ----- 4W2U1 -----
          const fullLoc = `${cliLoc}+(4W2U1)`;

          // eslint-disable-next-line no-param-reassign
          extInfo.msgTitle = ApiResMsg.BACKEND_PROC_ERR_TITLE;

          extInfo.msgNoLoc = extInfo?.rep?.status === ApiResStatus.HTTP_200_BIZ_SUCC
            ? ApiResMsg.REP_FMT_ERR : getErrMsgShown(
              null,
              extInfo,
            );

          // eslint-disable-next-line no-param-reassign
          extInfo.msgShown = makeToastMsg(
            fullLoc,
            extInfo.msgNoLoc,
          );

          //
          await onErrorFunc(
            // @ts-ignore
            null,
            extInfo,
          );

          //
          return await Promise.resolve([null, extInfo]);
        }
      }
    }
    catch (err2) {
      //
      const loc = callbackLoc ? `*${cliLoc}+(${callbackLoc})` : `*${cliLoc}`;

      // ----- 5X1L8 -----
      handleError(
        loc,
        '5X1L8',
        err2,
      );
    }

    // To be handled at 9D3E7.
    return Promise.reject(err);
  }).finally(() => {
    try {
      //
      if (!callCountIsDecremented) {
        // ----- 6X1C3 -----
        decrCallCount('6X1C3');

        callCountIsDecremented = true;
      }

      //
      removeAbortControllerWrapper(controllerWrapper);
    }
    catch (err: any) {
      //
      const loc = callbackLoc ? `*${cliLoc}+(${callbackLoc})` : `*${cliLoc}`;

      // ----- 7C3O9 -----
      handleError(
        loc,
        '7C3O9',
        err,
      );
    }
  });
}


// -----
function handleError(
  loc: string,
  handleLoc: string,
  err: any,
): void {
  //
  Logger.error(`${loc}+(${handleLoc}): Caught Error`, err);

  //
  if (err.name === 'AbortError') {
    // ----- 8M2J6 -----
    const fullLoc = `${loc}+(${handleLoc})+(8M2J6)`;

    const msgShown = makeToastMsg(
      fullLoc,
      ApiResMsg.REQ_TIMEOUT,
    );

    const msgTitle = ApiResMsg.REQ_TIMEOUT_TITLE;

    Toast.error(msgShown, msgTitle);

    return undefined;
  }

  // ----- 9J7M4 -----
  // `9J7M4` means non-BaseError.
  const errLoc = err instanceof BaseError ? err.getLoc() : '9J7M4';

  //
  const fullLoc = `${loc}+(${errLoc})+(${handleLoc})`;

  //
  const errMsg = makeToastMsg(
    fullLoc,
    ApiResMsg.FRONTEND_PROC_ERR,
  );

  const errTitle = ApiResMsg.FRONTEND_PROC_ERR_TITLE;

  //
  Toast.error(errMsg, errTitle);

  //
  return undefined;
}


// -----
export function makeSafeFunc(
  loc: string,
  func: Function,
) {
  return (...args: any[]) => {
    try {
      const callRes = func(...args);

      if (callRes instanceof Promise) {
        return callRes.catch(
          (err: any) => {
            //
            if (err instanceof AbortRestError) {
              //
              return;
            }

            // ----- 9D1P6 -----
            handleError(
              loc,
              '9D1P6',
              err,
            );
          },
        );
      }

      return callRes;
    }
    catch (err: any) {
      //
      if (err instanceof AbortRestError) {
        //
        return;
      }

      // ----- 1U3J2 -----
      handleError(
        loc,
        '1U3J2',
        err,
      );

      //
      return;
    }
  };
}


// -----
export function makeGetSetCallCount(): [CallApiGetCallCountType, CallApiSetCallCountType] {
  let callCount = 0;

  const getCallCount = () => {
    return callCount;
  };

  const setCallCount = (callCountNew: number) => {
    callCount = callCountNew;
  };

  return [getCallCount, setCallCount];
}
