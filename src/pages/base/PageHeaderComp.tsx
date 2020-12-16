// ------ 8Y5G6 ------

// -----
import { Space } from 'antd';
import { Avatar } from 'antd';
import { Dropdown } from 'antd';
import { Menu } from 'antd';
import { Spin } from 'antd';
import { DropDownProps } from 'antd/es/dropdown';
import classNames from 'classnames';
import useIsMounted from 'ismounted';
import React from 'react';
import { useCallback } from 'react';
import { useIntl } from 'umi';
import { useModel } from 'umi';
import { history } from 'umi';

import { makeSafeFunc } from '@/base/api';
import { callApi } from '@/base/api';
import { gotoPath } from '@/base/cli';
import { ApiPath } from '@/config/api_config';
import { CliPath } from '@/config/cli_config';
import { InitialStateModelType } from '@/config/umi_config';
import { ApiUserLogoutReqInfoType } from '@/pages/user/login/UserLoginComp';
import { ApiUserLogoutResInfoType } from '@/pages/user/login/UserLoginComp';

import styles from './PageHeaderComp.less';


// -----
const LoadingComp: React.FC = () => {
  // -----
  return (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};


// -----
interface DropdownCompProps extends Omit<DropDownProps, 'overlay'> {
  overlayClassName?: string;

  overlay: React.ReactNode | (() => React.ReactNode) | any;

  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}


// -----
const DropdownComp: React.FC<DropdownCompProps> = ({
  overlayClassName,
  ...otherProps
}) => {
  return (
    <Dropdown
      overlayClassName={classNames(styles.container, overlayClassName)}
      {...otherProps}
    />
  );
};


// ------ 1Z3A5 ------
const PageHeaderComp: React.FC = () => {
  //
  enum MenuKey {
    LOGOUT = 'LOGOUT',
  }

  //
  const { initialState, setInitialState } = useModel('@@initialState') as InitialStateModelType;

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
  const menuOnClick = makeSafeFunc(
    '2A4R6',
    useCallback(
      async (
        event: {
          key: React.Key;
          keyPath: React.Key[];
          item: React.ReactInstance;
          domEvent: React.MouseEvent<HTMLElement>;
        },
      ) => {
        //
        const { key } = event;

        //
        if (key === MenuKey.LOGOUT) {
          //
          setInitialState({
            ...initialState,
            currUser: null,
          });

          //
          await callApi<ApiUserLogoutReqInfoType, ApiUserLogoutResInfoType>({
            uri: ApiPath.API_USER_LOGOUT,
            body: {
              cliLoc: '3I5M8',
              apiLoc: '8C7I9',
            },
            getIsMounted,
            getCallCount,
            setCallCount,
          });

          //
          if (history.location.pathname !== CliPath.USER_LOGIN) {
            gotoPath(CliPath.USER_LOGIN);
          }

          //
          return;
        }
      },
      [],
    ),
  );

  //
  if (!initialState || !initialState.currUser) {
    return LoadingComp({});
  }

  //
  const { currUser } = initialState;

  //
  const menuComp = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={menuOnClick}>
      <Menu.Item key={MenuKey.LOGOUT}>
        {getText('2Y5A7')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Space className={styles.right}>
      <DropdownComp overlay={menuComp}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} alt="avatar" />
          <span className="anticon">{currUser.name}</span>
        </span>
      </DropdownComp>
    </Space>
  );
};


// -----
export {
  PageHeaderComp,
};
