// ------ 4O3B2 ------

// -----
// Must use relative path. `@/` will cause import error.
import { CliPath } from './cli_config';


// ----- 5X1N3 -----
const UmiRoutesConfig = [
  {
    path: CliPath.USER_LOGIN,
    exact: true,
    component: './user/login/UserLoginComp',
    layout: false,
    hideInMenu: true,
  },
  {
    name: '1L5J7',
    path: CliPath.USER_WELCOME,
    exact: true,
    component: './user/welcome/UserWelcomeComp',
    icon: 'smile',
  },
  {
    path: CliPath.ROOT,
    redirect: CliPath.USER_WELCOME,
    exact: true,
  },
  {
    component: './base/PageNotFoundComp',
  },
];


// -----
export {
  UmiRoutesConfig,
};
