import * as React from 'react';

import { IMenuItem } from '../../services/MenuStore';
import { SearchStore } from '../../services/SearchStore';
import { MenuItem } from '../SideMenu/MenuItem';

import { MarkerService } from '../../services/MarkerService';
import { SearchDocument } from '../../services/SearchWorker.worker';

import { ClearIcon, SearchIcon, SearchInput, SearchResultsBox } from './elements';

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

  clear = () => {
    this.setState({
      results: [],
      term: '',
    });
    this.props.marker.unmark();
  };

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

    results.sort((a, b) => b.score - a.score);

    return (
      <div>
        {this.state.term && <ClearIcon onClick={this.clear}>×</ClearIcon>}
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
