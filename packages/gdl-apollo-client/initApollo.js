// @flow
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import ApolloLinkTimeout from 'apollo-link-timeout';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import { onError } from 'apollo-link-error';
import * as Sentry from '@sentry/browser';

const {
  publicRuntimeConfig: { graphqlEndpoint }
} = getConfig();

let apolloClient = null;

const timeoutLink = new ApolloLinkTimeout(10000); // 10 second timeout

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
          message: `ClientGrapQlError - ${clientError.message}`,
          extra: {
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
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink
      .concat(errorLink)
      .concat(timeoutLink)
      .concat(httpLink),
    cache: new InMemoryCache({
      // Because of offline
      cacheRedirects: {
        Query: {
          chapter: (_, args, { getCacheKey }) =>
            getCacheKey({ __typename: 'Chapter', id: args.id })
        }
      }
    }).restore(initialState || {}),
    fetch
  });
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
  }

  return apolloClient;
}
