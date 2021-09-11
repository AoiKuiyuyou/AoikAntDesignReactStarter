// +++++ 5C6R9 +++++


// -----
const MODE: 'dev' | 'test' | 'prod' = 'dev';


// -----
// @ts-ignore
const DEV_ON = MODE === 'dev';


// -----
// @ts-ignore
const TEST_ON = MODE === 'test';


// -----
// @ts-ignore
const PROD_ON = MODE === 'prod';


// -----
const MOCK_ON = process.env.MOCK && process.env.MOCK !== 'none';


// -----
const PROXY_ON = !MOCK_ON;


// -----
const OWNER_NAME = 'Aoik';


// -----
const OWNER_SITE_URI = 'https://github.com/AoiKuiyuyou/AoikAntDesignReactStarter';


// -----
const APP_LOC = '1T6F5';


// -----
const APP_TITLE = 'AoikAntDesignReactStarter';


// -----
const API_VER = '20210101000000';


// -----
const API_HOST = '127.0.0.1';


// -----
const API_PORT = 10001;


// -----
const API_PROTO = 'http';


// -----
const API_URI_ROOT = `${API_PROTO}://${API_HOST}:${API_PORT}/`;


// -----
const API_CALL_REQ_TIMEOUT_MS = DEV_ON ? 3000 : 10000;


// -----
const API_CALL_MSG_TIMEOUT_MS = 5000;


// -----
const API_CALL_SUCCESS_MSG_INCLUDES_LOC = false;


// -----
const API_CALL_FAILURE_MSG_INCLUDES_LOC = true;


// -----
const API_CALL_ERROR_MSG_INCLUDES_LOC = true;


// -----
const EnvConfig = {
  MODE,
  DEV_ON,
  TEST_ON,
  PROD_ON,
  MOCK_ON,
  PROXY_ON,
  OWNER_NAME,
  OWNER_SITE_URI,
  APP_LOC,
  APP_TITLE,
  API_VER,
  API_HOST,
  API_PORT,
  API_PROTO,
  API_URI_ROOT,
  API_CALL_REQ_TIMEOUT_MS,
  API_CALL_MSG_TIMEOUT_MS,
  API_CALL_SUCCESS_MSG_INCLUDES_LOC,
  API_CALL_FAILURE_MSG_INCLUDES_LOC,
  API_CALL_ERROR_MSG_INCLUDES_LOC,
};


// -----
export {
  EnvConfig,
};
