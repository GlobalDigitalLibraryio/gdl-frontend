// @flow
import Typography from '@material-ui/core/Typography/Typography';
import Link from 'next/link';

import { search } from '../../lib/fetch';
import React, { Fragment } from 'react';
import type { Book } from '../../types';
import SearchField from './SearchField';
import SearchHit from './SearchHit';
import {Wrapper} from "./SearchHit/styled";

type State = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number
  },
  searchQuery: string,
  lastSearchQuery?: string
};

export default class SearchPage extends React.Component<{}, State> {
  state = {
    searchResult: null,
    searchQuery: '',
    lastSearchQuery: ''
  };

  handleQueryChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = async (event: Event) => {
    event.preventDefault();
    if (!this.state.searchQuery || this.state.searchQuery.trim() === '') {
      return;
    }

    const queryRes = await search(
      this.state.searchQuery,
      // $FlowFixMe: We're already checking if language is defined
      // todo: remove hardcoding
      'en',
      {
        pageSize: 10
      }
    );

    // TODO: Notify user of error
    if (!queryRes.isOk) {
      return;
    }

    const searchResult = queryRes.data;

    this.setState(state => ({
      lastSearchQuery: state.searchQuery,
      searchResult: { ...searchResult }
    }));
  };

  render() {
    return (
      <div>

          <Typography variant="headline" component="h1" gutterBottom>
              Search for a book to edit
          </Typography>

          <form onSubmit={this.handleSearch}>
          <SearchField
            id="booksearch"
            label="Search"
            onChange={this.handleQueryChange}
            placeholder="Search"
          />
        </form>

        {this.state.searchResult && (
          <Typography component="h1" align="center" variant="subheading">
            {this.state.searchResult.results.length > 0 ? (
              <Fragment>
                <strong>
                  Showing results for &quot;{this.state.lastSearchQuery}&quot;
                </strong>
              </Fragment>
            ) : (
              <p>
                No results for{' '}
                <strong>&quot;{this.state.lastSearchQuery}&quot;</strong>
              </p>
            )}
          </Typography>
        )}

        <div>
          {this.state.searchResult &&
            this.state.searchResult.results.map(book => (
              <Link
                href={{
                  pathname: '/admin/edit',
                  query: { id: book.id, lang: book.language.code }
                }}
              >
                  <div>

                  <SearchHit key={book.id} book={book} />
                  </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }
}
