import { styled } from 'styled-components';

import { PlusCircleIcon } from '../../icons/PlusCircleIcon/PlusCircleIcon.js';

type NestedToggleButtonProps = {
  expanded: boolean;
  label: string;
  color?: string;
  className?: string;
  onClick?: () => void;
};

function NestedToggleButtonComponent({
  expanded,
  label,
  color,
  className,
  onClick,
}: NestedToggleButtonProps) {
  return (
    <button className={className} onClick={onClick} type="button">
      <PlusCircleIcon sign={expanded ? '-' : '+'} color={color} />
      <ButtonText>{label}</ButtonText>
    </button>
  );
}

const ButtonText = styled.span`
  width: max-content;
`;

export const NestedToggleButton = styled(NestedToggleButtonComponent)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  gap: var(--spacing-xxs, 4px);
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
  min-height: 24px;
`;
