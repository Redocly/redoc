/* eslint-disable import/no-internal-modules */
import * as React from 'react';
import { render } from 'enzyme';
import { VersionSelector } from '../VersionSelector';
import * as versionData from './data/mockVersionData.json';

describe('VersionSelector', () => {
  it('should correctly render VersionSelector', () => {
    const wrapper = render(<VersionSelector {...versionData} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('label').text()).toBe(
      `Version Selector: v${versionData.active.apiVersion}`,
    );
    expect(wrapper.find('button').text()).toBe(versionData.resourceVersions.slice(-1)[0]);
  });
});
