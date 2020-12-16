// ------ 7N9V5 ------

// -----
import { LockTwoTone } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import ProForm from '@ant-design/pro-form';
import { ProFormText } from '@ant-design/pro-form';
import { Tabs } from 'antd';
import useIsMounted from 'ismounted';
import React from 'react';
import { useState } from 'react';
import { SelectLang } from 'umi';
import { useIntl } from 'umi';
import { useModel } from 'umi';

import { makeApiResCallback } from '@/base/api';
import { callApi } from '@/base/api';
import { CallApiSetCallCountType } from '@/base/api';
import { CallApiGetCallCountType } from '@/base/api';
import { CallApiGetIsMountedType } from '@/base/api';
import { makeSafeFunc } from '@/base/api';
import { ApiReqInfoType } from '@/base/api';
import { ApiResInfoType } from '@/base/api';
import { gotoPath } from '@/base/cli';
import { Toast } from '@/base/toast';
import { ApiPath } from '@/config/api_config';
import { CliPath } from '@/config/cli_config';
import { EnvConfig } from '@/config/env_config';
import { InitialStateModelType } from '@/config/umi_config';
import { PageFooterComp } from '@/pages/base/PageFooterComp';

import styles from './UserLoginComp.less';


// -----
const UserLoginComp: React.FC = () => {
  //
  enum AuthType {LOGIN_NAME = 'LOGIN_NAME'}

  //
  const { initialState } = useModel('@@initialState') as InitialStateModelType;

  //
  const {
    makeGetIsMounted,
    makeGetSetCallCount,
    makeGetText,
  } = initialState;

  //
  const getIsMounted = makeGetIsMounted(useIsMounted());

  //
  const [getCallCount, setCallCount] = makeGetSetCallCount();

  //
  const getText = makeGetText(useIntl());

  //
  const [authType, setAuthType] = useState<AuthType>(AuthType.LOGIN_NAME);

  //
  const loginTabOnChange = (authTypeNew: string) => {
    setAuthType(AuthType[authTypeNew as keyof typeof AuthType]);
  };

  //
  const [submittingFlag, setSubmittingFlag] = useState(false);

  //
  const loginButtonOnClick = makeSafeFunc(
    '8A1W4',
    async (formParams: LoginFormParamsType) => {
      await callApi<ApiUserLoginReqInfoType, ApiUserLoginResInfoType>({
        uri: ApiPath.API_USER_LOGIN,
        body: {
          cliLoc: '9P1O6',
          apiLoc: '5D7A1',
          username: formParams.username,
          password: formParams.password,
        },
        getIsMounted,
        getCallCount,
        setCallCount,
        onStart: makeSafeFunc(
          '6P5T1',
          () => {
            setSubmittingFlag(true);
          },
        ),
        onEnd: makeSafeFunc(
          '7J9F3',
          () => {
            setSubmittingFlag(false);
          },
        ),
        onSuccess: makeApiResCallback(
          '1S5Q2',
          async (
            resInfo,
            extInfo,
          ) => {
            //
            Toast.success(extInfo.msgShown, extInfo.msgTitle);

            //
            initialState.currUser = await callApiUserLogin(
              getIsMounted,
              getCallCount,
              setCallCount,
            );

            //
            if (initialState.currUser !== null) {
              gotoPath(CliPath.USER_WELCOME);
            }

            //
            return resInfo;
          },
        ),
      });
    },
  );

  // -----
  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={styles.title}>
              {getText('6C2Z8')}
            </span>
          </div>
          <div className={styles.desc}>
            {getText('5X1L7')}
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: false,
            }}
            submitter={{
              searchConfig: {
                submitText: getText('3U7W8'),
              },
              render: (_, dom) => {return dom.pop();},
              submitButtonProps: {
                loading: submittingFlag,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (formParams) => {loginButtonOnClick(formParams);}}
          >
            <Tabs
              className={styles.ant_tabs_top}
              activeKey={authType}
              onChange={loginTabOnChange}
            >
              <Tabs.TabPane
                key={AuthType.LOGIN_NAME}
                tab={getText('7D6A9')}
              />
            </Tabs>

            {authType === AuthType.LOGIN_NAME && (
              <>
                <ProFormText
                  name="username"
                  initialValue={EnvConfig.DEV_ON ? 'a' : ''}
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={getText('8D1T5')}
                  rules={[
                    {
                      required: true,
                      message: getText('9U7F6'),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  initialValue={EnvConfig.DEV_ON ? 'a' : ''}
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={getText('1N3X6')}
                  rules={[
                    {
                      required: true,
                      message: getText('2I8M5'),
                    },
                  ]}
                />
              </>
            )}
          </ProForm>
        </div>
      </div>
      <PageFooterComp />
    </div>
  );
};


// -----
interface LoginFormParamsType {
  username: string;

  password: string;
}


// -----
interface ApiUserLoginReqInfoType extends ApiReqInfoType {
  username: string,

  password: string,
}


// -----
interface ApiUserLoginResInfoType extends ApiResInfoType {
}


// -----
interface ApiUserLogoutReqInfoType extends ApiReqInfoType {
}


// -----
interface ApiUserLogoutResInfoType extends ApiResInfoType {
}


// -----
interface ApiUserGetLoginUserReqInfoType extends ApiReqInfoType {
}


// -----
interface ApiUserGetLoginUserResInfoType extends ApiResInfoType {
  name: string;
}


// -----
function callApiUserLogin(
  getIsMounted: CallApiGetIsMountedType,
  getCallCount: CallApiGetCallCountType,
  setCallCount: CallApiSetCallCountType,
): Promise<ApiUserGetLoginUserResInfoType | null> {
  //
  return callApi<ApiUserGetLoginUserReqInfoType, ApiUserGetLoginUserResInfoType>({
    uri: ApiPath.API_USER_GET_LOGIN_Info,
    body: {
      cliLoc: '2X9N8',
      apiLoc: '3O1E7',
    },
    getIsMounted,
    getCallCount,
    setCallCount,
    onSuccess: makeApiResCallback(
      '4S9G6',
      async (resInfo) => {
        return resInfo;
      },
    ),
    onFailure: makeApiResCallback<ApiUserGetLoginUserReqInfoType, ApiUserGetLoginUserResInfoType>(
      '5U1P8',
      async () => {
        return null;
      },
    ),
    onError: makeApiResCallback<ApiUserGetLoginUserReqInfoType, ApiUserGetLoginUserResInfoType>(
      '6J7W4',
      async () => {
        return null;
      },
    ),
  });
}


// -----
export {
  ApiUserGetLoginUserResInfoType,
  ApiUserLoginReqInfoType,
  ApiUserLoginResInfoType,
  ApiUserLogoutReqInfoType,
  ApiUserLogoutResInfoType,
  callApiUserLogin,
  UserLoginComp as default,
};
