import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { SectionItemProps } from '../SectionItem/SectionItem.js';
import type { OperationMenuItem } from '../../models/index.js';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';
import { breakpoints } from '@redocly/theme/core/openapi';
import { Button } from '@redocly/theme/components/Button/Button';
import { H2 } from '@redocly/theme/components/Typography/H2';
import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { joinWithSeparator } from '../../services/history/helpers.js';
import { Row, SamplesMiddlePanel, SamplesPanel, ShareLink } from '../common/index.js';
import { Markdown } from '../Markdown/index.js';
import { OperationsNavigation } from './OperationsNavigation.js';
import { layoutAtom } from '../../jotai/app.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

interface TagItemProps extends SectionItemProps {
  routingBasePath?: string;
  isExpanded: boolean;
}

export function TagItemComponent({
  item,
  routingBasePath = '',
  isExpanded,
}: TagItemProps): ReactElement {
  const translate = useTranslate();
  const { description, name, href } = item;
  const navigate = useNavigate();
  const layout = useAtomValue(layoutAtom);

  const tagItemSlug = joinWithSeparator(routingBasePath, item.href);

  const handleClick = useCallback(() => {
    navigate(tagItemSlug);
  }, [navigate, tagItemSlug]);

  const expandable = Boolean(item.items.length);

  const isStacked = layout === LayoutVariant.STACKED;

  return (
    <Wrapper expanded={isExpanded}>
      <Row layout={layout}>
        <SamplesMiddlePanel fullWidth={!expandable} isStacked={isStacked}>
          <Heading>
            <ShareLink to={href} aria-label={`link to ${name}`} />
            {name}
          </Heading>
          <Markdown source={description} />
        </SamplesMiddlePanel>
        {expandable && (
          <OperationsNavigation
            items={item.items as OperationMenuItem[]}
            routingBasePath={routingBasePath}
          />
        )}
      </Row>
      {expandable && !isExpanded && (
        <ShowButton type="button" variant="text" size="medium" onClick={handleClick}>
          + {translate('openapi.actions.show', 'Show')}
        </ShowButton>
      )}
    </Wrapper>
  );
}

export const TagItem = memo<TagItemProps>(TagItemComponent);

const Wrapper = styled.div<{ expanded: boolean }>`
  padding-top: var(--spacing-lg);
  padding-bottom: ${({ expanded }) => (expanded ? 'var(--spacing-xxl)' : '')};

  /* 
    Markdoc components inside markdown that use SamplesPanel should not have padding.
    E.g. SchemaDefinition, McpTool
    padding is added by the TagItem itself
  */
  ${MarkdownWrapper} ${SamplesPanel} {
    padding-left: 0;
    padding-right: 0;
  }
`;

const ShowButton = styled(Button)`
  margin: var(--spacing-md) var(--spacing-xl) var(--spacing-xxs);
  width: calc(100% - var(--spacing-xl) * 2);

  @media screen and (min-width: ${breakpoints.medium}) {
    --button-margin-md: calc(var(--spacing-xl) * 2);

    margin-left: var(--button-margin-md);
    margin-right: var(--button-margin-md);
    width: calc(100% - var(--button-margin-md) * 2);
  }
`;

const Heading = styled(H2)`
  display: flex;
  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }
`;
