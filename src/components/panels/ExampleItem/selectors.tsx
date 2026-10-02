import { useAtomValue } from 'jotai';

import type { ReactElement, ReactNode } from 'react';
import type { ExampleEntry } from '../../../types/store.js';
import type { SchemaVariantSelection } from './hooks.js';

import { exampleStoreAtom } from '../../../jotai/examples.js';
import { globalOptionsAtom, specTypeAtom } from '../../../jotai/store.js';
import { RESOURCES, useTelemetry } from '../../../telemetry/index.js';
import { useCopyCodeTelemetry } from '../../../hooks/useCopyCodeTelemetry.js';
import { MAX_DISPLAYED_STRING_LENGTH } from '../../../constants/rendering.js';
import {
  isJsonLikeMediaType,
  isSequentialMediaType,
  langFromMime,
} from '../../../utils/media-type.js';
import { StyledCodeBlock, StyledJsonViewer } from '../styled.js';
import { Markdown } from '../../common/Markdown.js';
import {
  DisabledMimeSelect,
  ExampleDescriptionWrap,
  SelectDropdownCheckmarkIcon,
  MediaTypeRow,
  SelectDropdownLabel,
  SelectDropdownMenu,
  SelectDropdownMenuItem,
  SelectDropdownTriggerButton,
  StyledSelectDropdown,
} from './styled.js';
import { DefaultMappingOptionLabel } from '../../Schema/views/DefaultMappingOptionLabel.js';
import { jsonToXml } from '../../../utils/xml.js';
import { formUrlEncodeValue } from '../../../utils/form-urlencoded.js';
import { apiSpecType } from '../../../types/common.js';

export function VariantPicker({
  selection,
  label,
}: {
  selection?: SchemaVariantSelection;
  label?: string;
}): ReactElement | null {
  if (!selection) return null;
  const { options, activeIdx, onSelect, kind, optionMeta } = selection;
  const ariaLabel = label ?? (kind === 'discriminator' ? 'Discriminator' : 'Variant');

  return (
    <MediaTypeRow>
      <PanelDropdownSelect
        value={String(activeIdx)}
        onChange={(value) => onSelect(Number(value))}
        aria-label={ariaLabel}
        options={options.map((opt, idx) => {
          const meta = optionMeta[idx];
          const labelNode: ReactNode = meta?.isDefaultMapping ? (
            <DefaultMappingOptionLabel label={opt.label} />
          ) : undefined;
          return {
            key: opt.key,
            value: String(idx),
            label: opt.label,
            labelNode,
          };
        })}
      />
    </MediaTypeRow>
  );
}

export function ExampleSelector({
  exampleIds,
  selectedIdx,
  onSelect,
}: {
  exampleIds?: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}): ReactElement | null {
  const exampleStore = useAtomValue(exampleStoreAtom);
  const specType = useAtomValue(specTypeAtom);
  const telemetry = useTelemetry();

  if (!exampleIds || exampleIds.length < 2) return null;

  const handleChange = (value: string): void => {
    const idx = Number(value);
    if (specType === apiSpecType.ASYNCAPI) {
      telemetry.sendSwitchExampleClickedMessage([
        {
          ...RESOURCES.switchExampleButton,
          index: idx,
          numberOfExamples: exampleIds.length,
        },
      ]);
    } else {
      telemetry.sendExamplesSwitcherClickedMessage([
        {
          ...RESOURCES.examplesSwitcherButton,
          exampleNumber: idx,
          totalExamples: exampleIds.length,
        },
      ]);
    }
    onSelect(idx);
  };

  return (
    <MediaTypeRow>
      <PanelDropdownSelect
        value={String(selectedIdx)}
        onChange={handleChange}
        aria-label="Example"
        options={exampleIds.map((id, idx) => ({
          key: id,
          value: String(idx),
          label: exampleStore[id]?.summary ?? `Example ${idx + 1}`,
        }))}
      />
    </MediaTypeRow>
  );
}

export function MediaTypeSelector({
  mediaTypes,
  value,
  onChange,
  label,
}: {
  mediaTypes: string[];
  value?: string;
  onChange: (mt: string) => void;
  label?: string;
}): ReactElement | null {
  if (mediaTypes.length === 0) return null;

  if (mediaTypes.length === 1) {
    return (
      <MediaTypeRow>
        <DisabledMimeSelect value={mediaTypes[0]} aria-label={label} disabled>
          <option value={mediaTypes[0]}>{mediaTypes[0]}</option>
        </DisabledMimeSelect>
      </MediaTypeRow>
    );
  }

  return (
    <MediaTypeRow>
      <PanelDropdownSelect
        value={value}
        onChange={onChange}
        aria-label={label}
        options={mediaTypes.map((mt) => ({ value: mt, label: mt }))}
      />
    </MediaTypeRow>
  );
}

