// +++++ 8I9W5 +++++


// -----
import { history } from 'umi';

// Must use relative path. `@/` will cause import error.
import { CliPath } from '../config/cli_config';


// -----
function gotoPath(path: CliPath, timeoutMs = 0) {
  // Change history path after current caller is finished
  // in order to avoid `state update on an unmounted component` error.
  setTimeout(() => {
    history.push(path);
  }, timeoutMs);
}


// -----
export {
  gotoPath,
};
