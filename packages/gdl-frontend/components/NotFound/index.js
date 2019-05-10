// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import Taken from './Taken';
import { FormattedMessage } from 'react-intl';
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
      <Typography component="h1" align="center" variant="h4" gutterBottom>
        <FormattedMessage id="Oh no!" defaultMessage="Oh no!" />
      </Typography>
      <Typography
        component="h2"
        align="center"
        variant="subtitle1"
        gutterBottom
      >
        <FormattedMessage
          id="The page you were looking for was taken by a 404"
          defaultMessage="The page you were looking for was taken by a 404."
        />
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
          <FormattedMessage id="Take me home" defaultMessage="Take me home" />
        </A>
      </Link>
    </Container>
  </Layout>
);

export default NotFound;
