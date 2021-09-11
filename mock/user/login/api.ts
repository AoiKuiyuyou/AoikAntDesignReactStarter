// +++++ 2X9I6 +++++


// -----
import { Request } from 'express';
import { Response } from 'express';

// Must use relative path. `@/` will cause import error.
import { ApiResCode } from '../../../src/base/api';
import { ApiResDebugMsg } from '../../../src/base/api';
import { ApiResMsg } from '../../../src/base/api';
import { ApiResStatus } from '../../../src/base/api';
import { ApiPath } from '../../../src/config/api_config';


// -----
export default {
  // ----- 3Z8K4 -----
  [`POST ${ApiPath.API_USER_LOGIN}`]: async (req: Request, res: Response) => {
    const username = req?.body?.biz?.username;
    const password = req?.body?.biz?.password;
    if (password === 'a' && username === 'a') {
      res.send({
        base: {
          loc: '4H1D6',
          apiLoc: '5D7A1',
          code: ApiResCode.BIZ_SUCC,
          status: ApiResStatus.HTTP_200_BIZ_SUCC,
          msg: ApiResMsg.LOGIN_SUCC,
          debugMsg: ApiResDebugMsg.EMPTY,
        },
        biz: {},
      });
    }
    else {
      res.status(ApiResStatus.HTTP_299_BIZ_FAIL).send({
        base: {
          loc: '6F3M9',
          apiLoc: '5D7A1',
          code: ApiResCode.BIZ_FAIL,
          status: ApiResStatus.HTTP_299_BIZ_FAIL,
          msg: ApiResMsg.LOGIN_FAIL,
          debugMsg: ApiResDebugMsg.EMPTY,
        },
        biz: {},
      });
    }
  },

  // ----- 7J4Y6 -----
  [`POST ${ApiPath.API_USER_LOGOUT}`]: (_req: Request, res: Response) => {
    res.send({
      base: {
        loc: '9Z4T3',
        apiLoc: '8C7I9',
        status: ApiResStatus.HTTP_200_BIZ_SUCC,
        code: ApiResCode.BIZ_SUCC,
        msg: ApiResMsg.LOGOUT_SUCC,
        debugMsg: ApiResDebugMsg.EMPTY,
      },
      biz: {},
    });
  },

  // ----- 1Z8G9 -----
  [`POST ${ApiPath.API_USER_GET_AUTH_INFO}`]: (_req: Request, res: Response) => {
    res.send({
      base: {
        loc: '2C4X1',
        apiLoc: '3O1E7',
        status: ApiResStatus.HTTP_200_BIZ_SUCC,
        code: ApiResCode.BIZ_SUCC,
        msg: ApiResMsg.SUCCESS,
        debugMsg: ApiResDebugMsg.EMPTY,
      },
      biz: {
        username: 'DemoUser',
      },
    });
  },
};
