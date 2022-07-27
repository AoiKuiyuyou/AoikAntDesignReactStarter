// +++++ 8I9W5 +++++


// -----
import { history } from 'umi';


// -----
export function gotoPath(
  params: {
    loc: string,
    path: string,
    timeoutMs?: number,
    reloadPage?: boolean,
    // React.MouseEvent
    mouseEvent?: any,
  },
) {
  //
  if (params?.mouseEvent?.ctrlKey) {
    //
    window.open(params.path);

    //
    return;
  }

  //
  if (params.reloadPage) {
    window.location.assign(params.path);

    return;
  }

  //
  if (params.path.startsWith('http://')
    || params.path.startsWith('https://')) {
    window.location.assign(params.path);

    return;
  }

  // Change history path after current caller is finished
  // in order to avoid `state update on an unmounted component` error.
  setTimeout(() => {
    // ----- 1R8Q4 -----
    console.debug(`${params.loc}+(1R8Q4): goto_path: ${params.path}`);

    //
    history.push(params.path);
  }, params.timeoutMs || 0);
}
