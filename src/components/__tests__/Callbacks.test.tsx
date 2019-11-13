/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { OpenAPIParser } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';

import { CallbackModel } from '../../services/models/Callback';
import { CallbacksList, CallbackTitle, CallbackView } from '../Callbacks';
import * as simpleCallbackFixture from './fixtures/simple-callback.json';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('Callbacks', () => {
    it('should correctly render CallbackView', () => {
      const parser = new OpenAPIParser(simpleCallbackFixture, undefined, options);
      const callback = new CallbackModel(
        parser,
        'Test.Callback',
        { $ref: '#/components/callbacks/Test' },
        options,
      );
      const callbackViewElement = shallow(
        <CallbackView key={callback.name} callback={callback} />,
      ).getElement();
      expect(callbackViewElement.props).toBeDefined();
      expect(callbackViewElement.props.children).toBeDefined();
      expect(callbackViewElement.props.children.length).toBeGreaterThan(0);
    });

    it('should correctly render CallbackTitle', () => {
      const callbackTitleViewElement = shallow(
        <CallbackTitle name={'Test'} className={'.test'} onClick={undefined} />,
      ).getElement();
      expect(callbackTitleViewElement.props).toBeDefined();
      expect(callbackTitleViewElement.props.className).toEqual('.test');
      expect(callbackTitleViewElement.props.onClick).toBeUndefined();
    });

    it('should correctly render CallbacksList', () => {
      const parser = new OpenAPIParser(simpleCallbackFixture, undefined, options);
      const callback = new CallbackModel(
        parser,
        'Test.Callback',
        { $ref: '#/components/callbacks/Test' },
        options,
      );
      const callbacksListViewElement = shallow(
        <CallbacksList callbacks={[callback]} />,
      ).getElement();
      expect(callbacksListViewElement.props).toBeDefined();
      expect(callbacksListViewElement.props.children).toBeDefined();
      expect(callbacksListViewElement.props.children.length).toBeGreaterThan(0);
    });
  });
});
