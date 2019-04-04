// @flow
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import Head from 'next/head';
import { getAuthToken } from 'gdl-auth';
import type { ApolloClient } from 'react-apollo';

import initApollo, { something } from './initApollo';

type Props = {
  apolloState: any
};

export default (App: React.ComponentType<*>) => {
  return class WithData extends React.Component<Props> {
    static async getInitialProps(ctx: any) {
      const {
        Component,
        router,
        ctx: { req, res }
      } = ctx;
      await something();
      const apollo = initApollo({}, { getToken: () => getAuthToken(req) });
      ctx.ctx.apolloClient = apollo;

      let appProps = {};
      // $FlowFixMe: Flow doesn't approve of this method method on the React component type
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(ctx);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      if (!process.browser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    apolloClient: ApolloClient;

    constructor(props: Props) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, {
        getToken: getAuthToken
      });
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
