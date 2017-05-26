import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { Group } from '../components/Control';
import Section from '../components/Section';
import Container from '../components/Container';
import Result from '../components/PartnerSearch/Result';
import Columns, { Column } from '../components/Columns';
import Input from '../components/Input';
import Button from '../components/Button';
import Pagination from '../components/Pagination';

const API_KEY = 'AIzaSyCV5jNMGhZuXpqxDPCHkyC8HP9QShrN4mw';
const SEARCH_ENGINE_ID = '001504581191494847575:s0_xqdo7npy';
const PAGE_SIZE = 10; // Valid values are 1-10

export default class PartnerSearch extends React.Component {
  static async getInitialProps({ query }) {
    const { q, p = 1 } = query; // Initial page = 1 if undefined
    if (q) {
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${q}&start=${p}&prettyPrint=false&num=${PAGE_SIZE}`);
      const json = await res.json();
      return { results: json, q };
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
    const { results } = this.props;
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
        <Section>
          <Container>
            {results &&
              results.items &&
              <span>
                Showing {results.queries.request[0].startIndex}-{results.queries.request[0].startIndex + results.queries.request[0].count - 1} of {results.queries.request[0].totalResults} results
              </span>}
            <Columns multiline>
              {results && results.items && results.items.map(item => <Column size="4" tablet="4" desktop="3" key={item.cacheId}><Result key={item.cacheId} item={item} /></Column>)}
            </Columns>
            <Pagination>
              <Pagination.Item>Previous</Pagination.Item>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>Next</Pagination.Item>
            </Pagination>
            {results && !results.items ? 'No results' : null}
          </Container>
        </Section>
      </Layout>
    );
  }
}

PartnerSearch.propTypes = {
  q: PropTypes.string, // Initial search query in URL
  p: PropTypes.string, // Pagination
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
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
          totalResults: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }),
};
