// +++++ 4W9D5 +++++


// -----
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import moment from 'moment';

// Must use relative path. `@/` will cause import error.
import { EnvConfig } from '../config/env_config';
import { BaseError } from './error';
import { makeError } from './error';
import { Logger } from './logging';
import { Toast } from './toast';


// -----
export enum ApiResStatus {
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
  SUCCESS = 'Success',
  FAILURE = 'Failure',
  ERROR = 'Error',
  NET_REQ_ERR = 'Network request error',
  ARG_ERR = 'Argument error',
  ARG_PARSE_ERR = 'Argument parse error',
  AUTHEN_ERR = 'Authentication error',
  AUTHOR_ERR = 'Authorization error',
  ROUTE_ERR = 'Route error',
  METHOD_ERR = 'Request method error',
  ACCEPT_ERR = 'Request condition error',
  PROXY_AUTH_ERR = 'Proxy authentication error',
  PROTO_VERSION_ERR = 'Protocol version error',
  FREQ_ERR = 'Operation too frequent. Please try later.',
  EXC_ERR = 'Backend exception error',
  IMP_ERR = 'Backend implementation error',
  UNRESP_ERR = 'Backend unresponsive. Please try later.',
  UNKNOWN_2XX_ERR = 'Unknown business status code',
  UNKNOWN_3XX_ERR = 'Unknown redirect status code',
  UNKNOWN_4XX_ERR = 'Unknown argument, authentication, or authorization error',
  UNKNOWN_5XX_ERR = 'Unknown backend error',
  UNKNOWN_OTHER_ERR = 'Unknown other status code',
  PAGE_EXPIRED_ERR = 'Page might be expired.'
    + 'Please press `Ctrl+F5` or swipe down the phone screen to refresh the page.',
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
  addLocToMsg: boolean,
): string {
  if (!msg.endsWith('.')) {
    // eslint-disable-next-line no-param-reassign
    msg += '.';
  }

  const locStr = loc.replace('/', '<br/>/');

  const toastMsg = addLocToMsg ?
    `${msg}<br/><br/>${ApiResMsg.ERR_LOC_POSTFIX}<br/>${locStr}` : msg;

  return toastMsg;
}


// -----
export enum ApiResDebugMsg {
  EMPTY = '',
}


// -----
export interface ApiReqBody {
  base: {
    apiLoc: string;

    cliLoc: string;

    // Added by `callApi` at 1U3M4.
    apiVer?: string;

    // Added by `callApi` at 2C1P5.
    cliTime?: string;
  }
}


// -----
export interface ApiRepBody {
  base: {
    loc: string;

    status: number;

    code: string;

    msg: string;
  },
}


// -----
export function getHttpStatusMsg(status: number | null) {
  if (typeof status !== 'number') {
    return `No status code.${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  if (status === ApiResStatus.HTTP_200_BIZ_SUCC) {
    return ApiResMsg.SUCCESS;
  }

  if (status === ApiResStatus.HTTP_299_BIZ_FAIL) {
    return ApiResMsg.FAILURE;
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
    return `${ApiResMsg.UNKNOWN_5XX_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
  }

  return `${ApiResMsg.UNKNOWN_OTHER_ERR}${EnvConfig.DEV_ON ? ` (${status})` : ''}`;
}


//
export function getErrMsgShown<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType | null,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
) {
  //
  const repStatus = extInfo.rep === null ? 0 : extInfo.rep.status;

  //
  let repMsg: string;

  if (extInfo.rep === null) {
    repMsg = ApiResMsg.NET_REQ_ERR;
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
      errMsgShown = ApiResMsg.NET_REQ_ERR;
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
type HttpStatusHandler = (loc: string) => boolean;


// -----
let HTTP_STATUS_HANDLERS: {
  [key: number]: HttpStatusHandler,
} = {};


// -----
export function addHttpStatusHandler(
  status: number,
  handler: HttpStatusHandler,
) {
  HTTP_STATUS_HANDLERS[status] = handler;
}


// -----
export function removeHttpStatusHandler(status: number) {
  delete HTTP_STATUS_HANDLERS[status];
}


// -----
export function clearHttpStatusHandlers() {
  HTTP_STATUS_HANDLERS = {};
}


// -----
type CallApiResCallbackType<ReqBodyType extends ApiReqBody,
    RepBodyType extends ApiRepBody,
    > = ((
    repInfo: RepBodyType,
    extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
) => Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]>);


// -----
export type CallApiResCallbackPlusLocType<ReqBodyType extends ApiReqBody,
    RepBodyType extends ApiRepBody> = CallApiResCallbackType<ReqBodyType, RepBodyType> &
    {
      // Added by `callApi` at 1T4N3.
      aoikAntDesignReactStarterApiResCallbackLoc: string
    };

// -----
function onSuccessDummy<ReqBodyType extends ApiReqBody,
    RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  return Promise.resolve([repInfo, extInfo]);
}

