// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';

import Safe from './undraw_safe.svg';
import Container from '../Container';
import H1 from '../H1';
import A from '../A';
import Head from '../Head';
import Layout from '../Layout';

import Link from 'next/link';

const NotFound = () => (
  <Layout>
    <Head title="No access" />
    <Container>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <H1>
          <Trans>Sorry, you don’t have access to this page</Trans>
        </H1>
        <div style={{ margin: '2rem 0' }}>
          <Safe style={{ maxWidth: '100%', height: 'auto' }} />
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
