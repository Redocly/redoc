import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import type { JSX } from 'react';
import type { PageAction } from '@redocly/theme/core/types';
import type { EventPayload } from '@redocly/redoc-opentelemetry';

import { Button } from '@redocly/theme/components/Button/Button';
import { SplitButton } from '@redocly/theme/components/SplitButton/SplitButton';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { PageActionsMenuItem } from '@redocly/theme/components/PageActions/PageActionsMenuItem';
import { CopyIcon } from '@redocly/theme/icons/CopyIcon/CopyIcon';
import { ChatGptIcon } from '@redocly/theme/icons/ChatGptIcon/ChatGptIcon';
import { ClaudeIcon } from '@redocly/theme/icons/ClaudeIcon/ClaudeIcon';
import { Spinner } from '@redocly/theme/icons/Spinner/Spinner';
import { CheckmarkFilledIcon } from '@redocly/theme/icons/CheckmarkFilledIcon/CheckmarkFilledIcon';
import { ClipboardService } from '@redocly/theme/core/openapi';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';
import { useCopySpecSlice } from '../../hooks/useCopySpecSlice.js';
import {
  ASSISTANT_LINK_BASES,
  buildInlinePromptLink,
  buildFetchSpecPromptLink,
} from '../../services/spec-slice/index.js';

type CopyState = 'idle' | 'processing' | 'done';

type AssistantType = keyof typeof ASSISTANT_LINK_BASES;
type PageActionsPayload = EventPayload<'com.redocly.pageActions.clicked'>[0];
type ActionType = PageActionsPayload['actionType'];
type Outcome = PageActionsPayload['outcome'];
type Tier = NonNullable<PageActionsPayload['tier']>;

const DONE_DISPLAY_DURATION = 1000;

function resolveSpecUrl(specUrl: string | undefined): string | undefined {
  if (!specUrl) return undefined;
  try {
    return new URL(specUrl, document.baseURI).toString();
  } catch {
    return undefined;
  }
}

export function PageActions({ pageSlug }: { pageSlug: string }): JSX.Element | null {
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();
  const specSlice = useCopySpecSlice(pageSlug);
  const [state, setState] = useState<CopyState>('idle');
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(doneTimerRef.current), []);

  if (!specSlice) return null;

  const report = (actionType: ActionType, outcome: Outcome, tier?: Tier): void => {
    telemetry.sendPageActionsClickedMessage([
      {
        ...RESOURCES.pageActions,
        actionType,
        outcome,
        ...(tier ? { tier } : {}),
      },
    ]);
  };

  const handleCopy = async (): Promise<void> => {
    if (state === 'processing') return;
    setState('processing');
    try {
      const text = await specSlice.getText();
      ClipboardService.copyCustom(text);
      setState('done');
      report('copy', 'copied');
      clearTimeout(doneTimerRef.current);
      doneTimerRef.current = setTimeout(() => setState('idle'), DONE_DISPLAY_DURATION);
    } catch (error) {
      console.error(error);
      setState('idle');
      report('copy', 'failed');
    }
  };

  const openInAssistant = async (assistant: AssistantType): Promise<void> => {
    const baseUrl = ASSISTANT_LINK_BASES[assistant];
    const assistantTab = window.open('', '_blank');
    let tier: Tier | undefined;
    try {
      const text = await specSlice.getText();
      const specUrl = resolveSpecUrl(specSlice.specUrl);
      const inlineUrl = buildInlinePromptLink(baseUrl, text, specSlice.contentKind);
      const url =
        inlineUrl ??
        (specUrl ? buildFetchSpecPromptLink(baseUrl, specUrl, specSlice.scope) : undefined);
      tier = inlineUrl ? 'inline' : url ? 'fetch' : undefined;

      if (!url) {
        assistantTab?.close();
        report(assistant, 'unavailable');
        return;
      }

      if (assistantTab) {
        assistantTab.location.href = url;
      } else {
        window.open(url, '_blank');
      }
      report(assistant, 'opened', tier);
    } catch (error) {
      assistantTab?.close();
      console.error(error);
      report(assistant, 'failed', tier);
    }
  };

  const copyAction: PageAction = {
    buttonText: translate('page.actions.copyButtonText', 'Copy'),
    title: translate('page.actions.copyTitle', 'Copy for LLM'),
    description: translate(
      'page.actions.copyDescription',
      specSlice.contentKind === 'graphql'
        ? 'Copy page as GraphQL SDL for LLMs'
        : 'Copy page as YAML for LLMs',
    ),
    iconComponent: CopyIcon,
    onClick: handleCopy,
  };

  const copyButton = (
    <Button variant="outlined" icon={renderIcon(state)} onClick={handleCopy}>
      {copyAction.buttonText}
    </Button>
  );

  if (!specSlice.specUrl) {
    return <PageActionsWrapper data-testid="page-actions">{copyButton}</PageActionsWrapper>;
  }

  const actions: PageAction[] = [
    copyAction,
    {
      buttonText: translate('page.actions.claudeButtonText', 'Open in Claude'),
      title: translate('page.actions.claudeTitle', 'Open in Claude'),
      description: translate('page.actions.claudeDescription', 'Get insights from Claude'),
      iconComponent: ClaudeIcon,
      onClick: () => openInAssistant('claude'),
    },
    {
      buttonText: translate('page.actions.chatGptButtonText', 'Open in ChatGPT'),
      title: translate('page.actions.chatGptTitle', 'Open in ChatGPT'),
      description: translate('page.actions.chatGptDescription', 'Get insights from ChatGPT'),
      iconComponent: ChatGptIcon,
      onClick: () => openInAssistant('chatgpt'),
    },
  ];

  const menuItems = actions.map((action, index) => (
    <DropdownMenuItem
      key={`${action.title}-${index}`}
      onAction={() => ('onClick' in action ? action.onClick() : undefined)}
    >
      <PageActionsMenuItem pageAction={action} />
    </DropdownMenuItem>
  ));

  return (
    <PageActionsWrapper data-testid="page-actions">
      <SplitButton
        portalled
        variant="outlined"
        size="medium"
        toggleAriaLabel={translate('page.actions.moreActions', 'More actions')}
        button={copyButton}
      >
        <StyledDropdownMenu>{menuItems}</StyledDropdownMenu>
      </SplitButton>
    </PageActionsWrapper>
  );
}

function renderIcon(state: CopyState): JSX.Element {
  switch (state) {
    case 'processing':
      return <Spinner color="var(--page-actions-processing-icon-color)" />;
    case 'done':
      return <CheckmarkFilledIcon color="var(--page-actions-done-icon-color)" />;
    default:
      return <CopyIcon />;
  }
}

const PageActionsWrapper = styled.div`
  margin-left: auto;
  padding-left: var(--page-actions-padding-left);
  --button-color: var(--page-actions-button-text-color);

  .button-group-size-medium .button.button-size-medium {
    --button-icon-left-padding: var(--page-actions-button-padding);
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  --dropdown-menu-max-height: var(--page-actions-dropdown-max-height);
`;
