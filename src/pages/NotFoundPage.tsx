import { useLocation } from 'react-router';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';
import { ArrowLeftIcon } from '@redocly/theme/icons/ArrowLeftIcon/ArrowLeftIcon';
import { breakpoints } from '@redocly/theme/core/openapi';
import { withoutPathPrefix } from '@redocly/theme/core/utils';

import { useNormalizeUrl } from '../hooks/useNormalizeUrl.js';
import { useTranslate } from '../hooks/useTranslate.js';

type NotFoundPageProps = {
  routingBasePath: string;
};

export function NotFoundPage({ routingBasePath }: NotFoundPageProps): ReactElement {
  const location = useLocation();
  const backLink = withoutPathPrefix(useNormalizeUrl(routingBasePath || '/'));
  const translate = useTranslate();

  return (
    <NotFoundWrapper className="not-found-page">
      <StatusText>404</StatusText>
      <Title>{translate('page.apiNotFound.title', 'No page at this address')}</Title>
      <Description>
        {translate('page.apiNotFound.description', "There's no page at")}{' '}
        <Path>{location.pathname}</Path>.
        <br />
        {translate('page.apiNotFound.hint', 'It may have been moved or deleted.')}
      </Description>
      <ButtonRow>
        <Button variant="primary" size="medium" to={backLink} icon={<ArrowLeftIcon />}>
          {translate('page.apiNotFound.backButton', 'Back to docs')}
        </Button>
      </ButtonRow>
    </NotFoundWrapper>
  );
}

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  min-height: calc(100vh - var(--navbar-height, 0px) - var(--banner-height, 0px));
  min-height: calc(100dvh - var(--navbar-height, 0px) - var(--banner-height, 0px));
  max-width: var(--page-404-max-width);
  margin: 0 var(--page-404-margin-horizontal);
  padding: var(--page-404-margin-vertical) 0;
  font-family: var(--page-404-font-family);

  @media screen and (max-width: ${breakpoints.small}) {
    margin: 0 var(--spacing-lg);
  }
`;

const StatusText = styled.div`
  color: var(--page-404-status-text-color);
  font-family: var(--font-family-monospaced);
  font-size: var(--page-404-status-font-size);
  line-height: var(--page-404-status-line-height);
  font-weight: var(--page-404-status-font-weight);
`;

const Title = styled.h1`
  margin: var(--spacing-xs) 0 0;
  color: var(--page-404-title-text-color);
  font-size: 32px;
  line-height: 40px;
  font-weight: var(--page-404-title-font-weight);
`;

const Description = styled.p`
  margin: var(--spacing-lg) 0 0;
  color: var(--page-404-description-text-color);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-lg);
  font-weight: var(--page-404-description-font-weight);
`;

const ButtonRow = styled.div`
  margin-top: var(--spacing-xl);
`;

const Path = styled.code`
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-bold);
  overflow-wrap: anywhere;
`;
