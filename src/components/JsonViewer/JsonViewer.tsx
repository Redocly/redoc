import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { PrismDiv } from '../../common-elements/PrismDiv';
import { jsonToHTML } from '../../utils/jsonToHtml';
import { OptionsContext } from '../OptionsProvider';
import { jsonStyles } from './style';

export interface JsonProps {
  data: any;
  className?: string;
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

const Json = (props: JsonProps) => {
  const [node, setNode] = React.useState<HTMLDivElement>();

  const renderInner = ({ renderCopyButton }) => {
    const showFoldingButtons =
      props.data &&
      Object.values(props.data).some(value => typeof value === 'object' && value !== null);

    return (
      <JsonViewerWrap>
        <SampleControls>
          {renderCopyButton()}
          {showFoldingButtons && (
            <>
              <button onClick={expandAll}> Expand all </button>
              <button onClick={collapseAll}> Collapse all </button>
            </>
          )}
        </SampleControls>
        <OptionsContext.Consumer>
          {options => (
            <PrismDiv
              tabIndex={0}
              className={props.className}
              // tslint:disable-next-line
              ref={node => setNode(node!)}
              dangerouslySetInnerHTML={{
                __html: jsonToHTML(props.data, options.jsonSamplesExpandLevel),
              }}
            />
          )}
        </OptionsContext.Consumer>
      </JsonViewerWrap>
    );
  };

  const expandAll = () => {
    const elements = node?.getElementsByClassName('collapsible');
    for (const collapsed of Array.prototype.slice.call(elements)) {
      const parentNode = collapsed.parentNode as Element;
      parentNode.classList.remove('collapsed');
      parentNode.querySelector('.collapser')!.setAttribute('aria-label', 'collapse');
    }
  };

  const collapseAll = () => {
    const elements = node?.getElementsByClassName('collapsible');
    // skip first item to avoid collapsing whole object/array
    const elementsArr = Array.prototype.slice.call(elements, 1);

    for (const expanded of elementsArr) {
      const parentNode = expanded.parentNode as Element;
      parentNode.classList.add('collapsed');
      parentNode.querySelector('.collapser')!.setAttribute('aria-label', 'expand');
    }
  };

  const collapseElement = (target: HTMLElement) => {
    let collapsed;
    if (target.className === 'collapser') {
      collapsed = target.parentElement!.getElementsByClassName('collapsible')[0];
      if (collapsed.parentElement.classList.contains('collapsed')) {
        collapsed.parentElement.classList.remove('collapsed');
        target.setAttribute('aria-label', 'collapse');
      } else {
        collapsed.parentElement.classList.add('collapsed');
        target.setAttribute('aria-label', 'expand');
      }
    }
  };

  const clickListener = React.useCallback((event: MouseEvent) => {
    collapseElement(event.target as HTMLElement);
  }, []);

  const focusListener = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      collapseElement(event.target as HTMLElement);
    }
  }, []);

  React.useEffect(() => {
    node?.addEventListener('click', clickListener);
    node?.addEventListener('focus', focusListener);
    return () => {
      node?.removeEventListener('click', clickListener);
      node?.removeEventListener('focus', focusListener);
    };
  }, [clickListener, focusListener, node]);

  return <CopyButtonWrapper data={props.data}>{renderInner}</CopyButtonWrapper>;
};

export const JsonViewer = styled(Json)`
  ${jsonStyles};
`;
