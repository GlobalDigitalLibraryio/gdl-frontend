// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import defaultPage from '../../hocs/defaultPage';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import {
  extractInfoFromHash,
  setToken,
  parseHash,
} from '../../lib/auth/authHelpers';

class Success extends React.Component {
  async componentDidMount() {
    // const { query: { access_token } } = this.props.url;
    // const { token } = extractInfoFromHash();
    const authResult = await parseHash();
    console.log(authResult);
    if (authResult.idToken) {
      setToken(authResult.idToken);
    }
  }

  render() {
    const { i18n } = this.props;

    return (
      <Layout>
        <Meta title={i18n.t`Login`} description={i18n.t`Login`} />
        <Container>You are logged in bro!</Container>
      </Layout>
    );
  }
}

export default defaultPage(Success);
