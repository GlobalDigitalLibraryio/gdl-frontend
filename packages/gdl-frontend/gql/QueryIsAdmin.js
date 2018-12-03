// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
}) => (
  <Query query={QUERY} {...props}>
    {({ loading, error, data }) => {
      if (loading || error) return null;
      const isAdmin = data && data.currentUser && data.currentUser.isAdmin;
      return isAdmin ? children({ isAdmin }) : null;
    }}
  </Query>
);

export default QueryIsAdmin;
