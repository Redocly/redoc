/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { OpenAPIParser } from '../../services';
import { CallbackModel } from '../../services/models/Callback';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import { CallbacksList, CallbackTitle, CallbackOperation } from '../Callbacks';
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
        '',
        options,
      );
      // There should be 1 operation defined in simple-callback.json, just get it manually for readability.
      const callbackViewElement = shallow(
        <CallbackOperation key={callback.name} callbackOperation={callback.operations[0]} />,
      ).getElement();
      expect(callbackViewElement.props).toBeDefined();
      expect(callbackViewElement.props.children).toBeDefined();
      expect(callbackViewElement.props.children.length).toBeGreaterThan(0);
    });

    it('should correctly render CallbackTitle', () => {
      const callbackTitleViewElement = shallow(
        <CallbackTitle name={'Test'} className={'.test'} onClick={undefined} httpVerb={'get'} />,
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
        '',
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
