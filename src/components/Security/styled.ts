import { styled } from 'styled-components';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { Button } from '@redocly/theme/components/Button/Button';
import { Typography } from '@redocly/theme/components/Typography/Typography';

export { DeprecatedBadge } from '../Schema/styled.js';

export const SecurityPanel = styled(Panel)`
  margin-top: var(--spacing-xs);
  border: var(--panel-border, 1px solid var(--border-color-primary));
  border-radius: var(--panel-border-radius, var(--border-radius));
  font-size: var(--font-size-base);

  &&& {
    margin-bottom: var(--spacing-lg);
  }
`;

export const SecurityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
  color: var(--link-color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--layer-color, var(--bg-color));
  border-bottom: var(--panel-border, 1px solid var(--border-color-primary));
  border-radius: var(--panel-border-radius, var(--border-radius))
    var(--panel-border-radius, var(--border-radius)) 0 0;
`;

export const ViewDetailsButton = styled(Button)`
  margin-left: auto;
  font-size: var(--font-size-sm);
`;

export const Title = styled.span`
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-color-primary);
`;

export const SecurityList = styled.div`
  display: block;
  overflow: hidden;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-color-primary);
  line-height: var(--line-height-base);
`;

export const SchemeName = styled.span<{ $deprecated?: boolean }>`
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);
  text-decoration: ${(props) => (props.$deprecated ? 'line-through' : 'none')};
`;

export const Conjunction = styled.span`
  color: var(--text-color-description);
  line-height: var(--line-height-base);
`;

export const ScopeInline = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
  margin-left: var(--spacing-xxs);
  color: var(--text-color-secondary);
  line-height: var(--line-height-base);
`;

export const ModalBackground = styled.div`
  background: var(--bg-color-modal-overlay, rgba(0, 0, 0, 0.4));
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: var(--z-index-popover, 200);
  left: 0;
  top: 0;
  pointer-events: auto;
`;

export const ModalWrapper = styled.div`
  background: var(--bg-color);
  box-shadow: var(--bg-raised-shadow, 0 8px 32px rgba(0, 0, 0, 0.15));
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  width: 720px;
  max-width: 100%;
  height: auto;
  max-height: 600px;
  overflow-y: scroll;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);

  .tag-grey span {
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
  }
`;

export const CloseButton = styled(Button)`
  position: absolute;
  right: var(--spacing-md);
  top: var(--spacing-md);
`;

export const ModalTitle = styled(Typography)`
  display: flex;
  align-items: center;
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
  margin-bottom: var(--spacing-lg);

  svg {
    margin-right: var(--spacing-xs);
  }
`;

export const FlowWrapper = styled.div`
  background: var(--layer-color, var(--bg-color));
  padding: var(--spacing-base);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color-secondary, var(--border-color-primary));
  width: 100%;
  margin-top: var(--spacing-base);
`;

export const FlowTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  margin: 0 0 var(--spacing-xs);
`;

export const FlowTitle = styled.p`
  font-size: var(--font-size-base);
  margin: 0;
  text-transform: capitalize;
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-base);
`;

export const FlowDescription = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-description);
  margin-bottom: var(--spacing-xs);
`;

export const FlowProperties = styled.div`
  width: 100%;
  margin-top: var(--spacing-md);
`;

export const FlowTypeSection = styled.div`
  margin-bottom: var(--spacing-xs);
`;

export const FlowTypeName = styled.span`
  color: var(--text-color-primary);
  font-weight: var(--font-weight-medium);
`;

export const FlowTypeBody = styled.div`
  padding-left: var(--spacing-xs);
  margin-bottom: var(--spacing-xxs);
`;

export const PropertyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
`;

export const PropertyLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  flex: 1;
`;

export const PropertyValue = styled.div`
  flex: 1;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  word-break: break-word;
`;

export const SchemeLink = styled.a`
  color: var(--link-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const ScopesSection = styled.div`
  margin-top: var(--spacing-xxs);
`;

export const ScopesLabel = styled.span`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-secondary);
  display: block;
  margin-bottom: var(--spacing-xxs);
`;

export const ScopesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
`;

export const ScopeTag = styled.span`
  display: inline-block;
  font-size: var(--font-size-sm);
  font-family: var(--font-family-monospaced);
  padding: 0 var(--spacing-xxs);
  border-radius: var(--tag-border-radius);
  background: var(--tag-bg-color, var(--border-color-secondary));
  color: var(--text-color-secondary);
`;

export const OptionalScopesToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);
  border: 0;
  padding: 0;
  margin-top: var(--spacing-xxs);
  margin-bottom: var(--spacing-xxs);
  background: transparent;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  cursor: pointer;
`;

export const OptionalScopesList = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? '1000px' : '0')};
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  overflow: hidden;
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
`;

export const OptionalScopesChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) => (props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease-in-out;
`;

export const Tag = styled.div`
  border-radius: var(--tag-border-radius);
  padding: 0 var(--spacing-xxs);
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
  background-color: var(--tag-bg-color, var(--border-color-secondary));
  width: fit-content;
`;

export const FlowTypeTag = styled(Tag)`
  color: var(--color-warm-grey-8);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin-bottom: var(--spacing-xs);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);
`;
