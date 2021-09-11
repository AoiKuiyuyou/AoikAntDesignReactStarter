// +++++ 7N9V5 +++++


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

import { callApi } from '@/base/api';
import { makeSafeFunc } from '@/base/api';
import { gotoPath } from '@/base/cli';
import { Toast } from '@/base/toast';
import { ApiPath } from '@/config/api_config';
import { CliPath } from '@/config/cli_config';
import { EnvConfig } from '@/config/env_config';
import { InitialStateModelType } from '@/config/umi_config';
import { PageFooterComp } from '@/pages/base/PageFooterComp';
import { ApiUserGetAuthInfoRepBody, ApiUserLoginReqBiz } from '@/pages/user/login/api';
import { ApiUserGetAuthInfoReqBody } from '@/pages/user/login/api';
import { ApiUserLoginRepBody } from '@/pages/user/login/api';
import { ApiUserLoginReqBody } from '@/pages/user/login/api';

import styles from './UserLoginComp.less';


// -----
interface UserLoginFormParams {
  username: string;

  password: string;
}


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
  function apiUserLoginParamsValidate(
    params: UserLoginFormParams,
  ): ApiUserLoginReqBiz | null {
    //
    const { username } = params;

    //
    if (typeof username !== 'string' || !username) {
      Toast.error(getText('9U7F6'), 'Form Error');

      return null;
    }

    //
    const { password } = params;

    //
    if (typeof password !== 'string' || !password) {
      Toast.error(getText('2I8M5'), 'Form Error');

      return null;
    }

    //
    return {
      username,
      password,
    };
  }

  //
  const apiUserLoginOnSubmit = makeSafeFunc(
    '8A1W4',
    async (formParams: UserLoginFormParams) => {
      //
      const reqBiz = apiUserLoginParamsValidate(formParams);

      //
      if (!reqBiz) {
        return;
      }

      // ----- 9P1O6 -----
      const [, repExt] = await callApi<
        ApiUserLoginReqBody,
        ApiUserLoginRepBody>({
          uri: ApiPath.API_USER_LOGIN,
          body: {
            base: {
              cliLoc: '9P1O6',
              apiLoc: '5D7A1',
            },
            biz: reqBiz,
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
        });

      //
      if (!repExt.isSuccess) {
        return;
      }

      // ----- 9P1O6 -----
      const [repBody2, repExt2] = await callApi<
          ApiUserGetAuthInfoReqBody,
          ApiUserGetAuthInfoRepBody>({
            uri: ApiPath.API_USER_GET_AUTH_INFO,
            body: {
              base: {
                cliLoc: '9P1O6',
                apiLoc: '5D7A1',
              },
              biz: {},
            },
            getIsMounted,
            getCallCount,
            setCallCount,
            onSuccess: false,
          });

      //
      if (!repExt2.isSuccess) {
        return;
      }

      //
      if (repBody2?.biz) {
        //
        initialState.authInfo = repBody2.biz;

        //
        gotoPath(CliPath.USER_WELCOME);
      }
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
            onFinish={apiUserLoginOnSubmit}
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
export {
  UserLoginComp as default,
};
