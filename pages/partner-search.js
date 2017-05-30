import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { Group } from '../components/Control';
import Section from '../components/Section';
import Container from '../components/Container';
import Results from '../components/PartnerSearch/Results';
import { P5 } from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';
import Pagination from '../components/Pagination';

const API_KEY = 'AIzaSyCV5jNMGhZuXpqxDPCHkyC8HP9QShrN4mw';
const SEARCH_ENGINE_ID = '001504581191494847575:s0_xqdo7npy';
const PAGE_SIZE = 10; // Valid values are 1-10

const FilterContainer = ({ id, children, ...props }) => (
  <label>
    <input type="radio" name="filter" {...props} />
    {children}
  </label>
);

const Filter = styled(FilterContainer)`
  color: red;
  & input {
    visibility: hidden;
  }
  &:not(:last-child) {
    margin-right: 0.75rem;
  }
`;

const PaginationLink = ({ url, start, active, ...props }) => (
  <Link href={{ pathname: url.pathname, query: { ...url.query, start } }}>
    <Pagination.Item active={active} {...props} />
  </Link>
);

PaginationLink.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.shape({
      q: PropTypes.string,
      start: PropTypes.number,
    }).isRequired,
  }).isRequired,
  start: PropTypes.number.isRequired,
  active: PropTypes.bool,
};

PaginationLink.defaultProps = {
  active: false,
};

export default class PartnerSearch extends React.Component {
  static async getInitialProps({ query }) {
    const { q, start = 1 } = query; // start = 1 if undefined
    if (q) {
      // If start is less than 1, Google throws
      const safeStart = start >= 1 ? start : 1;
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&start=${safeStart}&prettyPrint=false&num=${PAGE_SIZE}&q=${q}`);
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

  onSearch = (event) => {
    event.preventDefault();
    const { url } = this.props;
    const href = `${url.pathname}?q=${this.search.value}`;
    Router.push(href);
  };

  render() {
    const { results, url, page, lastPage } = this.props;

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
                    defaultValue={this.props.q}
                    innerRef={(search) => {
                      this.search = search;
                    }}
                  />
                  <Button type="submit">Search</Button>
                </Group>
              </form>
            </Container>
          </Hero.Body>
        </Hero>

        <Container>
          <Filter defaultChecked value="all">All</Filter>
          <Filter value="more:storyweaver">StoryWeaver</Filter>
          <Filter value="more:africanstorybook">African Storybook</Filter>
          <Filter value="more:letsreadbooksorg">Let's Read</Filter>
          <Filter value="more:bookdash">Bookdash</Filter>
          <Filter value="more:bookshare">Bookshare</Filter>
        </Container>

        <Section>
          <Container>
            {results &&
              results.items &&
              <P5 textCentered>
                Showing {this.props.from}-{this.props.to} of {this.props.totalResults} results
              </P5>}
            {results && results.items ? <Results items={results.items} /> : <P5 textCentered>No results</P5>}

            {results &&
              results.items &&
              lastPage !== 1 &&
              <Pagination>
                {page !== 1 && <PaginationLink aria-label="Previous" url={url} start={(page - 1) * 10}>&lt;</PaginationLink>}

                {page > 2 && [<PaginationLink url={url} key="first" start={0}>1</PaginationLink>, <Pagination.Item key="ellipsis" ellipsis />]}

                {page !== 1 &&
                  <PaginationLink url={url} start={(page - 1) * 10}>
                    {page - 1}
                  </PaginationLink>}

                <PaginationLink active url={url} start={page * 10}>
                  {page}
                </PaginationLink>

                {lastPage !== page &&
                  <PaginationLink url={url} start={(page + 1) * 10}>
                    {page + 1}
                  </PaginationLink>}

                {lastPage !== page && <PaginationLink ara-label="Next" url={url} start={(page + 1) * 10}>&gt;</PaginationLink>}
              </Pagination>}
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
  totalResults: PropTypes.number,
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
