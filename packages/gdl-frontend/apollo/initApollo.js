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
import OfflineLibrary from '../lib/offlineLibrary';
import { RetryLink } from 'apollo-link-retry';

const {
  publicRuntimeConfig: { graphqlEndpoint }
} = getConfig();

let apolloClient = null;

const timeoutLink = new ApolloLinkTimeout(600000); // 1min timeout
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
    connectToDevTools: process.browser,
    ssrMode: !Boolean(process.browser), // Disables forceFetch on the server (so queries are only run once)
    link: authLink
      .concat(retry)
      .concat(errorLink)
      .concat(timeoutLink)
      .concat(httpLink),
    cache: cache.restore(initialState || {}),
    fetch,
    ssrForceFetchDelay: !Boolean(process.browser)
  });
}

const isCookiesEnabled = () => {
  let cookieEnabled = typeof window !== 'undefined' && navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
  }
  return cookieEnabled;
};

export async function loadCache() {
  if (!!process.browser && isCookiesEnabled()) {
    await localForage.setItem(
      'apollo-cache-persist',
      JSON.stringify(window.__APOLLO_STATE__)
    );
    await persistCache({
      cache,
      storage: localForage
    });
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
    OfflineLibrary && OfflineLibrary.populateApolloCache(apolloClient);
  }
  return apolloClient;
}
