// ------ 2X9I6 ------

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
    const { password, username } = req.body;
    if (password === 'a' && username === 'a') {
      res.send({
        loc: '4H1D6',
        apiLoc: '5D7A1',
        code: ApiResCode.BIZ_SUCC,
        status: ApiResStatus.HTTP_200_BIZ_SUCC,
        msg: ApiResMsg.LOGIN_SUCC,
        debugMsg: ApiResDebugMsg.EMPTY,
      });
    }
    else {
      res.status(ApiResStatus.HTTP_299_BIZ_FAIL).send({
        loc: '6F3M9',
        apiLoc: '5D7A1',
        code: ApiResCode.BIZ_FAIL,
        status: ApiResStatus.HTTP_299_BIZ_FAIL,
        msg: ApiResMsg.LOGIN_FAIL,
        debugMsg: ApiResDebugMsg.EMPTY,
      });
    }
  },

  // ----- 7J4Y6 -----
  [`POST ${ApiPath.API_USER_LOGOUT}`]: (_req: Request, res: Response) => {
    res.send({
      apiLoc: '8C7I9',
      loc: '9Z4T3',
      status: ApiResStatus.HTTP_200_BIZ_SUCC,
      code: ApiResCode.BIZ_SUCC,
      msg: ApiResMsg.LOGOUT_SUCC,
      debugMsg: ApiResDebugMsg.EMPTY,
    });
  },

  // ----- 1Z8G9 -----
  [`POST ${ApiPath.API_USER_GET_LOGIN_Info}`]: (_req: Request, res: Response) => {
    res.send({
      loc: '2C4X1',
      apiLoc: '3O1E7',
      status: ApiResStatus.HTTP_200_BIZ_SUCC,
      code: ApiResCode.BIZ_SUCC,
      msg: ApiResMsg.BIZ_SUCC,
      debugMsg: ApiResDebugMsg.EMPTY,
      name: 'DemoUser',
    });
  },
};
