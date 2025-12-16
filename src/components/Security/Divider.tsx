import { styled } from '../../styled-components.js';
import { Tag } from './styled.js';

export function Divider({ label }: { label: string }) {
  return (
    <Wrapper>
      <Tag className="tag-grey">{label}</Tag> <hr />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-size: var(--font-size-sm);
  width: 100%;
  display: flex;
  align-items: center;
  margin: var(--spacing-base) 0;
  hr {
    height: 1px;
    border: none;
    background: var(--border-color-primary);
    width: 100%;
    margin-left: var(--spacing-xs);
  }
`;
