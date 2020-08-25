import * as React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import styled from '../../../styled-components';

type Props = {
  className: string;
  style: any;
  componentId?: string;
};

const OverflowHighlighter = styled.pre`
  overflow-x: scroll;
`;

const Highlighter: React.FC<Props> = ({ children, className }) => {
  console.log('className', className);
  const language = className ? className.replace(/language-/, '').trim() : 'bash';

  if (!children) {
    return null;
  }

  return (
    <Highlight {...defaultProps} code={children.toString()} language={language as Language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <OverflowHighlighter className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </OverflowHighlighter>
      )}
    </Highlight>
  );
};

export default Highlighter;
