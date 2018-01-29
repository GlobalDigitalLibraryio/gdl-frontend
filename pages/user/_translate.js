// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import styled from 'react-emotion';
import Downshift from 'downshift';
import { MdArrowDownward } from 'react-icons/lib/md';
import {
  fetchBook,
  fetchSupportedLanguages,
  sendToTranslation
} from '../../fetch';
import type {
  Book,
  RemoteData,
  Language,
  Translation,
  I18n
} from '../../types';
import { Link } from '../../routes';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import H1 from '../../components/H1';
import Button from '../../components/Button';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Head from '../../components/Head';
import theme from '../../style/theme';
import { Menu, MenuItem } from '../../components/Menu';
import MenuHeader from '../../components/Menu/Header';
import BookCover from '../../components/BookCover';

type Props = {
  book: RemoteData<Book>,
  supportedLanguages: RemoteData<Array<Language>>,
  i18n: I18n
};

type State = {
  selectedLanguage: ?Language,
  preparingTranslation: boolean,
  translation?: Translation
};

const LinkLike = styled('button')`
  background: transparent;
  color: ${theme.colors.link};
  border: none;
  font-size: inherit;
  &[disabled] {
    cursor: not-allowed;
    color: ${theme.colors.gray};
  }
  ${p => p.isUppercased && 'text-transform: uppercase;'};
`;

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }) {
    const [book, supportedLanguages] = await Promise.all([
      fetchBook(query.id, query.lang)(accessToken),
      fetchSupportedLanguages()(accessToken)
    ]);

    const bookLanguages = book.availableLanguages.map(lang => lang.code);

    const filteredLanguages = supportedLanguages.filter(
      lang => !bookLanguages.includes(lang.code)
    );

    return {
      book,
      supportedLanguages: filteredLanguages
    };
  }

  state = {
    selectedLanguage: null,
    preparingTranslation: false
  };

  handlePrepareTranslation = async () => {
    this.setState({ preparingTranslation: true });
    if (this.state.selectedLanguage) {
      const translation = await sendToTranslation(
        this.props.book.id,
        this.props.book.language.code,
        this.state.selectedLanguage.code
      );
      this.setState({ translation });
    }
  };

  handleChangeLanguage = (lang: Language) =>
    this.setState({ selectedLanguage: lang });

  render() {
    const { book, supportedLanguages, i18n } = this.props;

    return (
      <Layout
        crumbs={[
          <Link route="book" params={{ lang: book.language.code, id: book.id }}>
            <a>{book.title}</a>
          </Link>,
          <Trans>Translate book</Trans>
        ]}
        language={book.language}
      >
        <Head
          title={i18n.t`Translate ${book.title}`}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Container py={[15, 20]} style={{ textAlign: 'center' }}>
          <H1>
            <Trans>Translate book</Trans>
          </H1>
          <Card p={[15, 20]} mt={20} textAlign="left">
            <Flex>
              <Box w={[70, 120]} h={[75, 150]}>
                <BookCover book={book} />
              </Box>
              <Box>
                <H4>{book.title}</H4>
                <P color={theme.colors.grayDark}>
                  <Trans>from {book.publisher.name}</Trans>
                </P>
              </Box>
            </Flex>
          </Card>
          <Box mb={20}>
            <P color={theme.colors.grayDark}>
              <Trans>Translate from</Trans>
            </P>
            <div>{book.language.name}</div>
            <MdArrowDownward color={theme.colors.oranges.orange} size={50} />
            <P color={theme.colors.grayDark}>
              <Trans>Translate to</Trans>
            </P>
            <Downshift
              onChange={this.handleChangeLanguage}
              itemToString={(lang: Language) => lang.name}
              id="translationLangMenu"
              render={({
                isOpen,
                getButtonProps,
                getItemProps,
                selectedItem,
                closeMenu
              }) => (
                <div>
                  {selectedItem ? (
                    <div>
                      <strong>{selectedItem.name}</strong>
                      <LinkLike {...getButtonProps()} isUppercased>
                        Change
                      </LinkLike>
                    </div>
                  ) : (
                    <LinkLike {...getButtonProps()}>Choose language</LinkLike>
                  )}
                  {isOpen && (
                    <Menu onCloseRequested={closeMenu}>
                      <MenuHeader h={48} onClose={closeMenu}>
                        <Trans>Choose language</Trans>
                      </MenuHeader>
                      {supportedLanguages.map(lang => (
                        <MenuItem
                          key={lang.code}
                          {...getItemProps({ item: lang })}
                          thinBorder
                        >
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </div>
              )}
            />
          </Box>
          {this.state.translation ? (
            <React.Fragment>
              <Button
                href={this.state.translation.crowdinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Trans>Start translation</Trans>
              </Button>
              <p>
                <small>
                  <Trans>
                    Opens 3rd party site{' '}
                    <a href="https://crowdin.com/">Crowdin</a> in a new window.
                  </Trans>
                </small>
              </p>
            </React.Fragment>
          ) : (
            <Button
              disabled={this.state.selectedLanguage == null}
              isLoading={this.state.preparingTranslation}
              onClick={this.handlePrepareTranslation}
            >
              <Trans>Prepare translation</Trans>
            </Button>
          )}
        </Container>
      </Layout>
    );
  }
}

export default securePage(TranslatePage);
