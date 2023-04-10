/* eslint-disable import/no-internal-modules */
import * as React from 'react';
import { mount, render } from 'enzyme';
import { VersionSelector } from '../VersionSelector';
import * as versionData from './data/mockVersionData.json';

describe('VersionSelector', () => {
  const { location } = window;

  beforeEach((): void => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL(window.location.href),
    });
  });

  afterEach((): void => {
    window.location.href = location.href;
  });

  it('should correctly render VersionSelector', () => {
    const wrapper = render(<VersionSelector {...versionData} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('label').text()).toBe(`Resource Version:`);
    expect(wrapper.find('button').text()).toBe(versionData.resourceVersions.slice(-1)[0]);
  });

  it('should navigate to spec after select change', async () => {
    const wrapper = mount(<VersionSelector {...versionData} />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('li')).toHaveLength(3);

    wrapper.find('li').at(1).simulate('click');
    expect(JSON.stringify(window.location)).toBe(
      JSON.stringify(`${versionData.rootUrl}/${versionData.resourceVersions[1]}`),
    );
  });

  it('should not navigate after selecting active resource version', () => {
    const wrapper = mount(<VersionSelector {...versionData} />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('li')).toHaveLength(3);

    wrapper.find('li').at(0).simulate('click');
    expect(JSON.stringify(window.location)).not.toBe(
      JSON.stringify(`${versionData.rootUrl}/${versionData.resourceVersions[2]}`),
    );
    expect(JSON.stringify(window.location)).toBe(JSON.stringify(location.href));
  });
});
