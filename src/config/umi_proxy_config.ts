// ------ 3M1Q2 ------

// -----
// Must use relative path. `@/` will cause import error.
import { EnvConfig } from './env_config';


// -----
const PROXY_CONFIG = {
  '/api/': {
    target: EnvConfig.API_URI_ROOT,
    changeOrigin: true,
    pathRewrite: { '^': '' },
  },
};


// -----
const UmiProxyConfig = {
  dev: PROXY_CONFIG,
  test: PROXY_CONFIG,
};


// -----
export {
  UmiProxyConfig,
};
