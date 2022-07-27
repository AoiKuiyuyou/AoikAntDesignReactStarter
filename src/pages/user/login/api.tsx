// +++++ 5R3M2 +++++


// -----
import { ApiRepParams } from '@/base/api';
import { ApiReqParams } from '@/base/api';


// -----
export interface ApiUserLoginReqBiz {
  username: string,

  password: string,
}


// -----
export interface ApiUserLoginReqParams extends ApiReqParams {
  biz: ApiUserLoginReqBiz,
}


// -----
export interface ApiUserLoginRepBiz {
}


// -----
export interface ApiUserLoginRepParams extends ApiRepParams {
  biz: ApiUserLoginRepBiz,
}


// -----
export interface ApiUserLogoutReqBiz {
}


// -----
export interface ApiUserLogoutReqParams extends ApiReqParams {
  biz: ApiUserLogoutReqBiz,
}


// -----
export interface ApiUserLogoutRepBiz {
}


// -----
export interface ApiUserLogoutRepParams extends ApiRepParams {
  biz: ApiUserLogoutRepBiz,
}


// -----
export interface ApiUserGetAuthInfoReqBiz {
}


// -----
export interface ApiUserGetAuthInfoReqParams extends ApiReqParams {
  biz: ApiUserGetAuthInfoReqBiz,
}


// -----
export interface ApiUserGetAuthInfoRepBiz {
  username: string,
}


// -----
export interface ApiUserGetAuthInfoRepParams extends ApiRepParams {
  biz: ApiUserGetAuthInfoRepBiz,
}
