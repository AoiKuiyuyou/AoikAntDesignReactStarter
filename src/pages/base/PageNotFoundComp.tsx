// +++++ 5F2V4 +++++


// -----
import { Button } from 'antd';
import { Result } from 'antd';
import React from 'react';
import { history } from 'umi';
import { useIntl } from 'umi';

import { CliPath } from '@/config/cli_config';
import { InitialStateModelType } from '@/config/umi_config';
import { useModel } from '@@/plugin-model/useModel';


// -----
const PageNotFoundComp: React.FC = () => {
  //
  const { initialState } = useModel('@@initialState') as InitialStateModelType;

  //
  const { makeGetText } = initialState;

  //
  const TT = makeGetText(useIntl());

  return (
    <Result
      title={TT('3S1F7')}
      extra={
        <Button type="primary" onClick={() => {return history.push(CliPath.ROOT);}}>
          {TT('4N2S8')}
        </Button>
      }
    />
  );
};


// -----
export default PageNotFoundComp;
