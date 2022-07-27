// +++++ 7D5R4 +++++


// -----
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlShape } from '@umijs/plugin-locale/node_modules/react-intl/lib/react-intl';
import { IConfig } from '@umijs/types';
import moment from 'moment';
import { MutableRefObject } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import WebpackChain from 'webpack-chain';

// Must use relative path. `@/` will cause import error.
import { CallApiSetCallCountType } from '../base/api';
import { CallApiGetCallCountType } from '../base/api';
import { ApiUserGetAuthInfoRepBiz } from '../pages/user/login/api';
import { EnvConfig } from './env_config';
import { UmiLayoutConfig } from './umi_layout_config';
import { UmiLayoutConfigType } from './umi_layout_config';
import { UmiProxyConfig } from './umi_proxy_config';
import { UmiRoutesConfig } from './umi_routes_config';


// -----
class AoikAntDesignReactStarterLoggingPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler: object) {
    // @ts-ignore
    compiler.hooks.afterEmit.tapAsync(
      'AoikAntDesignReactStarterLoggingPlugin',
      (_compilation: object, callback: Function) => {
        const nowTimeStr = moment().format('YYYY-MM-DD HH:mm:ss');

        let startLine = `# ----- [${nowTimeStr}]: process.env -----`;

        let endLine = `# ===== [${nowTimeStr}]: process.env =====`;

        const envConfigJson = JSON.stringify(EnvConfig, null, 2);

        const processEnvConfigJson = JSON.stringify(process.env, null, 2);

        let msg = `${startLine}\n${processEnvConfigJson}\n${endLine}\n\n`;

        // Using `Logger` will cause import error.
        process.stdout.write(msg);

        //
        startLine = `# ----- [${nowTimeStr}]: EnvConfig -----`;

        endLine = `# ===== [${nowTimeStr}]: EnvConfig =====`;

        msg = `${startLine}\n${envConfigJson}\n${endLine}\n\n`;

        // Using `Logger` will cause import error.
        process.stdout.write(msg);

        //
        return callback();
      },
    );
  }
}


// ----- 8H6M5 -----
const UmiConfig = {
  theme: {
    'primary-color': UmiLayoutConfig.primaryColor,
  },
  routes: UmiRoutesConfig,
  layout: UmiLayoutConfig,
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: false,
  },
  ignoreMomentLocale: true,
  proxy: !EnvConfig.PROXY_ON ? {} : UmiProxyConfig[EnvConfig.MODE],
  title: false,
  hash: true,
  history: {
    type: 'browser',
  },
  antd: {},
  dva: {
    hmr: true,
  },
  esbuild: {},
  targets: {
    ie: 11,
  },
  manifest: {
    basePath: '.',
  },
  exportStatic: {},
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  // ----- 9I8V5 -----
  chainWebpack(chain: WebpackChain) {
    chain.plugin('AoikAntDesignReactStarterLoggingPlugin').use(AoikAntDesignReactStarterLoggingPlugin);
  },
} as IConfig;


// -----
type MakeGetIsMountedType = (isMounted: MutableRefObject<boolean>) => () => boolean;

type MakeTextTransformType = (intl: IntlShape) => (id: string) => string;

type MakeGetSetCallCountType = () => [CallApiGetCallCountType, CallApiSetCallCountType];


// -----
interface InitialStateType {
  authInfo: ApiUserGetAuthInfoRepBiz | null;

  makeGetIsMounted: MakeGetIsMountedType,

  makeGetSetCallCount: MakeGetSetCallCountType,

  makeTT: MakeTextTransformType,

  settings: UmiLayoutConfigType;
}


// -----
interface InitialStateModelType {
  initialState: InitialStateType,

  setInitialState: Function,
}


// -----
export {
  InitialStateModelType,
  InitialStateType,
  MakeGetIsMountedType,
  UmiConfig,
  UmiLayoutConfig,
  UmiProxyConfig,
  UmiRoutesConfig,
};
