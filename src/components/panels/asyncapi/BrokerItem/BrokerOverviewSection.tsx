import { styled } from 'styled-components';
import { Fragment } from 'react/jsx-runtime';

import type { BrokerData, AsyncApiTag } from '../../../../types/asyncapi.js';
import type { Node } from '@markdoc/markdoc';

import { Tag } from '@redocly/theme/components/Tag/Tag';

import { ExternalDocumentation } from '../../../common/ExternalDocumentation.js';
import { Markdown } from '../../../common/Markdown.js';
import {
  Block,
  Header,
  Section,
  Label,
  Value,
  ExternalDocumentationWrapper,
  HostList,
} from './BrokerPanel.styled.js';

type BrokerOverviewSectionProps = {
  broker: BrokerData;
};

const renderInfoSection = (broker: BrokerData) => {
  const hasAdditionalInfo = broker.title || broker.summary || broker.description;

  return (
    <Block>
      <Header>Info</Header>
      {broker.url && (
        <Section>
          <Label>Host:</Label>
          <Value>
            <HostList>
              {broker.url.split(' ').map((host, index) => (
                <span key={index}>{host}</span>
              ))}
            </HostList>
          </Value>
        </Section>
      )}
      <Section>
        <Label>Protocol{broker.protocolVersion ? ' and version' : ''}:</Label>
        <Value>
          {broker.protocol}
          {broker.protocolVersion && `, ${broker.protocolVersion}`}
        </Value>
      </Section>

      {hasAdditionalInfo && (
        <>
          <Divider />
          {broker.title && (
            <Section>
              <Label>Title:</Label>
              <Value>{broker.title}</Value>
            </Section>
          )}
          {broker.summary && (
            <Section>
              <Label>Summary:</Label>
              <Value>{broker.summary}</Value>
            </Section>
          )}
          {broker.description && (
            <Section>
              <Label>Description:</Label>
              {typeof broker.description === 'string' ? (
                <Value>{broker.description}</Value>
              ) : (
                <Value>
                  <Markdown source={broker.description as Node | Node[]} />
                </Value>
              )}
            </Section>
          )}
        </>
      )}
    </Block>
  );
};

const renderVariablesSection = (
  variables: Array<{ key: string; value: NonNullable<BrokerData['variables']>[string] }>,
) => (
  <Block>
    <Header>Variables</Header>
    {variables.map(({ key, value }, index, array) => (
      <Fragment key={key}>
        <Section>
          <BrokerVariableName>{key}</BrokerVariableName>
          {value.default && (
            <Variable>
              Default
              <Tag size="small" borderless>
                {value.default}
              </Tag>
            </Variable>
          )}
          {value.description &&
            (typeof value.description === 'string' ? (
              <Description>{value.description}</Description>
            ) : (
              <Description>
                <Markdown source={value.description as Node | Node[]} />
              </Description>
            ))}
          {value.enum && (
            <Variable>
              Enum
              <TagWrapper>
                {value.enum.map((el: string) => (
                  <Tag key={el} size="small" borderless>
                    {el}
                  </Tag>
                ))}
              </TagWrapper>
            </Variable>
          )}
        </Section>
        {index < array.length - 1 && <Divider />}
      </Fragment>
    ))}
  </Block>
);

const renderTagsSection = (tags: AsyncApiTag[]) => (
  <Block>
    <Header>Tags</Header>
    {tags.map((tag, index, array) => (
      <Fragment key={tag.name}>
        <Section>
          <Value>{tag.name}</Value>
          {tag.description &&
            (typeof tag.description === 'string' ? (
              <Label>{tag.description}</Label>
            ) : (
              <Label>
                <Markdown source={tag.description as Node | Node[]} />
              </Label>
            ))}
          {tag.externalDocs && (
            <ExternalDocumentationWrapper>
              <ExternalDocumentation
                externalDocs={{
                  url: tag.externalDocs.url,
                  description: tag.externalDocs.description
                    ? tag.externalDocs.description.toString()
                    : undefined,
                }}
                compact
              />
            </ExternalDocumentationWrapper>
          )}
        </Section>
        {index < array.length - 1 && <Divider />}
      </Fragment>
    ))}
  </Block>
);

export const BrokerOverviewSection = ({ broker }: BrokerOverviewSectionProps) => {
  const variables = Object.entries(broker.variables || {}).map(([key, value]) => ({ key, value }));
  const hasTags = broker.tags && broker.tags.length > 0;
  const hasVariables = variables.length > 0;

  return (
    <Wrapper data-component-name="BrokerOverviewSection/BrokerOverviewSection">
      {renderInfoSection(broker)}

      {hasVariables && (
        <>
          <Divider />
          {renderVariablesSection(variables)}
        </>
      )}

      {hasTags && broker.tags && (
        <>
          <Divider />
          {renderTagsSection(broker.tags)}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
`;

const Divider = styled.div`
  border-bottom: 1px solid var(--border-color-secondary);
`;

const Variable = styled.span`
  display: flex;
  gap: var(--spacing-xxs);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
`;

const BrokerVariableName = styled(Variable)`
  padding-bottom: var(--spacing-xxs);
  font-weight: var(--font-weight-semibold);
`;

const Description = styled.p`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
  margin: 0;
`;

const TagWrapper = styled.span`
  display: flex;
  gap: var(--spacing-xxs);
  flex-wrap: wrap;
`;
