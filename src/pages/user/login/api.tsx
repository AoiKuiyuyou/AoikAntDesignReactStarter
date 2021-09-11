// +++++ 5R3M2 +++++


// -----
import { ApiRepBody } from '@/base/api';
import { ApiReqBody } from '@/base/api';


// -----
export interface ApiUserLoginReqBiz {
  username: string,

  password: string,
}


// -----
export interface ApiUserLoginReqBody extends ApiReqBody {
  biz: ApiUserLoginReqBiz,
}


// -----
export interface ApiUserLoginRepBiz {
}


// -----
export interface ApiUserLoginRepBody extends ApiRepBody {
  biz: ApiUserLoginRepBiz,
}


// -----
export interface ApiUserLogoutReqBiz {
}


// -----
export interface ApiUserLogoutReqBody extends ApiReqBody {
  biz: ApiUserLogoutReqBiz,
}


// -----
export interface ApiUserLogoutRepBiz {
}


// -----
export interface ApiUserLogoutRepBody extends ApiRepBody {
  biz: ApiUserLogoutRepBiz,
}


// -----
export interface ApiUserGetAuthInfoReqBiz {
}


// -----
export interface ApiUserGetAuthInfoReqBody extends ApiReqBody {
  biz: ApiUserGetAuthInfoReqBiz,
}


// -----
export interface ApiUserGetAuthInfoRepBiz {
  username: string,
}


// -----
export interface ApiUserGetAuthInfoRepBody extends ApiRepBody {
  biz: ApiUserGetAuthInfoRepBiz,
}
