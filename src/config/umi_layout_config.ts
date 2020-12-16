// ------ 1R2T4 ------

// -----
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

// Must use relative path. `@/` will cause import error.
import { EnvConfig } from './env_config';


// -----
interface UmiLayoutConfigType extends LayoutSettings {
  name?: string;

  locale?: boolean;

  siderWidth?: number;
}


// ----- 2X4C7 -----
const UmiLayoutConfig: UmiLayoutConfigType = {
  // ----- Layout Settings -----
  navTheme: 'light',
  // Blue
  primaryColor: '#0000FF',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: EnvConfig.APP_TITLE,
  iconfontUrl: '',

  // ----- Other Settings -----
  name: EnvConfig.APP_TITLE,
  locale: true,
  siderWidth: 200,
};


// -----
export {
  UmiLayoutConfig,
  UmiLayoutConfigType,
};
