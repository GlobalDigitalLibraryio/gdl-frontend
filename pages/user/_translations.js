// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import type { I18n } from 'lingui-i18n';
import { MdArrowForward, MdSync, MdSettings } from 'react-icons/lib/md';
import { fetchMyTranslations } from '../../fetch';
import type { Book, RemoteData, Context } from '../../types';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import H1 from '../../components/H1';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import More from '../../components/More';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import theme from '../../style/theme';

type Props = {
  books: RemoteData<{ results: Array<Book> }>,
  i18n: I18n
};

class MyTranslationsPage extends React.Component<Props> {
  static async getInitialProps({ accessToken, isAuthenticated }: Context) {
    if (!isAuthenticated) {
      return {};
    }

    const books = await fetchMyTranslations()(accessToken);

    return {
      books
    };
  }

  render() {
    const { books, i18n } = this.props;

    return (
      <Layout crumbs={[<Trans>My translations</Trans>]}>
        <Head title={i18n.t`My translations`} />
        <Container py={[15, 20]}>
          <H1 textAlign="center">
            <Trans>My translations</Trans>
          </H1>
          {books.results.map(book => (
            <Card key={book.id} p={[15, 20]} mt={20}>
              <Flex>
                <Box w={[70, 120]} h={[75, 150]}>
                  <BookCover book={book} />
                </Box>
                <Box>
                  <H4>{book.title}</H4>
                  <P color={theme.colors.grayDark}>
                    <Trans>from {book.publisher.name}</Trans>
                  </P>
                  <Box>
                    {/* book.translatedFrom.name isn't implmented yet */}
                    {book.language.name}{' '}
                    <MdArrowForward color={theme.colors.oranges.orange} />{' '}
                    <strong>{book.language.name}</strong>
                  </Box>
                  <Box ml="auto">
                    <More>
                      <MdSettings /> <Trans>Edit</Trans>
                    </More>
                    <More>
                      <MdSync /> <Trans>Sync</Trans>
                    </More>
                  </Box>
                </Box>
              </Flex>
            </Card>
          ))}
        </Container>
      </Layout>
    );
  }
}

export default securePage(MyTranslationsPage);
