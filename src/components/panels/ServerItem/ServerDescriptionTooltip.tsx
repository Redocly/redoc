import { useEffect, useState, type ReactElement } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { InformationIcon } from '@redocly/theme/icons/InformationIcon/InformationIcon';

export const ServerDescriptionTooltip = ({
  description,
}: {
  description?: string;
}): ReactElement => {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const handleTouchMove = (): void => {
      if (isOpened) {
        setIsOpened(false);
      }
    };

    if (isOpened) {
      document.addEventListener('touchmove', handleTouchMove, { passive: true });

      return (): void => {
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isOpened]);

  return (
    <Tooltip tip={description} placement="bottom" arrowPosition="left" isOpen={isOpened}>
      <Button
        size="small"
        variant="ghost"
        icon={<InformationIcon />}
        data-testid="server-item-description-tooltip"
        onClick={() => setIsOpened(true)}
        onBlur={() => setIsOpened(false)}
        onFocus={() => setIsOpened(true)}
        onMouseEnter={() => setIsOpened(true)}
        onMouseLeave={() => setIsOpened(false)}
        onTouchCancel={() => setIsOpened(false)}
      />
    </Tooltip>
  );
};
