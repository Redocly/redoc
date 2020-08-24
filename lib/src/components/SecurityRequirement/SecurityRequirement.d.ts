import * as React from 'react';
import { SecurityRequirementModel } from '../../services/models/SecurityRequirement';
export interface SecurityRequirementProps {
    security: SecurityRequirementModel;
}
export declare class SecurityRequirement extends React.PureComponent<SecurityRequirementProps> {
    render(): JSX.Element;
}
export interface SecurityRequirementsProps {
    securities: SecurityRequirementModel[];
}
export declare class SecurityRequirements extends React.PureComponent<SecurityRequirementsProps> {
    render(): JSX.Element | null;
}
