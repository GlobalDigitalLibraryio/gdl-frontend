// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import { MdArrowDownward } from 'react-icons/lib/md';
import { fetchBook } from '../../fetch';
import type { Book, RemoteData } from '../../types';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import H1 from '../../components/H1';
import P from '../../components/P';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import theme from '../../style/theme';

type Props = {
  book: RemoteData<Book>,
};

class TranslatePage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken }) {
    const [book] = await Promise.all([
      fetchBook(query.id, query.lang)(accessToken),
    ]);

    return {
      book,
    };
  }

  render() {
    const { book } = this.props;

    return (
      <Layout currentPage={book.title} language={book.language}>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Container py={[15, 20]}>
          <Card p={[15, 20]}>
            <H1>{book.title}</H1>
            <P>
              <Trans>from {book.publisher.name}</Trans>
            </P>
          </Card>
          <Box textAlign="center">
            <P>
              <Trans>
                Translate from <strong>{book.language.name}</strong>
              </Trans>
            </P>
            <MdArrowDownward color={theme.colors.oranges.orange} />
            <P>
              <Trans>
                Translate to <strong>Amharic</strong>
              </Trans>
            </P>
          </Box>
          <P>
            <small>
              <Trans>
                Opens 3rd party site{' '}
                <a
                  href="https://crowdin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Crowdin
                </a>{' '}
                in a new window. You need a free account to link services.
              </Trans>
            </small>
          </P>
        </Container>
      </Layout>
    );
  }
}

export default securePage(TranslatePage);
