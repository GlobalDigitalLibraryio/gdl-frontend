// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@material-ui/icons';
import {
  Card,
  CardContent,
  SwipeableDrawer,
  Typography,
  Hidden,
  Grid,
  Button
} from '@material-ui/core';

import TranslateDropdown from '../TranslateDropdown';
import { sendToTranslation } from '../../fetch';
import type { Translation } from '../../types';
import type {
  TranslateBook_book as BookDetails,
  TranslateBook_translationLanguages as Language
} from '../../gqlTypes';
import { Link } from '../../routes';
import { LoadingButton, Container } from '../../elements';
import CoverImage from '../CoverImage';
import LanguageList from '../LanguageList';
import { spacing } from '../../style/theme';

type Props = {
  book: BookDetails,
  supportedLanguages: Array<Language>
};

const translationStates = {
  SELECT: 'SELECT',
  PREPARING: 'PREPARING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

type State = {
  // Duplicating the values here because Flow doesn't like $Values<translationStates>
  translationState: 'SELECT' | 'PREPARING' | 'SUCCESS' | 'ERROR',
  selectedLanguage: ?Language,
  translation?: Translation,
  showLanguageMenu: boolean,
  menuIsOpen: boolean
};

class PrepareTranslatePage extends React.Component<Props, State> {
  state = {
    selectedLanguage: null,
    translationState: translationStates.SELECT,
    showLanguageMenu: false,
    translation: undefined,
    menuIsOpen: false
  };

  anchorEl: React$ElementRef<Button> = React.createRef();

  handleToggle = () => {
    this.setState(state => ({ menuIsOpen: !state.menuIsOpen }));
  };

  closeMenu = (event: SyntheticInputEvent<EventTarget>) => {
    if (this.anchorEl.current.contains(event.target)) {
      return;
    }
    this.setState({ menuIsOpen: false });
  };

  toggleLanguageMenu = () =>
    this.setState(state => ({
      showLanguageMenu: !this.state.showLanguageMenu
    }));

  handlePrepareTranslation = async () => {
    // This only makes sense if we have selected a language
    if (this.state.selectedLanguage) {
      // Set the preparing phase, to show loading indicators etc.
      this.setState({ translationState: translationStates.PREPARING });

      const translationRes = await sendToTranslation(
        this.props.book.id,
        this.props.book.language.code,
        // $FlowFixMe: We are already checking for this in the enclosing if
        this.state.selectedLanguage.code
      );

      // Based on the result of the ajax call, we either go to the success or error phase
      if (translationRes.isOk) {
        this.setState({
          translation: translationRes.data,
          translationState: translationStates.SUCCESS
        });
      } else {
        this.setState({ translationState: translationStates.ERROR });
      }
    }
  };

  handleChangeLanguage = (lang: Language) =>
    this.setState({
      selectedLanguage: lang,
      showLanguageMenu: false,
      // Make sure we clear out any previous 'success' result if change the translation language
      translationState: translationStates.SELECT,
      translation: undefined
    });

  render() {
    const { book, supportedLanguages } = this.props;
    const {
      selectedLanguage,
      translationState,
      translation,
      menuIsOpen
    } = this.state;
    return (
      <Container
        css={{ marginTop: spacing.large, marginBottom: spacing.large }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          css={{ marginBottom: spacing.large }}
        >
          <Trans>Translate book</Trans>
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={16}>
              <Grid item>
                <Link
                  route="book"
                  params={{ lang: book.language.code, id: book.id }}
                >
                  <a>
                    <CoverImage coverImage={book.coverImage} size="small" />
                  </a>
                </Link>
              </Grid>
              <Grid item xs>
                <Typography
                  lang={book.language.code}
                  variant="h5"
                  component="h2"
                >
                  {book.title}
                </Typography>

                <Typography paragraph variant="subtitle1">
                  <Trans>from {book.publisher.name}</Trans>
                </Typography>

                <Typography lang={book.language.code} paragraph>
                  {book.description}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid
          container
          alignItems="center"
          css={{
            textAlign: 'center',
            marginTop: spacing.xxlarge,
            marginBottom: spacing.xxlarge
          }}
        >
          <Grid item md={4} xs={12}>
            <Typography variant="body2" color="textSecondary" component="span">
              <Trans gutterBottom>Translate from</Trans>
            </Typography>
            <Typography
              color="inherit"
              variant="button"
              css={{ paddingTop: '8px' }}
            >
              {book.language.name}
            </Typography>
          </Grid>
          <Grid item md={4} xs={12}>
            <Hidden
              mdUp
              implementation="css"
              css={{ margin: `${spacing.large} 0` }}
            >
              <ArrowDownwardIcon />
            </Hidden>
            <Hidden mdDown implementation="css">
              <ArrowForwardIcon />
            </Hidden>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="body2" color="textSecondary" component="span">
              <Trans>Translate to</Trans>
            </Typography>
            <Button color="primary" onClick={this.toggleLanguageMenu}>
              {selectedLanguage ? (
                selectedLanguage.name
              ) : (
                <Trans>Select language</Trans>
              )}
            </Button>
          </Grid>
        </Grid>

        <SwipeableDrawer
          disableDiscovery
          disableSwipeToOpen
          disableBackdropTransition
          onOpen={() => {}}
          open={this.state.showLanguageMenu}
          onClose={this.toggleLanguageMenu}
          anchor="right"
        >
          <LanguageList
            enableSearch
            languages={supportedLanguages}
            selectedLanguageCode={selectedLanguage && selectedLanguage.code}
            onSelectLanguage={this.handleChangeLanguage}
          />
        </SwipeableDrawer>

        <div css={{ textAlign: 'center' }}>
          {translationState === translationStates.SUCCESS ? (
            <>
              <Button
                buttonRef={this.anchorEl}
                aria-owns={menuIsOpen ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={this.handleToggle}
                variant="contained"
                color="primary"
                size="large"
                css={{ borderRadius: 2 }}
              >
                <Trans>Start translation</Trans>
              </Button>
              <TranslateDropdown
                ref={this.anchorEl}
                bookId={book.id}
                crowdinUrl={translation && translation.crowdinUrl}
                onClose={this.closeMenu}
                menuIsOpen={menuIsOpen}
              />
            </>
          ) : (
            <>
              <LoadingButton
                isLoading={translationState === translationStates.PREPARING}
                disabled={this.state.selectedLanguage == null}
                onClick={this.handlePrepareTranslation}
                color="primary"
                size="large"
                variant="outlined"
                css={{ borderRadius: 2 }}
              >
                <Trans>Prepare translation</Trans>
              </LoadingButton>
              {translationState === translationStates.PREPARING && (
                <Typography css={{ marginTop: spacing.medium }}>
                  <Trans>
                    Please wait while we’re preparing the book for translation.
                    This could take some time.
                  </Trans>
                </Typography>
              )}
            </>
          )}
          {translationState === translationStates.ERROR && (
            <Typography color="error" css={{ marginTop: spacing.medium }}>
              <Trans>
                Something went wrong while preparing the translation. Please try
                again.
              </Trans>
            </Typography>
          )}
        </div>
      </Container>
    );
  }
}

export default PrepareTranslatePage;
