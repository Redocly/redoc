import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useTransition } from 'react';
import { styled } from 'styled-components';
import { selectAtom } from 'jotai/utils';

import type { ButtonProps } from '@redocly/theme/components/Button/Button';
import type { ComponentType } from 'react';

import { ExpandCollapseIcon } from '@redocly/theme/icons/ExpandCollapseIcon/ExpandCollapseIcon';
import { Button } from '@redocly/theme/components/Button/Button';

import { collapsibleEntrySection, itemStoreAtom } from '../../jotai/itemStore.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';

interface ExpandAllButtonProps {
  itemId: string;
  deepLinkKeys: string[];
}

export const ExpandAllButton = ({ itemId, deepLinkKeys }: ExpandAllButtonProps) => {
  const translate = useSpecTranslate();
  const allExpanded = useAtomValue(
    useMemo(
      () =>
        selectAtom(itemStoreAtom(itemId), (s) => {
          const entries = Object.entries(s.collapsibles).filter(([key]) =>
            deepLinkKeys.includes(collapsibleEntrySection(key)),
          );
          return entries.length > 0 && entries.every(([, expanded]) => expanded);
        }),
      [itemId, deepLinkKeys],
    ),
  );
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const [isPending, startTransition] = useTransition();
  const telemetry = useTelemetry();
  const handleToggle = () => {
    const next = !allExpanded;
    telemetry.sendExpandCollapseAllClickedMessage([
      {
        ...RESOURCES.expandCollapseAllButton,
        isExpanded: next,
      },
    ]);
    startTransition(() => {
      setItemState((current) => ({
        expandableSections: {
          ...current.expandableSections,
          ...Object.fromEntries(deepLinkKeys.map((k) => [k, next])),
        },
        // Overwrite every mounted collapsible under these sections, including manual toggles.
        collapsibles: {
          ...current.collapsibles,
          ...Object.fromEntries(
            Object.keys(current.collapsibles)
              .filter((key) => deepLinkKeys.includes(collapsibleEntrySection(key)))
              .map((key) => [key, next]),
          ),
        },
      }));
    });
  };

  return (
    <StyledButton
      data-testid="schema-expand-all-button"
      icon={<ExpandCollapseIcon $collapse={allExpanded} />}
      iconPosition="right"
      size="small"
      variant="ghost"
      onClick={handleToggle}
      style={{ opacity: isPending ? 0.6 : 1 }}
    >
      {allExpanded
        ? translate('openapi.collapseAll', 'Collapse all')
        : translate('openapi.expandAll', 'Expand all')}
    </StyledButton>
  );
};

const StyledButton: ComponentType<ButtonProps> = styled(Button)`
  margin-left: auto;
`;
