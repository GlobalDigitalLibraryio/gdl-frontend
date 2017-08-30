import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Router from 'next/router';

import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { Pagination, Results } from '../components/pages/PartnerSearch/';
import {
  Container,
  Input,
  Button,
  Group,
  Level,
  P5,
  Section
} from '../components/generic';

const API_KEY = 'AIzaSyCV5jNMGhZuXpqxDPCHkyC8HP9QShrN4mw';
const SEARCH_ENGINE_ID = '001504581191494847575:s0_xqdo7npy';
const PAGE_SIZE = 10; // Valid values are 1-10

const FilterContainer = ({ id, className, name, children, ...props }) => (
  <label htmlFor={id} className={className}>
    <input id={id} type="checkbox" name={name} {...props} />
    <span>{children}</span>
  </label>
);

FilterContainer.propTypes = {
  className: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

const Filter = styled(FilterContainer)`
  & input {
    visibility: hidden;
  }

  & input + span {
    color: whitesmoke;
    cursor: pointer;
  }

  & input:checked + span {
    font-weight: bold;
    color: white;
    text-decoration: underline;
  }

  &:not(:last-child) {
    margin-right: 0.75rem;
  }
`;

const siteFilters = {
  // all: { name: 'All', more: '' },
  storyweaver: { name: 'StoryWeaver', site: 'site:storyweaver.org.in' },
  africanstorybook: {
    name: 'African Storybook',
    site: 'site:africanstorybook.org'
  },
  letsreadbooksorg: {
    name: 'Let\'s Read',
    site: 'site:letsreadbooksorg.wordpress.com'
  },
  bookshare: { name: 'Bookshare', site: 'site:www.bookshare.org' },
  bookdash: { name: 'Bookdash', site: 'site:bookdash.org' },
  pustakalaya: { name: 'Pustakalaya', site: 'site:pustakalaya.org' }
};

// Handles none, single or multiple site parameters
function getSiteFiltering(site) {
  if (!site) {
    return '';
  } else if (Array.isArray(site)) {
    return site.map(s => siteFilters[s].site).join(' OR ');
  }

  return siteFilters[site] ? siteFilters[site].site : '';
}

// Accepts null, a string, or an array of string and returns an array
function toArray(site) {
  if (!site) {
    return [];
  } else if (Array.isArray(site)) {
    return site;
  }
  return [site];
}

export default class PartnerSearch extends React.Component {
  static async getInitialProps({ query }) {
    const { q, site, start = 1 } = query; // start = 1 if undefined

    if (q) {
      const filter = getSiteFiltering(site);
      // If start is less than 1, Google throws
      const safeStart = start >= 1 ? start : 1;
      const sites = toArray(site);
      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&start=${safeStart}&prettyPrint=false&num=${PAGE_SIZE}&q=${q} ${filter}`
        );
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

        return {
          results: json,
          q,
          totalResults,
          lastPage,
          from,
          to,
          page,
          sites
        };
      } catch (err) {
        return { err, q, sites };
      }
    }

    return {};
  }

  state = {
    q: this.props.q,
    sites: this.props.sites.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, {})
  };

  onSearch = event => {
    event.preventDefault();
    this.doSearch();
  };

  onFilterChange = event => {
    const { checked, name } = event.target;
    if (this.state.q) {
      this.setState(
        state => ({ sites: { ...state.sites, [name]: checked } }),
        () => this.doSearch()
      );
    } else {
      this.setState(state => ({ sites: { ...state.sites, [name]: checked } }));
    }
  };

  onAllChange = () => {
    if (this.state.q) {
      this.setState({ sites: {} }, () => this.doSearch());
    } else {
      this.setState({ sites: {} });
    }
  };

  doSearch() {
    const { url } = this.props;
    // Generate a query string for the selected sites
    const filter = Object.entries(this.state.sites)
      .filter(([, value]) => value)
      .map(([key]) => `&site=${key}`)
      .join('');

    const href = `${url.pathname}?q=${this.state.q}${filter}`;
    Router.push(href);
  }

  render() {
    const { results, url, page, lastPage, err } = this.props;

    return (
      <Layout title="Partner Search - Global Digital Library">
        <Hero>
          <Hero.Body>
            <Container>
              <form onSubmit={this.onSearch}>
                <Group>
                  <Input
                    expanded
                    type="search"
                    name="q"
                    placeholder="Search for books"
                    value={this.state.q}
                    onChange={event => this.setState({ q: event.target.value })}
                  />
                  <Button type="submit" disabled={this.state.q === ''}>
                    Search
                  </Button>
                </Group>
                <Level>
                  <Level.Item>
                    <Filter
                      id="all"
                      onChange={this.onAllChange}
                      checked={!Object.values(this.state.sites).includes(true)}
                      name="all"
                    >
                      All
                    </Filter>
                  </Level.Item>
                  {Object.entries(siteFilters).map(([key, value]) => (
                    <Level.Item key={key}>
                      <Filter
                        id={key}
                        name={key}
                        onChange={this.onFilterChange}
                        checked={this.state.sites[key] || false}
                      >
                        {value.name}
                      </Filter>
                    </Level.Item>
                  ))}
                </Level>
              </form>
            </Container>
          </Hero.Body>
        </Hero>

        <Section>
          <Container>
            {err && (
              <P5 textCentered>
                An error occurred while searching. Please try again.
              </P5>
            )}

            {results &&
            results.items && (
              <P5 textCentered>
                Showing {this.props.from}-{this.props.to} of{' '}
                {this.props.totalResults} results
              </P5>
            )}

            {results && results.items ? (
              <Results items={results.items} />
            ) : (
              <P5 textCentered>No results</P5>
            )}

            {results &&
            results.items &&
            lastPage !== 1 && (
              <Pagination url={url} page={page} lastPage={lastPage} />
            )}
          </Container>
        </Section>
      </Layout>
    );
  }
}

PartnerSearch.propTypes = {
  err: PropTypes.object,
  sites: PropTypes.arrayOf(PropTypes.string).isRequired,
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.shape({
      q: PropTypes.string,
      start: PropTypes.string
    }).isRequired
  }).isRequired,
  q: PropTypes.string.isRequired, // Initial search query in URL
  totalResults: PropTypes.string,
  from: PropTypes.number,
  to: PropTypes.number,
  page: PropTypes.number,
  lastPage: PropTypes.number,
  results: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        cacheId: PropTypes.string.isRequired
      })
    ),
    queries: PropTypes.shape({
      request: PropTypes.arrayOf(
        PropTypes.shape({
          count: PropTypes.number.isRequired,
          startIndex: PropTypes.number.isRequired
        })
      ).isRequired
    }).isRequired
  })
};

PartnerSearch.defaultProps = {
  err: null,
  q: '',
  sites: []
};
