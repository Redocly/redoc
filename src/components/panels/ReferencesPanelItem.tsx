import { memo, useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { styled } from 'styled-components';
import { Link } from 'react-router';

import type { ReactElement } from 'react';
import type { ReferencesNode } from '../../types/content.js';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';
import { resolveText } from '../../utils/resolveText.js';
import {
  graphqlReferenceMapAtom,
  graphqlTypeLookupAtom,
  graphqlTypeSlugMapAtom,
} from '../../jotai/graphql.js';
import { markNavigationCauseAtom } from '../../jotai/telemetry.js';
import {
  PanelWrapper,
  PanelHeading,
  PanelBody,
  PanelListItem,
  ListIcon,
} from './shared-panel-styles.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';

type ReferenceListItem = {
  name: string;
  field?: string;
};

type ReferenceRowProps = {
  reference: ReferenceListItem;
  typeTo: string;
  fieldTo?: string;
  onReferencedInClick: (referencedIn: string) => void;
};

export function ReferencesPanelItem({ node }: { node: ReferencesNode }): ReactElement | null {
  const referenceItem = node.children[0];
  const translate = useSpecTranslate();
  const referenceMap = useAtomValue(graphqlReferenceMapAtom);
  const slugMap = useAtomValue(graphqlTypeSlugMapAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  const telemetry = useTelemetry();
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const markNavigationCause = useSetAtom(markNavigationCauseAtom);
  const fromKind = referenceItem?.graphqlTypeName
    ? (lookup(referenceItem.graphqlTypeName)?.variant ?? 'other')
    : 'other';
  const fireReferencedIn = useCallback(
    (typeName: string) => {
      markNavigationCause('referencedIn');
      telemetry.sendReferencedInClickedMessage([
        {
          ...RESOURCES.graphqlDocsReferencedInLink,
          fromKind,
          toKind: lookup(typeName)?.variant ?? 'other',
        },
      ]);
    },
    [telemetry, markNavigationCause, lookup, fromKind],
  );

  const references = useMemo(() => {
    if (referenceItem?.graphqlTypeName) {
      return referenceMap[referenceItem.graphqlTypeName] ?? [];
    }
    return referenceItem?.references ?? [];
  }, [referenceItem, referenceMap]);

  const normalizedReferences = useMemo(() => {
    return references.flatMap((reference) => {
      const typeSlug = slugMap[reference.name];
      if (!typeSlug) return [];
      const typeTo = normalizeUrl(typeSlug);
      const fieldTo = reference.field
        ? normalizeUrl(`${typeSlug}#${reference.name}-${reference.field}`)
        : undefined;

      return [{ reference, typeTo, fieldTo }];
    });
  }, [references, slugMap, normalizeUrl]);

  if (references.length === 0) return null;

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  return (
    <PanelWrapper className="panel-api-docs">
      <PanelHeading>{panelHeader}</PanelHeading>
      <PanelBody>
        {normalizedReferences.map(({ reference, typeTo, fieldTo }) => (
          <ReferenceItem
            key={`${reference.name}.${reference.field ?? ''}`}
            reference={reference}
            typeTo={typeTo}
            fieldTo={fieldTo}
            onReferencedInClick={fireReferencedIn}
          />
        ))}
      </PanelBody>
    </PanelWrapper>
  );
}

const ReferenceItem = memo(function ReferenceItem({
  reference,
  typeTo,
  fieldTo,
  onReferencedInClick,
}: ReferenceRowProps): ReactElement {
  const handleTypeClick = useCallback(
    () => onReferencedInClick(reference.name),
    [onReferencedInClick, reference.name],
  );
  const handleFieldClick = useCallback(
    () => onReferencedInClick(reference.name),
    [onReferencedInClick, reference.name],
  );

  return (
    <ReferenceRow>
      <ListIcon />
      <RefText>
        <RefLink to={typeTo} onClick={handleTypeClick}>
          {reference.name}
        </RefLink>
        {reference.field && fieldTo && (
          <RefFieldSpan>
            .<wbr />
            <RefLink to={fieldTo} onClick={handleFieldClick}>
              {reference.field}
            </RefLink>
          </RefFieldSpan>
        )}
      </RefText>
    </ReferenceRow>
  );
});

const ReferenceRow = styled(PanelListItem)`
  align-items: flex-start;
`;

const RefText = styled.span`
  overflow-wrap: anywhere;
`;

const RefLink = styled(Link)`
  color: var(--link-color-primary, var(--text-color-secondary));
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const RefFieldSpan = styled.span`
  color: var(--text-color-secondary);

  a {
    color: var(--text-color-secondary);
  }
`;
