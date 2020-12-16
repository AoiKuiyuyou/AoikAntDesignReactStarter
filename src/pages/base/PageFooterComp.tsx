// ------ 5T8O3 ------

// -----
import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';

import { EnvConfig } from '@/config/env_config';


// ------ 6H8S1 ------
const PageFooterComp: React.FC = () => {
  return (
    <DefaultFooter
      copyright={EnvConfig.OWNER_NAME}
      links={[
        {
          key: EnvConfig.APP_TITLE,
          title: EnvConfig.APP_TITLE,
          href: EnvConfig.OWNER_SITE_URI,
          blankTarget: true,
        },
      ]}
    />
  );
};


// -----
export {
  PageFooterComp,
};
