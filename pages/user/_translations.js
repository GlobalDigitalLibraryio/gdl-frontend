// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { MdArrowForward } from 'react-icons/lib/md';
import { fetchMyTranslations } from '../../fetch';
import { Link } from '../../routes';
import type { Book, RemoteData, I18n } from '../../types';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import H1 from '../../components/H1';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import A from '../../components/A';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import theme from '../../style/theme';

type Props = {
  i18n: I18n
};

type State = {
  books: RemoteData<{ results: Array<Book> }>
};

class MyTranslationsPage extends React.Component<Props, State> {
  state = {
    books: {
      results: []
    }
  };
  async componentDidMount() {
    const books = await fetchMyTranslations()();
    /* eslint-disable react/no-did-mount-set-state */
    // $FlowFixMe Not sure why Flow complains here....
    this.setState({ books });
  }

  render() {
    const { i18n } = this.props;
    const { books } = this.state;

    return (
      <Layout crumbs={[<Trans>My translations</Trans>]}>
        <Head title={i18n.t`My translations`} />
        <Container py={[15, 40]}>
          <H1 textAlign="center">
            <Trans>My translations</Trans>
          </H1>
          {books.results.map(book => (
            <Card key={book.id} p={[15, 20]} mt={20}>
              <Flex>
                <Box w={[75, 120]} h={[100, 150]} mr={[10, 20]}>
                  <Link
                    route="book"
                    params={{ lang: book.language.code, id: book.id }}
                  >
                    <a>
                      <BookCover book={book} p={5} />
                    </a>
                  </Link>
                </Box>
                <Box flex="1">
                  <H4>{book.title}</H4>
                  <P color={theme.colors.grayDark} style={{ marginTop: 0 }}>
                    <Trans>from {book.publisher.name}</Trans>
                  </P>
                  <Box>
                    {/* book.translatedFrom.name isn't implmented yet */}
                    {book.language.name}{' '}
                    <MdArrowForward color={theme.colors.oranges.orange} />{' '}
                    <strong>{book.language.name}</strong>
                  </Box>
                  <div style={{ float: 'right' }}>
                    <A isUppercased isBold>
                      <Trans>Sync</Trans>
                    </A>
                    <A isUppercased isBold style={{ marginLeft: '30px' }}>
                      <Trans>Edit</Trans>
                    </A>
                  </div>
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
