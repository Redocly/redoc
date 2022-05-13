import * as React from 'react';
// eslint-disable-next-line import/no-internal-modules
import { hot } from 'react-hot-loader/root';
import { RedocStandalone as RedocStandaloneOrig, RedocStandaloneProps } from '../../src';

const RedocStandalone = function (props: RedocStandaloneProps) {
  return <RedocStandaloneOrig {...props} />;
}

export default hot(RedocStandalone);
