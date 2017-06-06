import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Router from 'next/router';

import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { Pagination, Results } from '../components/pages/PartnerSearch/';
import { Container, Input, Button, Group, Level, P5, Section } from '../components/generic';

const API_KEY = 'AIzaSyCV5jNMGhZuXpqxDPCHkyC8HP9QShrN4mw';
const SEARCH_ENGINE_ID = '001504581191494847575:s0_xqdo7npy';
const PAGE_SIZE = 10; // Valid values are 1-10

const FilterContainer = ({ id, className, children, ...props }) => (
  <label htmlFor={id} className={className}>
    <input id={id} type="radio" name="filter" {...props} />
    <span>{children}</span>
  </label>
);

FilterContainer.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

const Filter = styled(FilterContainer)`
  & input {
    visibility: hidden;
  }

  & input:checked + span {
    font-weight: bold;
  }

  &:not(:last-child) {
    margin-right: 0.75rem;
  }
`;

const filters = {
  all: { name: 'All', more: '' },
  storyweaver: { name: 'StoryWeaver', more: 'more:storyweaver' },
  africanstorybook: { name: 'African Storybook', more: 'more:africanstorybook' },
  letsreadbooksorg: { name: "Let's Read", more: 'more:letsreadbooksorg' },
  bookshare: { name: 'Bookshare', more: 'more:bookshare' },
  bookdash: { name: 'Bookdash', more: 'more:bookdash' },
  pustakalaya: { name: 'Pustakalaya', more: 'more:pustakalaya' },
};

export default class PartnerSearch extends React.Component {
  static async getInitialProps({ query }) {
    const { q, more: filter, start = 1 } = query; // start = 1 if undefined
    if (q) {
      // If start is less than 1, Google throws
      const more = filter in filters ? filters[filter].more : '';
      const safeStart = start >= 1 ? start : 1;
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&start=${safeStart}&prettyPrint=false&num=${PAGE_SIZE}&q=${q} ${more}`);
      const json = await res.json();

      let totalResults;
      let lastPage;
      let page;
      let from;
      let to;

      if (json.queries.request) {
        const request = json.queries.request[0];
        totalResults = request.totalResults;
        lastPage = Math.ceil(totalResults ? totalResults / PAGE_SIZE : 1);
        from = request.startIndex;
        to = from + request.count - 1;
        page = Math.ceil(from / 10);
      }

      return { results: json, q, totalResults, lastPage, from, to, page };
    }
    return {};
  }

  state = {
    q: this.props.q,
    filter: this.props.more || 'all',
  }

  onSearch = (event) => {
    event.preventDefault();
    this.doSearch();
  }

  onFilterChange = (event) => {
    if (this.state.q) {
      this.setState({ filter: event.target.value }, () => this.doSearch());
    } else {
      this.setState({ filter: event.target.value });
    }
  }

  doSearch() {
    const { url } = this.props;
    const filter = this.state.filter && this.state.filter !== '' ? `&more=${this.state.filter}` : '';
    const href = `${url.pathname}?q=${this.state.q}${filter}`;
    Router.push(href);
  }

  render() {
    const { results, url, page, lastPage } = this.props;

    return (
      <Layout title="Partner Search - Global Digital Library">
        <Hero>
          <Hero.Body>
            <Container>
              <form onSubmit={this.onSearch}>
                <Group>
                  <Input expanded type="search" name="q" placeholder="Search for books" value={this.state.q} onChange={event => this.setState({ q: event.target.value })} />
                  <Button type="submit" disabled={this.state.q === ''}>Search</Button>
                </Group>
                <Level>
                  {Object.entries(filters).map(([key, value]) => (
                    <Level.Item key={key}><Filter id={key} value={key} onChange={this.onFilterChange} checked={this.state.filter === key}>{value.name}</Filter></Level.Item>
                  ))}
                </Level>
              </form>
            </Container>
          </Hero.Body>
        </Hero>

        <Section>
          <Container>
            {results &&
              results.items &&
              <P5 textCentered>
                Showing {this.props.from}-{this.props.to} of {this.props.totalResults} results
              </P5>}
            {results && results.items ? <Results items={results.items} /> : <P5 textCentered>No results</P5>}

            {results && results.items && lastPage !== 1 && <Pagination url={url} page={page} lastPage={lastPage} />}
          </Container>
        </Section>
      </Layout>
    );
  }
}

PartnerSearch.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.shape({
      q: PropTypes.string,
      start: PropTypes.number,
    }).isRequired,
  }).isRequired,
  q: PropTypes.string, // Initial search query in URL
  more: PropTypes.oneOf(['', 'storyweaver', 'africanstorybook', 'letsreadbooksorg', 'bookdash', 'bookshare']).isRequired,
  totalResults: PropTypes.string,
  from: PropTypes.number,
  to: PropTypes.number,
  page: PropTypes.number,
  lastPage: PropTypes.number,
  results: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        cacheId: PropTypes.string.isRequired,
      }),
    ),
    queries: PropTypes.shape({
      request: PropTypes.arrayOf(
        PropTypes.shape({
          count: PropTypes.number.isRequired,
          startIndex: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }),
};

PartnerSearch.defaultProps = {
  more: '',
};
