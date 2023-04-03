import * as React from 'react';
import { render } from 'react-dom';
import { VersionSelector } from './components/VersionSelector';

render(
  <div>
    <h1>Hi there</h1>
    <VersionSelector
      resourceVersions={['v1.0', 'v2.0', 'v3.0']}
      active={{ resourceVersion: 'v1.0', apiVersion: '1.0' }}
      rootUrl=""
      description="hello description"
    />
  </div>,
  document.getElementById('home'),
);
