import { styled } from 'styled-components';
import { Fragment, memo, useMemo, useState, type ReactElement } from 'react';

import type { GroupItemNode } from '../../types/content.js';

import { Button } from '@redocly/theme/components/Button/Button';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { withoutPathPrefix } from '@redocly/theme/core/utils';

import { NavigationBadge, TextBadge } from '../common/Badge.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';

const MAX_OPERATIONS = 8;

type GroupPanelEntry = GroupItemNode['children'][0]['items'][number];
type ResolvedEntry = GroupPanelEntry & { href: string };

type GroupOperationRowProps = {
  item: ResolvedEntry;
  deprecatedLabel: string;
};

const GroupOperationRow = memo(function GroupOperationRow({
  item,
  deprecatedLabel,
}: GroupOperationRowProps): ReactElement {
  return (
    <Tooltip disabled={!item.summary} tip={item.summary} placement="left">
      <TagItem to={item.href} variant="outlined" size="large">
        <span>
          {item.prefix && (
            <StyledTextBadge color={item.prefix.color}>{item.prefix.name}</StyledTextBadge>
          )}

          <Path>{item.title}</Path>

          {item.badges &&
            item.badges.map((badge) => (
              <Tooltip
                disabled={!badge.description}
                tip={badge.description}
                key={badge.name}
                placement="top"
              >
                <StyledNavigationBadge color={badge.color}>{badge.name}</StyledNavigationBadge>
              </Tooltip>
            ))}
          {item.deprecated && (
            <StyledNavigationBadge $deprecated>{deprecatedLabel}</StyledNavigationBadge>
          )}
        </span>
      </TagItem>
    </Tooltip>
  );
});

function DirectionRightIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M7.125 3L6.59471 3.53029L8.31446 5.25H3.75C3.55109 5.25 3.36032 5.32902 3.21967 5.46967C3.07902 5.61032 3 5.80109 3 6V10.5H3.75V6H8.31446L6.59471 7.71971L7.125 8.25L9.75 5.625L7.125 3Z"
        fill="currentColor"
      />
      <path d="M3.75 1.5H3V4.5H3.75V1.5Z" fill="currentColor" />
    </svg>
  );
}

const GroupChildTagRow = memo(function GroupChildTagRow({
  item,
}: {
  item: ResolvedEntry;
}): ReactElement {
  return (
    <ChildTagItem to={item.href} variant="outlined" size="large">
      <IconCircle>
        <DirectionRightIcon />
      </IconCircle>
      <span>
        <Path>{item.title}</Path>
        {item.summary && item.summary !== item.title && (
          <ChildTagSummary>{item.summary}</ChildTagSummary>
        )}
      </span>
    </ChildTagItem>
  );
});

type ResolvedSection = { title: string; items: ResolvedEntry[]; isChildTag: boolean };

