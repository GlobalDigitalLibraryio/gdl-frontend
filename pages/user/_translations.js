// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import { MdArrowForward, MdSync, MdSettings } from 'react-icons/lib/md';
import { fetchMyTranslations } from '../../fetch';
import type { Book, RemoteData } from '../../types';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import H1 from '../../components/H1';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import More from '../../components/More';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import theme from '../../style/theme';

type Props = {
  books: RemoteData<Array<Book>>
};

class MyTranslationsPage extends React.Component<Props> {
  static async getInitialProps({ accessToken }) {
    const books = await fetchMyTranslations()(accessToken);

    return {
      books
    };
  }

  render() {
    const { books } = this.props;

    return (
      <Layout crumbs={[<Trans>My translations</Trans>]}>
        <Meta title="My translations" description="" />
        <Container py={[15, 20]}>
          <H1 textAlign="center">
            <Trans>My translations</Trans>
          </H1>
          {books.map(book => (
            <Card key={book.id} p={[15, 20]} mt={20}>
              <H4>{book.title}</H4>
              <P color={theme.colors.grayDark}>
                <Trans>from {book.publisher.name}</Trans>
              </P>
              <Box>
                {book.language.name}{' '}
                <MdArrowForward color={theme.colors.oranges.orange} />{' '}
                <strong>Nepali</strong>
              </Box>
              <More>
                <MdSettings /> <Trans>Edit</Trans>
              </More>
              <More>
                <MdSync /> <Trans>Sync</Trans>
              </More>
            </Card>
          ))}
        </Container>
      </Layout>
    );
  }
}

export default securePage(MyTranslationsPage);
