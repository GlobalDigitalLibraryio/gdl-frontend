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

import Safe from './undraw_safe.svg';
import Container from '../Container';
import A from '../../elements/A';
import Head from '../Head';
import Layout from '../Layout';

import Link from 'next/link';

const NotFound = () => (
  <Layout>
    <Head title="No access" />
    <Container>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="headline">
          <Trans>Sorry, you don’t have access to this page</Trans>
        </Typography>
        <div style={{ margin: '2rem 0' }}>
          <Safe style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <Link href="/" passHref>
          <A>
            <Trans>Take me home</Trans>
          </A>
        </Link>
      </div>
    </Container>
  </Layout>
);

export default NotFound;
