// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/browser';
import { hasAuthToken } from 'gdl-auth';

const QUERY = gql`
  query currentUser {
    currentUser {
      isAdmin
    }
  }
`;

const QueryIsAdmin = ({
  children,
  ...props
}: {
  children: any => React.Node
}) =>
  // Query require a JWT token
  hasAuthToken() ? (
    <Query query={QUERY} {...props}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error)
          Sentry.captureEvent({
            message: `AdminQuery - ${error.message}`,
            extra: {
              source: error.source && error.source.body
            }
          });

        const isAdmin = data && data.currentUser && data.currentUser.isAdmin;
        return isAdmin ? children({ isAdmin }) : null;
      }}
    </Query>
  ) : null;

export default QueryIsAdmin;
