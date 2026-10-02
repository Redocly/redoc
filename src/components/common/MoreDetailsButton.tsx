import { styled } from 'styled-components';

import { Button } from '@redocly/theme/components/Button/Button';
import { ChevronDownIcon } from '@redocly/theme/icons/ChevronDownIcon/ChevronDownIcon';
import { ChevronRightIcon } from '@redocly/theme/icons/ChevronRightIcon/ChevronRightIcon';

import { useSpecTranslate } from '../../hooks/useTranslate.js';

type MoreDetailsButtonProps = {
  expanded?: boolean;
};

export const MoreDetailsButton = ({ expanded }: MoreDetailsButtonProps) => {
  const translate = useSpecTranslate();
  return (
    <Wrapper>
      <span>{translate('moreDetails', 'More details')}</span>
      <Button
        icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        size="small"
        variant="ghost"
        aria-label="More details"
      />
    </Wrapper>
  );
};

const Wrapper = styled.span`
  cursor: pointer;
  align-items: center;
  display: flex;
  & > span {
    color: var(--link-color-primary);
  }

  & path {
    fill: var(--link-color-primary);
  }
`;
