// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import H1 from '../components/H1';
import A from '../components/A';
import Container from '../components/Container';
import { Link } from '../routes';

type Props = {
  statusCode: ?number,
  showNavbar: boolean,
};

export default class Error extends React.Component<Props> {
  static defaultProps = {
    showNavbar: true,
  };

  render() {
    const { statusCode, showNavbar } = this.props;
    // FIXME: lang prop in navbar here :/
    return (
      <div>
        {showNavbar && <Navbar lang="eng" />}
        <Container mt={[15, 40]}>
          <Card px={17} py={24} textAlign="center">
            <H1>
              {statusCode === 404 ? (
                <Trans>This page could not be found</Trans>
              ) : (
                <Trans>An unexpected error has occurred</Trans>
              )}
            </H1>
            {statusCode && (
              <Card
                fontSize={[40, 60]}
                h={[188, 247]}
                w={[152, 200]}
                mx="auto"
                mb={20}
                style={{
                  background: '#DA3D34',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {statusCode}
              </Card>
            )}
            <Link route="books" passHref>
              <A>
                <Trans>Go to start page</Trans>
              </A>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }
}
