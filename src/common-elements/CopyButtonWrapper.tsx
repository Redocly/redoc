import * as React from 'react';
import { Tooltip } from '../common-elements/Tooltip';

import { ClipboardService } from '../services/ClipboardService';

export interface CopyButtonWrapperProps {
  data: any;
  children: (props: { renderCopyButton: () => React.ReactNode }) => React.ReactNode;
}

export const CopyButtonWrapper = (
  props: CopyButtonWrapperProps & { tooltipShown?: boolean },
): JSX.Element => {
  const [tooltipShown, setTooltipShown] = React.useState(false);

  const copy = () => {
    const content =
      typeof props.data === 'string' ? props.data : JSON.stringify(props.data, null, 2);
    ClipboardService.copyCustom(content);
    showTooltip();
  };

  const renderCopyButton = () => {
    return (
      <button onClick={copy}>
        <Tooltip
          title={ClipboardService.isSupported() ? 'Copied' : 'Not supported in your browser'}
          open={tooltipShown}
        >
          Copy
        </Tooltip>
      </button>
    );
  };

  const showTooltip = () => {
    setTooltipShown(true);

    setTimeout(() => {
      setTooltipShown(false);
    }, 1500);
  };
  return props.children({ renderCopyButton: renderCopyButton }) as JSX.Element;
};
