import { styled } from 'styled-components';

type CircleIconProps = {
  sign: string;
  className?: string;
  color?: string;
};

export function PlusCircleIcon({ sign, className, color }: CircleIconProps) {
  return (
    <StyledCircleIcon className={className} $color={color}>
      {sign}
    </StyledCircleIcon>
  );
}

const StyledCircleIcon = styled.span<{ $color?: string }>`
  background-color: var(--bg-color);
  border-radius: 50%;
  border: 1px solid ${({ $color }) => $color || 'var(--border-color-primary)'};
  font-size: var(--font-size-lg);
  line-height: var(--font-size-lg);
  color: ${({ $color }) => $color || 'var(--text-color-secondary)'};
  width: 20px;
  height: 20px;
`;
