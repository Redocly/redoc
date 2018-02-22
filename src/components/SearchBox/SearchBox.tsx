import * as React from 'react';

import styled from '../../styled-components';

import { IMenuItem } from '../../services/MenuStore';
import { SearchStore } from '../../services/SearchStore';
import { MenuItem } from '../SideMenu/MenuItem';
import { MenuItemLabel } from '../SideMenu/styled.elements';
import { MarkerService } from '../../services/MarkerService';
import { SearchDocument } from '../../services/SearchWorker.worker';

const SearchInput = styled.input.attrs({
  className: 'search-input',
})`
  width: calc(100% - ${props => props.theme.spacingUnit * 2}px);
  box-sizing: border-box;
  margin: 0 ${props => props.theme.spacingUnit}px;
  padding: 5px 0 5px ${props => props.theme.spacingUnit}px;
  border: 0;
  border-bottom: 1px solid #e1e1e1;
  font-weight: bold;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  background-color: transparent;
  outline: none;
`;

const SearchIcon = styled((props: any) => (
  <svg
    className={props.className}
    version="1.1"
    viewBox="0 0 1000 1000"
    x="0px"
    xmlns="http://www.w3.org/2000/svg"
    y="0px"
  >
    <path d="M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z" />
  </svg>
)).attrs({
  className: 'search-icon',
})`
  position: absolute;
  left: ${props => props.theme.spacingUnit}px;
  height: 1.8em;
  width: 0.9em;

  path {
    fill: ${props => props.theme.colors.text};
  }
`;

const SearchResultsBox = styled.div.attrs({
  className: 'search-results',
})`
  padding: ${props => props.theme.spacingUnit / 4}px 0;
  background-color: #ededed;
  min-height: 150px;
  max-height: 250px;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  margin-top: 10px;
  line-height: 1.4;
  font-size: 0.9em;
  overflow: auto;

  ${MenuItemLabel} {
    padding-top: 6px;
    padding-bottom: 6px;

    &:hover {
      background-color: #e1e1e1;
    }

    > svg {
      display: none;
    }
  }
`;

export interface SearchBoxProps {
  search: SearchStore;
  marker: MarkerService;
  getItemById: (id: string) => IMenuItem | undefined;
  onActivate: (item: IMenuItem) => void;

  className?: string;
}

export interface SearchBoxState {
  results: any;
  term: string;
}

interface SearchResult {
  item: IMenuItem;
  score: number;
}

export class SearchBox extends React.PureComponent<SearchBoxProps, SearchBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      term: '',
    };
  }

  clearResults(term: string) {
    this.setState({
      results: [],
      term,
    });
    this.props.marker.unmark();
  }

  clear() {
    this.setState({
      results: [],
      term: '',
    });
    this.props.marker.unmark();
  }

  clearIfEsq = event => {
    if (event && event.keyCode === 27) {
      this.clear();
    }
  };

  setResults(results: SearchDocument[], term: string) {
    this.setState({
      results,
      term,
    });
    this.props.marker.mark(term);
  }

  search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    if (q.length < 3) {
      this.clearResults(q);
      return;
    }

    this.setState({
      term: q,
    });

    this.props.search.search(event.target.value).then(res => {
      this.setResults(res, q);
    });
  };

  render() {
    const results: SearchResult[] = this.state.results.map(res => ({
      item: this.props.getItemById(res.id),
      score: res.score,
    }));
    results.sort(
      (a, b) =>
        a.item.depth > b.item.depth ? 1 : a.item.depth < b.item.depth ? -1 : b.score - a.score,
    );

    return (
      <div>
        <SearchIcon />
        <SearchInput
          value={this.state.term}
          onKeyDown={this.clearIfEsq}
          placeholder="Search..."
          type="text"
          onChange={this.search}
        />
        {results.length > 0 && (
          <SearchResultsBox>
            {results.map(res => (
              <MenuItem
                item={res.item}
                onActivate={this.props.onActivate}
                withoutChildren={true}
                key={res.item.id}
              />
            ))}
          </SearchResultsBox>
        )}
      </div>
    );
  }
}
