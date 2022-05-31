import * as React from 'react';

export const RequiredScopesRow = ({ scopes }: { scopes: string[] }): JSX.Element | null => {
  if (!scopes.length) return null;

  return (
    <div>
      <b>Required scopes: </b>
      {scopes.map((scope, idx) => {
        return (
          <React.Fragment key={idx}>
            <code>{scope}</code>{' '}
          </React.Fragment>
        );
      })}
    </div>
  );
};
