import type { OpenAPIParser } from '../../services/OpenAPIParser.js';
import type { ContentItemModel } from '../../models/types.js';

import { useSearchDialog, SearchSessionProvider } from '@redocly/theme/core/openapi';

import { SearchDialog, SearchTrigger } from './index.js';
import { useSearch } from '../../hooks/useSearch.js';
import { styled } from '../../styled-components.js';
import { useTelemetry } from '../../hooks/useTelemetry.js';

export type SearchProps = {
  flatItems: ContentItemModel[];
  parser: OpenAPIParser;
};

function SearchContent({ flatItems, parser }: SearchProps) {
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

export function Search(props: SearchProps) {
  return (
    <SearchSessionProvider>
      <SearchContent {...props} />
    </SearchSessionProvider>
  );
}

const SearchWrapper = styled.div`
  display: flex;
  margin: var(--sidebar-margin-horizontal);
`;
