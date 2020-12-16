// ------ 2X9I4 ------
// `toastr.min.css` is imported at 3I7W4.

// -----
// @ts-ignore
import toastr from 'toastr';

import { EnvConfig } from '../config/env_config';


// -----
const Toast = toastr;


// -----
Toast.options = {
  debug: false,
  positionClass: 'toast-bottom-right',
  timeOut: EnvConfig.API_CALL_MSG_TIMEOUT_MS,
  extendedTimeOut: EnvConfig.API_CALL_MSG_TIMEOUT_MS,
};


// -----
export {
  Toast,
};
