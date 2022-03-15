import * as React from 'react';
import { shallow } from 'enzyme';

import { OpenAPIParser } from '../../services';
import { SecurityRequirementModel } from '../../services/models/SecurityRequirement';
import { SecurityRequirement } from '../SecurityRequirement/SecurityRequirement';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SecurityRequirement', () => {
    describe('SecurityRequirement', () => {
      it("should render 'None' when empty object in security open api", () => {
        const parser = new OpenAPIParser(
          { openapi: '3.0', info: { title: 'test', version: '0' }, paths: {} },
          undefined,
          options,
        );
        const securityRequirement = new SecurityRequirementModel({}, parser);
        const securityElement = shallow(
          <SecurityRequirement key={1} security={securityRequirement} />,
        ).getElement();
        expect(securityElement.props.children.type.target).toEqual('span');
        expect(securityElement.props.children.props.children).toEqual('None');
      });
    });
  });
});