onSuccessDummy.aoikAntDesignReactStarterApiResCallbackLoc = '3A5B7';


// -----
function onSuccessDefault<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  const loc = repInfo.base?.loc;

  if (!loc) {
    throw makeError(
      '5T7C3',
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

onSuccessDefault.aoikAntDesignReactStarterApiResCallbackLoc = '6U8J3';


// -----
function onFailureDummy<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  return Promise.resolve([repInfo, extInfo]);
}

onFailureDummy.aoikAntDesignReactStarterApiResCallbackLoc = '4M6D1';


// -----
function onFailureDefault<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  const loc = repInfo.base?.loc;

  if (!loc) {
    throw makeError(
      '7C5S6',
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

onFailureDefault.aoikAntDesignReactStarterApiResCallbackLoc = '8V3R4';


// -----
function onErrorDummy<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  return Promise.resolve([repInfo, extInfo]);
}

onErrorDummy.aoikAntDesignReactStarterApiResCallbackLoc = '5S2R8';


// -----
function onErrorDefault<ReqBodyType extends ApiReqBody,
    RepBodyType extends ApiRepBody>(
  repInfo: RepBodyType,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
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

onErrorDefault.aoikAntDesignReactStarterApiResCallbackLoc = '9O2Z1';


// -----
export const SAFE_FUNC_ERROR = {};


// -----
export function makeApiResCallback<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  loc: string,
  func: CallApiResCallbackType<ReqBodyType, RepBodyType>,
): CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> {
  //
  const funcWithLoc = func as CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType>;

  // ----- 1T4N3 -----
  funcWithLoc.aoikAntDesignReactStarterApiResCallbackLoc = loc;

  //
  return funcWithLoc;
}


// -----
export type CallApiGetIsMountedType = () => boolean;

export type CallApiGetCallCountType = () => number;

export type CallApiSetCallCountType = (count: number) => void;


// -----
export interface CallApiFuncParamsType<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody> {
  uri: string;

  method?: string;

  headers?: object;

  body: ReqBodyType;

  getIsMounted: CallApiGetIsMountedType;

  getCallCount?: CallApiGetCallCountType;

  setCallCount?: CallApiSetCallCountType;

  ignoreCallCount?: boolean;

  onStart?: Function;

  onEnd?: Function;

  onSuccess?: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> | boolean;

  onFailure?: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> | boolean;

  onError?: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> | boolean;

  errMsg?: string | object | Function;

  msgTimeout?: number;

  propErr?: boolean;
}


// -----
export interface CallApiExtInfoType<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody> extends CallApiFuncParamsType<ReqBodyType, RepBodyType> {
  rep: Response | null;

  msgTitle: string;

  msgShown: string;

  isAborted: boolean;

  isError: boolean;

  isFailure: boolean;

  isSuccess: boolean;
}


// -----
export async function callApi<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  funcParams: CallApiFuncParamsType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  //
  let cliLoc = `*@${EnvConfig.APP_LOC}-6H7J3`;

  //
  const extInfo = { ...funcParams } as CallApiExtInfoType<ReqBodyType, RepBodyType>;

  //
  extInfo.isAborted = false;
  extInfo.isError = false;
  extInfo.isFailure = false;
  extInfo.isSuccess = false;

  //
  try {
    //
    cliLoc = funcParams.body.base?.cliLoc;

    if (typeof cliLoc !== 'string' || !cliLoc || cliLoc.length !== 5) {
      cliLoc = `*@${EnvConfig.APP_LOC}-#2F8Y3`;

      throw makeError(
        cliLoc,
        'invalid_cliloc_err',
      );
    }

    if (!cliLoc.startsWith('*@')) {
      cliLoc = `*@${EnvConfig.APP_LOC}-#${cliLoc}`;

      // eslint-disable-next-line no-param-reassign
      funcParams.body.base.cliLoc = cliLoc;
    }

    //
    const { apiLoc } = funcParams.body.base;

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
              `${cliLoc}+8X1N2`,
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
    const callRes = callApiImp<ReqBodyType, RepBodyType>(funcParams, extInfo);

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
        if (extInfo.isAborted) {
          return [null, extInfo];
        }
        // ----- 4W7F9 -----
        handleError(
          `${cliLoc}+4W7F9`,
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
    if (funcParams.propErr) {
      return Promise.reject(err);
    }

    handleError(
      `${cliLoc}-5S6N8`,
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
      handleError(
        `${cliLoc}-6V8Y5`,
        err,
      );
    }
  }
}


// -----
function callApiImp<ReqBodyType extends ApiReqBody,
  RepBodyType extends ApiRepBody>(
  funcParams: CallApiFuncParamsType<ReqBodyType, RepBodyType>,
  extInfo: CallApiExtInfoType<ReqBodyType, RepBodyType>,
): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> {
  //
  let { cliLoc } = funcParams.body.base;

  //
  if (typeof cliLoc !== 'string') {
    cliLoc = `*@${EnvConfig.APP_LOC}-7Y9T1`;

    throw makeError(
      cliLoc,
      'cliloc_arg_err',
    );
  }

  //
  if (window.fetch === undefined || window.localStorage === undefined) {
    const fullLoc = `${cliLoc}+8T2K6`;

    if (funcParams.propErr) {
      return Promise.reject(fullLoc);
    }

    const errMsg = makeToastMsg(
      fullLoc,
      'Browser version is low, please upgrade.',
      EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
    );

    const errTitle = 'Browser version error';

    Toast.error(errMsg, errTitle);

    return Promise.resolve([null, extInfo]);
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
  const getIsMounted = extInfo.getIsMounted;

  //
  if (!(getIsMounted instanceof Function)) {
    throw makeError(
      '2F4V6',
      'getismounted_arg_err',
    );
  }

  //
  let ignoreCallCount: boolean = extInfo.ignoreCallCount || false;

  if ((typeof ignoreCallCount) !== 'boolean') {
    ignoreCallCount = false;
  }

  //
  const getCallCount = extInfo.getCallCount;

  //
  if (!ignoreCallCount && !(getCallCount instanceof Function)) {
    throw makeError(
      '4A9X8',
      'getcallcount_arg_err',
    );
  }

  //
  const setCallCount = extInfo.setCallCount;

  //
  if (!ignoreCallCount && !(setCallCount instanceof Function)) {
    throw makeError(
      '7C4X2',
      'setcallcount_arg_err',
    );
  }

  //
  if (!ignoreCallCount && getCallCount() !== 0) {
    const fullLoc = `${cliLoc}+5H8J6`;

    const errMsg = makeToastMsg(
      fullLoc,
      'Please wait for the previous request to complete.',
      EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
    );

    const errTitle = ApiResMsg.ERROR;

    Toast.error(errMsg, errTitle);

    return Promise.resolve([null, extInfo]);
  }

  //
  const incrCallCount = () => {
    if (ignoreCallCount) {
      return;
    }

    setCallCount(getCallCount() + 1);
  };

  //
  const decrCallCount = (loc: string) => {
    if (ignoreCallCount) {
      return;
    }

    const callCount = getCallCount();

    if (callCount <= 0) {
      throw makeError(
        `${loc}+6Z9N3`,
        'call_count_decremented_to_negative_err',
      );
    }

    setCallCount(callCount - 1);
  };

  // @ts-ignore
  const onSuccessFunc: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> =
      extInfo.onSuccess === false ? onSuccessDummy : (extInfo.onSuccess || onSuccessDefault);

  if (typeof onSuccessFunc !== 'function') {
    throw makeError(
      '7I8O2',
      'onsuccess_arg_err',
    );
  }

  // @ts-ignore
  const onFailureFunc: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> =
      extInfo.onFailure === false ? onFailureDummy : (extInfo.onFailure || onFailureDefault);

  if (typeof onFailureFunc !== 'function') {
    throw makeError(
      '8L7B9',
      'onfailure_arg_err',
    );
  }

  // @ts-ignore
  const onErrorFunc: CallApiResCallbackPlusLocType<ReqBodyType, RepBodyType> =
      extInfo.onError === false ? onErrorDummy : (extInfo.onError || onErrorDefault);

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
  // eslint-disable-next-line no-param-reassign
  extInfo.body.base.apiVer = EnvConfig.API_VER;

  // ----- 2C1P5 -----
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
    EnvConfig.API_CALL_REQ_TIMEOUT_MS,
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
      decrCallCount('3S9U2');

      callCountIsDecremented = true;
    }

    //
    return rep.json();
  }).then((
    repInfo: RepBodyType,
  ): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> => {
    //
    if (!getIsMounted()) {
      return Promise.resolve([null, extInfo]);
    }

    //
    let fullLoc;

    // @ts-ignore
    const repLoc = repInfo?.base?.loc ?? repInfo?.loc;

    if (!repLoc) {
      fullLoc = `${cliLoc}+8P5E3`;
    } else if (repLoc.startsWith('*')) {
      fullLoc = repLoc;
    } else if (repLoc.startsWith('/')) {
      fullLoc = `${cliLoc}${repLoc}`;
    } else {
      fullLoc = `${cliLoc}/${repLoc}`;
    }

    //
    const statusHandler = HTTP_STATUS_HANDLERS[repStatus as number];

    if (statusHandler !== undefined) {
      const stopped = statusHandler(fullLoc);

      if (stopped) {
        // eslint-disable-next-line no-param-reassign
        extInfo.isAborted = true;

        return Promise.resolve([null, extInfo]);
      }
    }

    //
    if (!repInfo) {
      throw makeError(
        '4H9Z3',
        '`rep_info_err',
      );
    }

    //
    if (!((typeof extInfo.msgTimeout === 'number') && Number.isInteger(extInfo.msgTimeout))) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgTimeout = EnvConfig.API_CALL_MSG_TIMEOUT_MS;
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
      extInfo.msgTitle = ApiResMsg.ERROR;

      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = getErrMsgShown<ReqBodyType, RepBodyType>(
        repInfo,
        extInfo,
      );

      //
      if (typeof extInfo.msgShown === 'string' && extInfo.msgShown) {
        if (!extInfo.msgShown.endsWith('.')) {
          // eslint-disable-next-line no-param-reassign
          extInfo.msgShown += '.';
        }
      }

      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = makeToastMsg(
        fullLoc,
        extInfo.msgShown,
        EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
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
      throw makeError(
        '9I3Q2',
        '`rep_info_base_err',
      );
    }

    //
    if (!repInfo.base.loc) {
      throw makeError(
        '6R9D5',
        'rep_info_no_loc_err',
      );
    }

    //
    if (!repInfo.base.code) {
      throw makeError(
        '7W9I5',
        'rep_info_no_code_err',
      );
    }

    //
    if (!repInfo.base.msg) {
      throw makeError(
        '8A1G4',
        'rep_info_no_msg_err',
      );
    }

    // eslint-disable-next-line no-param-reassign
    extInfo.msgShown = repInfo.base.msg;

    //
    if (typeof extInfo.msgShown === 'string' && extInfo.msgShown) {
      if (!extInfo.msgShown.endsWith('.')) {
        // eslint-disable-next-line no-param-reassign
        extInfo.msgShown += '.';
      }
    }

    //
    if (repStatus !== ApiResStatus.HTTP_200_BIZ_SUCC) {
      // eslint-disable-next-line no-param-reassign
      extInfo.msgTitle = ApiResMsg.FAILURE;

      // eslint-disable-next-line no-param-reassign
      extInfo.msgShown = makeToastMsg(
        fullLoc,
        extInfo.msgShown,
        EnvConfig.API_CALL_FAILURE_MSG_INCLUDES_LOC,
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
    extInfo.msgTitle = ApiResMsg.SUCCESS;

    // eslint-disable-next-line no-param-reassign
    extInfo.msgShown = makeToastMsg(
      fullLoc,
      extInfo.msgShown,
      EnvConfig.API_CALL_SUCCESS_MSG_INCLUDES_LOC,
    );

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
  }).catch((err): Promise<[RepBodyType | null, CallApiExtInfoType<ReqBodyType, RepBodyType>]> => {
    try {
      if (!getIsMounted()) {
        return Promise.resolve([null, extInfo]);
      }

      if (!callCountIsDecremented) {
        decrCallCount('9I7C4');

        callCountIsDecremented = true;
      }

      // If the response body format is not JSON.
      if (err instanceof SyntaxError) {
        // If has response.
        if (extInfo.rep) {
          const fullLoc = `${cliLoc}+1N2H5`;

          const errMsg = extInfo?.rep?.status === ApiResStatus.HTTP_200_BIZ_SUCC
            ? 'Response format error' : getErrMsgShown(
              null,
              extInfo,
            );

          const msgShown = makeToastMsg(
            fullLoc,
            errMsg,
            EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
          );

          const msgTitle = ApiResMsg.ERROR;

          Toast.error(msgShown, msgTitle);

          return Promise.resolve([null, extInfo]);
        }
      }
    }
    catch (err2) {
      const loc = '2F6Y1';

      const fullLoc = callbackLoc ? `${cliLoc}+${callbackLoc}+${loc}` : `*${cliLoc}+${loc}`;

      //
      handleError(
        fullLoc,
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
      removeAbortControllerWrapper(controllerWrapper);
    }
    catch (err: any) {
      //
      let loc = '4P1W3';

      if (callbackLoc) {
        loc = `${callbackLoc}+${loc}`;
      }

      if (cliLoc) {
        loc = `${cliLoc}+${loc}`;
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
  if (err.name === 'AbortError') {
    const fullLoc = `${loc}+5R9Y7`;

    const msgShown = makeToastMsg(
      fullLoc,
      'Network request timeout.',
      EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
    );

    const msgTitle = ApiResMsg.ERROR;

    Toast.error(msgShown, msgTitle);

    return undefined;
  }

  //
  let errLoc = err instanceof BaseError ? err.getLoc() : '';

  if (typeof errLoc === 'string') {
    if (errLoc && loc.startsWith(errLoc)) {
      errLoc = '';
    }
  }

  const fullLoc = loc + (errLoc ? `+${errLoc}` : '');

  //
  const errMsg = makeToastMsg(
    fullLoc,
    'Frontend error.',
    EnvConfig.API_CALL_ERROR_MSG_INCLUDES_LOC,
  );

  const errTitle = ApiResMsg.ERROR;

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
            handleError(
              `${loc}+6X8G1`,
              err,
            );
          },
        );
      }

      return callRes;
    }
    catch (err: any) {
      handleError(
        `${loc}+'7I3S9'`,
        err,
      );

      return undefined;
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
