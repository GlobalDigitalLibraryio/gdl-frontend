// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Taken from './Taken';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import { Typography } from '@material-ui/core';

import Container from '../../elements/Container';
import A from '../../elements/A';
import Head from '../Head';
import Layout from '../Layout';
import { spacing } from '../../style/theme/';

const NotFound = () => (
  <Layout>
    <Head title="Page not found" />
    <Container my="30px">
      <Typography component="h1" align="center" variant="headline" gutterBottom>
        <Trans>Oh no!</Trans>
      </Typography>
      <Typography
        component="h2"
        align="center"
        variant="subheading"
        gutterBottom
      >
        <Trans>The page you were looking for was taken by a 404.</Trans>
      </Typography>
      <div
        css={{
          textAlign: 'center',
          marginTop: spacing.medium,
          marginBottom: spacing.medium
        }}
      >
        <Taken height="100%" />
      </div>
      <Link href="/" passHref>
        <A align="center">
          <Trans>Take me home</Trans>
        </A>
      </Link>
    </Container>
  </Layout>
);

export default NotFound;
