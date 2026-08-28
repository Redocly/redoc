import * as React from 'react';

export const RequiredScopesRow = ({ scopeSets }: { scopeSets: string[][] }): JSX.Element | null => {
  if (!scopeSets.length) return null;

  return (
    <div>
      <b>Required scopes: </b>
      {scopeSets.map((scopeSet, ssIdx) => {
        return (
          <React.Fragment key={ssIdx}>
            {scopeSet.map((scope, idx) => {
              return (
                <React.Fragment key={idx}>
                  <code>{scope}</code>{' '}
                </React.Fragment>
              );
            })}
            {ssIdx + 1 < scopeSets.length && ' or '}
          </React.Fragment>
        );
      })}
    </div>
  );
};
