import React from 'react';
import { SearchField } from '../Search';
import { TABLET_BREAKPOINT } from '../../style/theme/misc';
import { Router } from '../../routes';
import { SEARCH_PAGE_SIZE } from '../../config';

const QUERY_PARAM = 'q';
const LANG_PARAM = 'l';

export default class NavbarSearch extends React.Component<
  Props,
  {
    searchQuery: string,
    lastSearchQuery?: string
  }
> {
  state = {
    searchResult: ''
  };

  handleSearch = async event => {
    event.preventDefault();
    if (!this.state.searchQuery || this.state.searchQuery.trim() === '') {
      return;
    }

    // On mobile, blur the input field on submit to hide the virtual keyboard
    if (window.innerWidth < TABLET_BREAKPOINT) {
      const searchInput = document.querySelector('#booksearch');
      searchInput && searchInput.blur();
    }

    Router.pushRoute(
      'search',
      {
        [QUERY_PARAM]: this.state.searchQuery,
        // $FlowFixMe: We're already checking if language is defined
        [LANG_PARAM]: this.props.languageCode
      },
      { shallow: true }
    );

    this.setState(state => ({ lastSearchQuery: state.searchQuery }));
  };

  handleQueryChange = event =>
    this.setState({ searchQuery: event.target.value });

  render() {
    return (
      <div>
        <form onSubmit={this.handleSearch} action=".">
          <SearchField
            autoFocus
            label="Search"
            id="booksearch"
            onChange={this.handleQueryChange}
            value={this.state.searchQuery}
            placeholder="Search"
          />
        </form>
      </div>
    );
  }
}
