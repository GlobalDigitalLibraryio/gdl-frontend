// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { withRouter } from 'next/router';
import { setAuthToken } from 'gdl-auth';

import { Router } from '../../routes';
import Layout from '../../components/Layout';
import Container from '../../elements/Container';
import { parseHash } from '../../lib/auth';

class Success extends React.Component<{
  router: {
    query: {
      next?: string
    }
  }
}> {
  async componentDidMount() {
    const authResult = await parseHash();
    if (authResult.accessToken) {
      setAuthToken(authResult);

      Router.pushRoute(this.props.router.query.next || '/');
    }
  }

  render() {
    return (
      <Layout>
        <Container pt={50}>
          <div css={{ textAlign: 'center' }}>
            <Trans>Logged in, please wait while we redirect you!</Trans>
          </div>
        </Container>
      </Layout>
    );
  }
}

export default withRouter(Success);