export type PanelSelectOption = {
  value: string;
  label: string;
  labelNode?: ReactNode;
  key?: string;
};

export function PanelDropdownSelect({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
}: {
  value?: string;
  onChange: (value: string) => void;
  options: PanelSelectOption[];
  'aria-label'?: string;
}): ReactElement {
  const activeOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <StyledSelectDropdown
      withArrow
      alignment="start"
      portalled
      trigger={
        <SelectDropdownTriggerButton
          variant="outlined"
          size="small"
          type="button"
          aria-label={ariaLabel}
        >
          <SelectDropdownLabel>
            {activeOption?.labelNode ?? activeOption?.label}
          </SelectDropdownLabel>
        </SelectDropdownTriggerButton>
      }
    >
      <SelectDropdownMenu>
        {options.map((option) => (
          <SelectDropdownMenuItem
            key={option.key ?? option.value}
            active={option.value === activeOption?.value}
            onAction={() => onChange(option.value)}
            suffix={
              option.value === activeOption?.value ? <SelectDropdownCheckmarkIcon /> : undefined
            }
          >
            <SelectDropdownLabel>{option.labelNode ?? option.label}</SelectDropdownLabel>
          </SelectDropdownMenuItem>
        ))}
      </SelectDropdownMenu>
    </StyledSelectDropdown>
  );
}

export function ExampleDescription({
  description,
}: {
  description?: ExampleEntry['description'];
}): ReactElement | null {
  if (!description) return null;
  return (
    <ExampleDescriptionWrap>
      <Markdown source={description} />
    </ExampleDescriptionWrap>
  );
}

export function PayloadDisplay({
  payload,
  emptyMessage = '// No sample',
  mediaType,
  snippetType = 'response',
}: {
  payload: unknown;
  emptyMessage?: string;
  mediaType?: string;
  snippetType?: 'request' | 'response';
}): ReactElement {
  const { jsonSamplesExpandLevel } = useAtomValue(globalOptionsAtom);
  const onCopy = useCopyCodeTelemetry(snippetType);

  if (payload == null) {
    return <StyledCodeBlock lang="text" source={emptyMessage} header={{ controls: false }} />;
  }

  const isSequential = isSequentialMediaType(mediaType);
  const isJsonLike = isJsonLikeMediaType(mediaType);

  if (isJsonLike && !isSequential) {
    const data = typeof payload === 'string' ? (tryParseJson(payload) ?? payload) : payload;
    return (
      <StyledJsonViewer
        data={data}
        expandLevel={jsonSamplesExpandLevel}
        maxStringLength={MAX_DISPLAYED_STRING_LENGTH}
      />
    );
  }

  if (typeof payload === 'object' && payload !== null) {
    if (mediaType?.includes('xml')) {
      const xmlSource = jsonToXml(payload);
      return (
        <StyledCodeBlock
          lang="xml"
          source={xmlSource}
          highlightedHtml={escapeHtml(xmlSource)}
          header={{
            className: 'code-block-header',
            controls: { copy: { onClick: onCopy('xml') } },
          }}
        />
      );
    }
    if (isFormUrlEncodedMime(mediaType)) {
      return (
        <StyledCodeBlock
          lang="text"
          source={formUrlEncodeValue(payload)}
          header={{
            className: 'code-block-header',
            controls: { copy: { onClick: onCopy('text') } },
          }}
        />
      );
    }
    if (isSequential || (mediaType && !isJsonLike)) {
      const source = JSON.stringify(payload, null, 2);
      return (
        <StyledCodeBlock
          lang={langFromMime(mediaType)}
          source={source}
          header={{
            className: 'code-block-header',
            controls: { copy: { onClick: onCopy(langFromMime(mediaType)) } },
          }}
        />
      );
    }
    return (
      <StyledJsonViewer
        data={payload}
        expandLevel={jsonSamplesExpandLevel}
        maxStringLength={MAX_DISPLAYED_STRING_LENGTH}
      />
    );
  }

  const defaultLang = mediaType ? langFromMime(mediaType) : 'text';
  return (
    <StyledCodeBlock
      lang={defaultLang}
      source={String(payload)}
      maxDisplayLength={MAX_DISPLAYED_STRING_LENGTH}
      header={{
        className: 'code-block-header',
        controls: { copy: { onClick: onCopy(defaultLang) } },
      }}
    />
  );
}

function isFormUrlEncodedMime(mediaType: string | undefined): boolean {
  return !!mediaType && /x-www-form-urlencoded/i.test(mediaType);
}

function tryParseJson(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed || !/^[{[]/.test(trimmed)) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
