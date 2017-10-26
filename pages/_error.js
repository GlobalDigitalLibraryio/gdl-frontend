// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import defaultPage from '../hocs/defaultPage';
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

class Error extends React.Component<Props> {
  static defaultProps = {
    showNavbar: true,
  };

  static async getInitialProps({
    res,
    jsonPageRes,
  }: {
    res?: *,
    jsonPageRes?: *,
  }) {
    let statusCode;
    if (res && res.statusCode) {
      statusCode = res.statusCode;
    } else if (jsonPageRes && jsonPageRes.status) {
      statusCode = jsonPageRes.status;
    }

    return {
      statusCode,
    };
  }

  render() {
    const { statusCode, showNavbar } = this.props;
    return (
      <div>
        {showNavbar && <Navbar />}
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

const ErrorPage = defaultPage(Error);

// Export both as a regular component and as a top level page wrapped in i18n, themes etc.
export { Error, ErrorPage as default };
