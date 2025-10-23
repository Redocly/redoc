import type { OpenAPIParser } from '../../services/OpenAPIParser.js';
import type { ContentItemModel } from '../../models/types.js';

import { useSearchDialog } from '@redocly/theme/core/openapi';

import { SearchDialog, SearchTrigger } from './index.js';
import { useSearch } from '../../hooks/useSearch.js';
import { styled } from '../../styled-components.js';
import { useTelemetry } from '../../hooks/useTelemetry.js';

export type SearchProps = {
  flatItems: ContentItemModel[];
  parser: OpenAPIParser;
};

export function Search({ flatItems, parser }: SearchProps) {
  const telemetry = useTelemetry();
  const { isOpen, onOpen, onClose } = useSearchDialog();
  const { search, isReady } = useSearch(flatItems, parser);

  return (
    <SearchWrapper>
      <SearchTrigger
        onClick={() => {
          onOpen();
          telemetry.sendSearchOpenedMessage({ method: 'click' });
        }}
        isReady={isReady}
      />
      {isOpen && <SearchDialog onClose={onClose} search={search} isReady={isReady} />}
    </SearchWrapper>
  );
}

const SearchWrapper = styled.div`
  display: flex;
  margin: var(--sidebar-margin-horizontal);
`;