export function GroupPanelItem({ node }: { node: GroupItemNode }): ReactElement {
  const translate = useSpecTranslate();
  const normalizeUrl = useNavigationUrlNormalizer();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Pre-translate labels — `translate` is unstable across renders and would
  // break the memo on `GroupOperationRow` if passed as a prop.
  const deprecatedLabel = translate('badges.deprecated', 'deprecated');
  const showLabel = translate('actions.show', 'Show');
  const moreLabel = translate('actions.more', 'more');

  const sections = useMemo<ResolvedSection[]>(() => {
    const out: ResolvedSection[] = [];
    for (const section of node.children) {
      const items: ResolvedEntry[] = (section.items ?? []).map((item) => ({
        ...item,
        // The portal's theme Link re-applies the path prefix; hand it a prefix-free path.
        href: withoutPathPrefix(normalizeUrl(item.link)),
      }));
      if (items.length === 0) continue;
      const title = resolveText(translate, section.titleTranslationKey, section.title) ?? '';
      out.push({ title, items, isChildTag: items.every((item) => item.childTag) });
    }
    return out;
  }, [node.children, normalizeUrl, translate]);

  const paginatedTotal = useMemo(
    () =>
      sections.reduce((sum, section) => sum + (section.isChildTag ? 0 : section.items.length), 0),
    [sections],
  );

  const showMoreCount =
    !isExpanded && paginatedTotal > MAX_OPERATIONS ? paginatedTotal - MAX_OPERATIONS : 0;

  const { operationSections, childTagSections } = useMemo(() => {
    let remaining = isExpanded ? Infinity : MAX_OPERATIONS;
    const operationSections: ResolvedSection[] = [];
    const childTagSections: ResolvedSection[] = [];
    for (const section of sections) {
      if (section.isChildTag) {
        childTagSections.push(section);
        continue;
      }
      if (remaining <= 0) continue;
      const items = section.items.slice(0, remaining);
      remaining -= items.length;
      if (items.length > 0) operationSections.push({ ...section, items });
    }
    return { operationSections, childTagSections };
  }, [sections, isExpanded]);

  return (
    <Wrapper $isStacked={true} data-testid="items-navigation-list">
      {operationSections.map((section, sectionIndex) => (
        <Fragment key={`op-${sectionIndex}`}>
          {section.title && <Title>{section.title}</Title>}
          {section.items.map((item, index) => (
            <GroupOperationRow
              key={`op-${sectionIndex}-${index}`}
              item={item}
              deprecatedLabel={deprecatedLabel}
            />
          ))}
        </Fragment>
      ))}
      {!isExpanded && Boolean(showMoreCount) && (
        <StyledButton
          variant="link"
          size="large"
          data-testid="show-more-operations"
          fullWidth={true}
          onClick={() => setIsExpanded(true)}
        >
          {showLabel} {showMoreCount} {moreLabel}...
        </StyledButton>
      )}
      {childTagSections.length > 0 && (
        <>
          {operationSections.length > 0 && <GroupsDivider />}
          <ChildTagsWrapper>
            {childTagSections.map((section, sectionIndex) => (
              <Fragment key={`group-${sectionIndex}`}>
                {section.title && <Title>{section.title}</Title>}
                {section.items.map((item, index) => (
                  <GroupChildTagRow key={`group-${sectionIndex}-${index}`} item={item} />
                ))}
              </Fragment>
            ))}
          </ChildTagsWrapper>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $isStacked: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);

  & a {
    display: flex;
    width: 100%;
  }
`;

const ChildTagsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
`;

const GroupsDivider = styled.div`
  position: relative;
  height: 1px;
  margin: var(--spacing-xs) 0;
  background: var(--border-color-secondary);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--border-color-secondary);
    transform: translateY(-50%);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const StyledTextBadge = styled(TextBadge)`
  line-height: var(--line-height-base);
`;

const StyledNavigationBadge = styled(NavigationBadge)`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  padding: 0 var(--spacing-xxs);
`;

const Title = styled.span`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-color-primary);
  margin: var(--spacing-sm) 0 var(--spacing-xxs) 0;
`;

const StyledButton = styled(Button)`
  & + & {
    margin-left: 0;
  }
`;

const TagItem = styled(StyledButton)`
  border-radius: var(--border-radius-lg);
  background: var(--bg-color);
  justify-content: space-between;
  width: 100%;

  & > span {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-unit);
    overflow-x: hidden;
  }

  &:hover {
    background: var(--bg-color);
  }

  &:hover::after {
    content: '→';
    line-height: var(--line-height-base);
  }
`;

const Path = styled.span`
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-primary);
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const ChildTagItem = styled(TagItem)`
  justify-content: flex-start;
  align-items: center;
  gap: var(--spacing-xs);
  padding-left: var(--spacing-base);

  &:hover::after {
    margin-left: auto;
  }
`;

const ChildTagSummary = styled.span`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--badge-audience-bg-color);
  color: var(--icon-color-primary);

  svg {
    width: 12px;
    height: 12px;
  }
`;
