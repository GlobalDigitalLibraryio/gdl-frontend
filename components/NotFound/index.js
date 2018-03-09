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

import Container from '../Container';
import H1 from '../H1';
import H3 from '../H3';
import A from '../A';
import Head from '../Head';
import Layout from '../Layout';

import Link from 'next/link';

const H2 = H3.withComponent('h2');

const NotFound = () => (
  <Layout>
    <Head title="Page not found" />
    <Container>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <H1>
          <Trans>Oh no!</Trans>
        </H1>
        <H2>
          <Trans>The page you were looking for was taken by a 404.</Trans>
        </H2>
        <div style={{ marginBottom: '1rem' }}>
          <Taken />
        </div>
        <Link href="/" passHref>
          <A isBold>
            <Trans>Take me home</Trans>
          </A>
        </Link>
      </div>
    </Container>
  </Layout>
);

export default NotFound;
