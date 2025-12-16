import { memo, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';

import type { TFunction } from '@redocly/theme/core/openapi';
import type { MutableRefObject, PropsWithChildren, ReactElement } from 'react';
import type { SelectProps } from '../common/index.js';
import type { MediaContentModel, MediaTypeModel } from '../../models/index.js';

import { SelectLabel, SelectWrapper } from '../PayloadSamples/index.js';
import { Container } from '../common/index.js';
import { activeMimeNameAtom } from '../../jotai/app.js';
import { getActiveMediaType } from '../../models/index.js';
import { useTranslate } from '../../hooks/index.js';

interface MediaTypesSwitchProps {
  content?: MediaContentModel;
  withLabel?: boolean;

  renderSelect: (props: SelectProps) => ReactElement | null;
  children: (activeMime: MediaTypeModel) => ReactElement;
}

function Wrapper({
  children,
  withLabel,
  innerRef,
  translate,
}: PropsWithChildren<{
  withLabel?: boolean;
  innerRef: MutableRefObject<HTMLDivElement | null>;
  translate: TFunction;
}>) {
  if (!children) {
    return null;
  }

  return withLabel ? (
    <SelectWrapper ref={innerRef}>
      <SelectLabel>{translate('openapi.contentType', 'Content type')}</SelectLabel>
      {children}
    </SelectWrapper>
  ) : (
    <Container ref={innerRef}>{children}</Container>
  );
}

function MediaTypesSwitchComponent({
  content,
  withLabel,
  renderSelect,
  children,
}: MediaTypesSwitchProps): ReactElement | null {
  const translate = useTranslate();
  const [activeMimeName, setActiveMimeName] = useAtom(activeMimeNameAtom);

  const switchMedia = useCallback(
    ({ value }) => {
      /* istanbul ignore next (this can never happen, just to make ts happy, this is callback) */
      if (!content || !ref.current) return null;
      const initialOffset = ref.current.getBoundingClientRect().y;
      setActiveMimeName(value);

      requestAnimationFrame(() => {
        /* istanbul ignore next (this can never happen, just to make ts happy, this is callback) */
        if (!ref.current || initialOffset == null) return;
        const updatedOffset = ref.current.getBoundingClientRect().y;
        window.scrollBy(0, updatedOffset - initialOffset); // TODO: refactor to use ScrollService (make it singleton)
      });
    },
    [content, setActiveMimeName],
  );

  const ref = useRef<HTMLDivElement | null>(null);

  if (!content || !content.mediaTypes || !content.mediaTypes.length) {
    return null;
  }

  const options = content.mediaTypes.map((mime, idx) => {
    return {
      value: mime.name,
      idx,
    };
  });

  const active = getActiveMediaType(content, activeMimeName);

  return (
    <>
      <Wrapper innerRef={ref} withLabel={withLabel} translate={translate}>
        {renderSelect({
          value: active.name,
          options,
          onChange: switchMedia,
          ariaLabel: 'Content type',
        })}
      </Wrapper>
      {children(active)}
    </>
  );
}

export const MediaTypesSwitch = memo<MediaTypesSwitchProps>(MediaTypesSwitchComponent);
