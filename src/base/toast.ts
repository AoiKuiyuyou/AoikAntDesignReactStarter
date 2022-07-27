// +++++ 2X9I4 +++++
// `toastr.min.css` is imported at 3I7W4.


// -----
// @ts-ignore
import toastr from 'toastr';

//
import { EnvConfig as CONFIG } from '../config/env_config';


// -----
export function getCliLocFull(loc: string) {
  return `*${CONFIG.APP_LOC}-#${loc}`;
}


// -----
toastr.options = {
  debug: false,
  positionClass: 'toast-bottom-right',
  timeOut: CONFIG.API_CALL_MSG_TIMEOUT_MS,
  extendedTimeOut: CONFIG.API_CALL_MSG_TIMEOUT_MS,
};


//
function transformToastMsg(
  msg: string,
) {
  //
  msg = msg.trim();

  //
  let extMsg = '';

  //
  const brIdx = msg.indexOf('<br/>');

  //
  if (brIdx > 0) {
    extMsg = msg.substring(brIdx);

    msg = msg.substring(0, brIdx);
  }

  //
  if (!msg.startsWith('<br/>')) {
    msg = `<br/>${msg}`;
  }

  //
  if (!msg.endsWith('.')) {
    msg = `${msg}.`;
  }

  //
  let msgShown: string;

  if (!extMsg) {
    msgShown = msg;
  }
  else {
    msgShown = `
<div
style="float: right; margin-top: -40px; font-size: 26px;"
onclick="(function () {
window.event.stopPropagation();
var divElem = document.createElement('span');
divElem.innerHTML = '${extMsg.replace(/[']/g, '\\\'').replace(/["]/g, '\\"')}';
window.event.target.parentElement.appendChild(divElem);
window.event.target.remove();
})()"
>...</div><span>${msg}</span>
`;

    msgShown = msgShown.replace(/\n/g, ' ').trim();
  }

  //
  return msgShown;
}


// -----
export const Toast = {
  error: (
    msg: string,
    title: string,
    options?: object,
  ) => {
    //
    const msgShown = transformToastMsg(msg);

    //
    toastr.error(msgShown, title, options);
  },
  warning: (
    msg: string,
    title: string,
    options?: object,
  ) => {
    //
    const msgShown = transformToastMsg(msg);

    //
    toastr.warning(msgShown, title, options);
  },
  info: (
    msg: string,
    title: string,
    options?: object,
  ) => {
    //
    const msgShown = transformToastMsg(msg);

    //
    toastr.info(msgShown, title, options);
  },
  success: (
    msg: string,
    title: string,
    options?: object,
  ) => {
    //
    const msgShown = transformToastMsg(msg);

    //
    toastr.success(msgShown, title, options);
  },
};


// -----
export function toastSuccess(
  loc: string,
  msg: string,
  title: string,
  options?: object,
) {
  const msgWithPeriod = msg.endsWith('.') ? msg : `${msg}.`;

  const locLabel = 'Location:';

  const locShown = getCliLocFull(loc);

  const msgShown = `${msgWithPeriod}<br/><br/>${locLabel}：<br/>${locShown}`;

  return Toast.success(msgShown, title, options);
}


// -----
export function toastInfo(
  loc: string,
  msg: string,
  title: string,
  options?: object,
) {
  const msgWithPeriod = msg.endsWith('.') ? msg : `${msg}.`;

  const locLabel = 'Location:';

  const locShown = getCliLocFull(loc);

  const msgShown = `${msgWithPeriod}<br/><br/>${locLabel}：<br/>${locShown}`;

  return Toast.info(msgShown, title, options);
}


// -----
export function toastError(
  loc: string,
  msg: string,
  title: string,
  options?: object,
) {
  const msgWithPeriod = msg.endsWith('.') ? msg : `${msg}.`;

  const locLabel = 'Location:';

  const locShown = getCliLocFull(loc);

  const msgShown = `${msgWithPeriod}<br/><br/>${locLabel}：<br/>${locShown}`;

  return Toast.error(msgShown, title, options);
}
