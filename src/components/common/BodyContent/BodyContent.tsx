import { memo } from 'react';
import { useAtom } from 'jotai';

import type { MediaContentModel } from '../../../models/index.js';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { Dropdown } from '../Dropdown/index.js';
import { RequiredLabel } from '../Fields/index.js';
import { ConstraintsView } from '../ConstraintsView.js';
import { Schema } from '../../Schema/index.js';
import { getActiveMediaType } from '../../../models/index.js';
import { Markdown } from '../../Markdown/index.js';
import { activeMimeNameAtom } from '../../../jotai/app.js';
import { LinkToField } from '../LinkToField.js';
import { useTranslate } from '../../../hooks/index.js';
import { styled } from '../../../styled-components.js';

interface BodyContentProps {
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  required?: boolean;
  description?: string | GenericObject;
  content?: MediaContentModel;
  deepLink?: string;
}

function BodyContentComponent({
  required,
  skipReadOnly,
  skipWriteOnly,
  description,
  content,
  deepLink,
}: BodyContentProps) {
  const translate = useTranslate();
  const [activeMimeName, setActiveMimeName] = useAtom(activeMimeNameAtom);

  if (!content) {
    return null;
  }

  const { schema, examples, operation, name } = getActiveMediaType(content, activeMimeName);

  const mimeTypeOptions = content.mediaTypes.map(({ name }) => ({ label: name, value: name }));

  return (
    <>
      <Title>
        {deepLink && <LinkToField to={deepLink} />}
        {translate('openapi.body', 'Body')}
        <Dropdown
          options={mimeTypeOptions}
          value={name}
          triggerVariant="ghost"
          triggerSize="large"
          onChange={({ value }) => setActiveMimeName(value)}
        />
      </Title>
      {required && (
        <RequiredLabel>{translate('openapi.badges.required', 'required')}</RequiredLabel>
      )}
      <StyledMarkdown source={description} />
      {schema?.type === 'object' && schema?.constraints && (
        <ConstraintsView constraints={schema?.constraints || []} />
      )}
      <Schema
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        key="schema"
        schema={schema}
        examples={examples}
        operation={operation}
        level={1}
        disableDeepLinks={!deepLink}
      />
    </>
  );
}

export const BodyContent = memo<BodyContentProps>(BodyContentComponent);

const StyledMarkdown = styled(Markdown)`
  margin: var(--spacing-xxs) 0 0;
`;

const Title = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color-primary);
  margin-top: var(--spacing-md);
  font-size: 18px;
  line-height: var(--line-height-lg);
  padding: var(--spacing-xxs) 0;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }

  & button:not(:has(*)) {
    font-family: var(--font-family-monospaced);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-lg);
  }
`;
