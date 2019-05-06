// @flow
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import ApolloLinkTimeout from 'apollo-link-timeout';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import { onError } from 'apollo-link-error';
import * as Sentry from '@sentry/browser';
import { persistCache } from 'apollo-cache-persist';
import localForage from 'localforage';
import { RetryLink } from 'apollo-link-retry';

import OfflineLibrary, { isCookiesEnabled } from '../lib/offlineLibrary';

const {
  publicRuntimeConfig: { graphqlEndpoint }
} = getConfig();

let apolloClient = null;

const timeoutLink = new ApolloLinkTimeout(600000); // 1min timeout
/**
 * When in offline, graphql checks first the cache then does a POST query.
 * Since there is no internet, without the retryLink it would crash.
 * This allows offline site to use the cache and retries the graphql request
 * until the user is online and fetches new data.
 */
const retry = new RetryLink({ attempts: { max: Infinity } });

const cache = new InMemoryCache({
  // Because of offline
  cacheRedirects: {
    Query: {
      chapter: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Chapter', id: args.id })
    }
  }
});

function create(initialState, { getToken }) {
  const httpLink = createHttpLink({ uri: graphqlEndpoint });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      Sentry.captureEvent({
        message: `ClientGraphQlNetworkError - ${networkError.message}`,
        extra: {
          source: networkError.source && networkError.source.body
        }
      });
    } else if (graphQLErrors) {
      graphQLErrors.forEach(clientError =>
        Sentry.captureEvent({
          message: `ClientGraphQlError - ${clientError.message}`,
          extra: {
            name:
              clientError.extensions &&
              clientError.extensions.response.body.name,
            body:
              clientError.extensions && clientError.extensions.response.body,
            positions: clientError.positions,

            source: clientError.source && clientError.source.body
          }
        })
      );
    }
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null
      }
    };
  });

  return new ApolloClient({
    fetch,
    connectToDevTools: process.browser,
    ssrMode: !Boolean(process.browser), // Disables forceFetch on the server (so queries are only run once)
    link: authLink
      .concat(retry)
      .concat(errorLink)
      .concat(timeoutLink)
      .concat(httpLink),
    cache: cache.restore(initialState || {}),
    ssrForceFetchDelay: !Boolean(process.browser)
  });
}

/**
 * To make apollo work with offline, the queries in apollo cache needs to be persisted.
 * window.__AOLLO_STATE__ provides a fresh apollo cache for every initial page visit
 * and it accumulates the apollo responses for each new client.
 */

export async function persistAndPopulateCache() {
  if (!!process.browser && isCookiesEnabled()) {
    await localForage.setItem(
      'apollo-cache-persist',
      JSON.stringify(window.__APOLLO_STATE__)
    );

    await persistCache({ cache, storage: localForage });
    // Since window.APOLLO_STATE accumulates only current apollo responses
    // all offline queries needs to be repopulated in order to make offline
    // browsing/reading of books possible.
    if (OfflineLibrary) {
      await OfflineLibrary.populateApolloCache(apolloClient);
    }
  }
}

export default function initApollo(
  initialState: ?{},
  options: { getToken: () => ?string }
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
    // The initialState does not contain queries for offline requests
    // so it needs to get repopulated
    OfflineLibrary && OfflineLibrary.populateApolloCache(apolloClient);
  }
  return apolloClient;
}
