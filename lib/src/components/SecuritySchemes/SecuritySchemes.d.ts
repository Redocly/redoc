import * as React from 'react';
import { SecuritySchemesModel } from '../../services/models';
import { OpenAPISecurityScheme } from '../../types';
export interface OAuthFlowProps {
    type: string;
    flow: OpenAPISecurityScheme['flows'][keyof OpenAPISecurityScheme['flows']];
}
export declare class OAuthFlow extends React.PureComponent<OAuthFlowProps> {
    render(): JSX.Element;
}
export interface SecurityDefsProps {
    securitySchemes: SecuritySchemesModel;
}
export declare class SecurityDefs extends React.PureComponent<SecurityDefsProps> {
    render(): JSX.Element[];
}
