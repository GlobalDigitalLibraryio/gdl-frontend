// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { Typography } from '@material-ui/core';

import type { Book } from '../types';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container } from '../elements';
import { spacing, colors } from '../style/theme';
import { withMuiRoot } from '../hocs';

type State = {};

class FavoritesPage extends React.Component<{}, State> {
  state = {};

  render() {
    return (
      <>
        <Head title="Favorites" />
        <Layout crumbs={[<Trans>My favorites</Trans>]}>
          <Typography>Favorites</Typography>
        </Layout>
      </>
    );
  }
}

export default withMuiRoot(FavoritesPage);
