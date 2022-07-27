// +++++ 2X9I6 +++++


// -----
import { Request } from 'express';
import { Response } from 'express';

// Must use relative path. `@/` will cause import error.
import { ApiResCode } from '../../../src/base/api';
import { ApiResMsg } from '../../../src/base/api';
import { ApiResStatus } from '../../../src/base/api';
import { ApiPath } from '../../../src/config/api_config';


// -----
const COOKIE_KEY_V_SESSION_ID = 'session_id';


// -----
export default {
  // ----- 5D7A1 -----
  [`POST ${ApiPath.API_USER_LOGIN}`]: async (req: Request, res: Response) => {
    const username = req?.body?.biz?.username;
    const password = req?.body?.biz?.password;
    if (password === 'a' && username === 'a') {
      //
      res.cookie(COOKIE_KEY_V_SESSION_ID, '1', { maxAge: 3600000, httpOnly: true });

      // ----- 3Z8K4 -----
      res.send({
        base: {
          loc: '@5D7A1-#3Z8K4',
          apiLoc: '5D7A1',
          code: ApiResCode.BIZ_SUCC,
          status: ApiResStatus.HTTP_200_BIZ_SUCC,
          msg: ApiResMsg.LOGIN_SUCC,
        },
        biz: {},
      });
    }
    else {
      // ----- 6F3M9 -----
      res.status(ApiResStatus.HTTP_299_BIZ_FAIL).send({
        base: {
          loc: '@5D7A1-#6F3M9',
          apiLoc: '5D7A1',
          code: ApiResCode.BIZ_FAIL,
          status: ApiResStatus.HTTP_299_BIZ_FAIL,
          msg: ApiResMsg.LOGIN_FAIL,
        },
        biz: {},
      });
    }
  },

  // ----- 8C7I9 -----
  [`POST ${ApiPath.API_USER_LOGOUT}`]: (_req: Request, res: Response) => {
    //
    res.clearCookie(COOKIE_KEY_V_SESSION_ID)

    // ----- 9Z4T3 -----
    res.send({
      base: {
        loc: '@8C7I9-#9Z4T3',
        apiLoc: '8C7I9',
        status: ApiResStatus.HTTP_200_BIZ_SUCC,
        code: ApiResCode.BIZ_SUCC,
        msg: ApiResMsg.LOGOUT_SUCC,
      },
      biz: {},
    });
  },

  // ----- 5D7A1 -----
  [`POST ${ApiPath.API_USER_GET_AUTH_INFO}`]: (req: Request, res: Response) => {
    //
    if (!req.headers.cookie?.includes(COOKIE_KEY_V_SESSION_ID)) {
      // ----- 8R3W1 -----
      res.status(ApiResStatus.HTTP_299_BIZ_FAIL).send({
        base: {
          loc: '@5D7A1-#8R3W1',
          apiLoc: '5D7A1',
          code: ApiResCode.BIZ_FAIL,
          status: ApiResStatus.HTTP_299_BIZ_FAIL,
          msg: ApiResMsg.BIZ_FAIL,
        },
        biz: {},
      });
    }
    else {
      // ----- 2C4X1 -----
      res.send({
        base: {
          loc: '@5D7A1-#2C4X1',
          apiLoc: '5D7A1',
          status: ApiResStatus.HTTP_200_BIZ_SUCC,
          code: ApiResCode.BIZ_SUCC,
          msg: ApiResMsg.BIZ_SUCC,
        },
        biz: {
          username: 'DemoUser',
        },
      });
    }
  },
};
