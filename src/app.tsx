// +++++ 3V1Y2 +++++
// This file is required by Umi.


// -----
import { PageLoading } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlShape } from '@umijs/plugin-locale/node_modules/react-intl/lib/react-intl';
import React from 'react';
import { MutableRefObject } from 'react';
import { history } from 'umi';

import { callApi } from '@/base/api';
import { makeGetSetCallCount } from '@/base/api';
import { ApiPath } from '@/config/api_config';
import { CliPath } from '@/config/cli_config';
import { InitialStateType } from '@/config/umi_config';
import { MakeGetIsMountedType } from '@/config/umi_config';
import { UmiLayoutConfig } from '@/config/umi_layout_config';
import { PageFooterComp } from '@/pages/base/PageFooterComp';
import { PageHeaderComp } from '@/pages/base/PageHeaderComp';
import { ApiUserGetAuthInfoRepParams } from '@/pages/user/login/api';
import { ApiUserGetAuthInfoReqParams } from '@/pages/user/login/api';


// ----- 4U7G9 -----
async function getInitialState(): Promise<InitialStateType>
{
  //
  const makeGetIsMounted: MakeGetIsMountedType = (isMountedRef: MutableRefObject<boolean>) => {
    const getIsMounted = () => {
      return isMountedRef.current;
    };

    return getIsMounted;
  };

  //
  const [getCallCount, setCallCount] = makeGetSetCallCount();

  //
  const getGetText = (intl: IntlShape) => {
    const { formatMessage } = intl;

    if (!formatMessage) {
      throw new Error('7G3H5: no_intl_err');
    }

    const getText = (id: string) => {
      return formatMessage({ id });
    };

    return getText;
  };

  //
  if (history.location.pathname === CliPath.USER_LOGIN) {
    return {
      authInfo: null,
      makeGetSetCallCount,
      makeGetIsMounted,
      makeGetText: getGetText,
      settings: UmiLayoutConfig,
    };
  }

  //
  const [repParams, repExt] = await callApi<
    ApiUserGetAuthInfoReqParams,
    ApiUserGetAuthInfoRepParams>({
      uri: ApiPath.API_USER_GET_AUTH_INFO,
      body: {
        base: {
          cliLoc: '2X9N8',
          apiLoc: '3O1E7',
        },
        biz: {},
      },
      getIsMounted: () => {
        return true;
      },
      getCallCount,
      setCallCount,
      onSuccess: false,
      onFailure: false,
      onError: false,
    });

  //
  const authInfo = (repExt.isSuccess ? repParams?.biz : null) ?? null;

  //
  return {
    authInfo,
    makeGetIsMounted,
    makeGetSetCallCount,
    makeGetText: getGetText,
    settings: UmiLayoutConfig,
  };
}


// -----
type LayoutFuncParamsType = {
  initialState: InitialStateType;
}


// -----
type LayoutFuncResType = {
  rightContentRender: () => JSX.Element;
  menuHeaderRender: undefined
  footerRender: () => JSX.Element;
  disableContentMargin: boolean;
  onPageChange: () => void;
}


// -----
const initialStateConfig = {
  loading: <PageLoading />,
};


// ----- 5S8D7 -----
const layout = (params: LayoutFuncParamsType): LayoutFuncResType => {
  return {
    rightContentRender: () => {return <PageHeaderComp />;},
    menuHeaderRender: undefined,
    footerRender: () => {return <PageFooterComp />;},
    disableContentMargin: false,
    onPageChange: () => {
      //
      const authInfo = params.initialState.authInfo;

      //
      const location = history.location;

      //
      if (!authInfo && location.pathname !== CliPath.USER_LOGIN) {
        history.push(CliPath.USER_LOGIN);
      }
    },
  };
};


// -----
export {
  getInitialState,
  initialStateConfig,
  layout,
};
