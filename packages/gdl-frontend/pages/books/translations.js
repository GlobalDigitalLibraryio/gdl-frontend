// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  CircularProgress
} from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons';

import doFetch, { fetchMyTranslations } from '../../fetch';
import { Link } from '../../routes';
import type { Translation, I18n } from '../../types';
import { securePage, withI18n, withMuiRoot } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import { spacing } from '../../style/theme';

class TranslationCard extends React.Component<
  { translation: Translation },
  { isLoading: boolean, isSynchronized: boolean }
> {
  state = {
    isLoading: false,
    isSynchronized: false
  };

  handleSynchronize = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    await doFetch(this.props.translation.synchronizeUrl);
    this.setState({ isLoading: false, isSynchronized: true });
  };

  render() {
    const { translation } = this.props;
    return (
      <Card key={translation.id} css={{ marginBottom: spacing.large }}>
        <Grid container>
          <Grid item>
            <Link
              route="book"
              params={{
                lang: translation.translatedTo.code,
                id: translation.id
              }}
            >
              <a>
                <BookCover
                  w={[75, 120]}
                  h={[100, 150]}
                  coverImage={translation.coverImage}
                />
              </a>
            </Link>
          </Grid>
          <Grid item xs>
            <CardContent>
              <Typography variant="headline">{translation.title}</Typography>
              <Typography variant="subheading">
                <Trans>from {translation.publisher.name}</Trans>
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography>{translation.translatedFrom.name}</Typography>
            </Grid>
            <Grid item xs={4} css={{ textAlign: 'center' }}>
              <ArrowForwardIcon />
            </Grid>
            <Grid item xs={4}>
              <Typography align="right" variant="body2">
                {translation.translatedTo.name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            onClick={this.handleSynchronize}
            disabled={this.state.isSynchronized}
          >
            <Trans>Sync</Trans>
          </Button>
          <Button
            color="primary"
            href={translation.crowdinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans>Edit</Trans>
          </Button>
        </CardActions>
      </Card>
    );
  }
}

type LoadingState = 'LOADING' | 'SUCCESS' | 'ERROR';

type Props = {
  i18n: I18n
};

type State = {
  translations: Array<Translation>,
  loadingState: LoadingState
};

class MyTranslationsPage extends React.Component<Props, State> {
  state = {
    translations: [],
    loadingState: 'LOADING'
  };

  async componentDidMount() {
    const translationsRes = await fetchMyTranslations();
    if (translationsRes.isOk) {
      this.setState({
        translations: translationsRes.data,
        loadingState: 'SUCCESS'
      });
    } else {
      this.setState({
        loadingState: 'ERROR'
      });
    }
  }

  renderTranslations = () => {
    if (this.state.translations.length === 0) {
      return (
        <Typography
          align="center"
          paragraph
          css={{ marginTop: spacing.medium }}
        >
          <Trans>You have not translated any books yet.</Trans>
        </Typography>
      );
    }
    return this.state.translations.map(translation => (
      <TranslationCard key={translation.id} translation={translation} />
    ));
  };

  render() {
    const { i18n } = this.props;
    const { loadingState } = this.state;

    return (
      <Layout crumbs={[<Trans>My translations</Trans>]}>
        <Head title={i18n.t`My translations`} />
        <Container
          css={{ marginTop: spacing.large, marginBottom: spacing.large }}
        >
          <Typography
            variant="display1"
            align="center"
            paragraph
            css={{ marginTop: spacing.large }}
          >
            <Trans>My translations</Trans>
          </Typography>

          {loadingState === 'LOADING' && (
            <CircularProgress
              css={{
                marginTop: spacing.large,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
          )}
          {loadingState === 'SUCCESS' && this.renderTranslations()}
          {loadingState === 'ERROR' && (
            <Typography align="center" color="error">
              <Trans>An error has occurred. Please try again.</Trans>
            </Typography>
          )}
        </Container>
      </Layout>
    );
  }
}

export default withMuiRoot(securePage(withI18n(MyTranslationsPage)));
