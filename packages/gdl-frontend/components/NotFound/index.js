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

import Container from '../../elements/Container';
import A from '../../elements/A';
import Text from '../../elements/Text';
import Head from '../Head';
import Layout from '../Layout';
import { fonts, spacing } from '../../style/theme/';

const NotFound = () => (
  <Layout>
    <Head title="Page not found" />
    <Container>
      <Text accessibilityRole="heading" textAlign="center" {...headerStyles}>
        <Trans>Oh no!</Trans>
      </Text>
      <Text
        accessibilityRole="heading"
        aria-level="2"
        {...headerStyles}
        style={{ marginTop: '0' }}
      >
        <Trans>The page you were looking for was taken by a 404.</Trans>
      </Text>
      <div style={{ textAlign: 'center' }}>
        <Taken height="100%" />
      </div>
      <Link href="/" passHref>
        <A textAlign="center" my={spacing.medium}>
          <Trans>Take me home</Trans>
        </A>
      </Link>
    </Container>
  </Layout>
);

const headerStyles = {
  textAlign: 'center',
  display: 'block',
  fontWeight: fonts.weight.medium,
  my: spacing.medium
};

export default NotFound;
