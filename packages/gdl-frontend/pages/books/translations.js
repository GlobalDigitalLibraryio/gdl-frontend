// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans, I18n } from '@lingui/react';
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
import type { Translation } from '../../types';
import { securePage } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../elements/Container';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import { LoadingButton } from '../../elements';
import { spacing } from '../../style/theme';

class TranslationCard extends React.Component<
  {
    translation: Translation,
    handleSync: () => void
  },
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
    this.props.handleSync();
  };

  render() {
    const { translation } = this.props;
    const { isLoading } = this.state;

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
                <CoverImage coverImage={translation.coverImage} size="small" />
              </a>
            </Link>
          </Grid>
          <Grid item xs>
            <CardContent>
              <Typography variant="h5" component="h2">
                {translation.title}
              </Typography>
              <Typography variant="subtitle1">
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
          <LoadingButton
            isLoading={isLoading}
            disabled={this.state.isSynchronized}
            onClick={this.handleSynchronize}
            color="primary"
          >
            <Trans>Sync</Trans>
          </LoadingButton>
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

type State = {
  translations: Array<Translation>,
  loadingState: LoadingState
};

class MyTranslationsPage extends React.Component<{}, State> {
  state = {
    translations: [],
    loadingState: 'LOADING'
  };

  async componentDidMount() {
    this.loadMyTranslations();
  }

  loadMyTranslations = async () => {
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
  };

  handleSync = () => {
    // Refreshes my translation cards when a card is synced
    this.loadMyTranslations();
  };

  renderTranslations = () => {
    if (this.state.translations.length === 0) {
      return (
        <Typography
          align="center"
          paragraph
          variant="body1"
          css={{ marginTop: spacing.medium }}
        >
          <Trans>You have not translated any books yet.</Trans>
        </Typography>
      );
    }

    return this.state.translations.map(translation => (
      <TranslationCard
        key={`${translation.id}-${translation.translatedTo.code}`}
        translation={translation}
        handleSync={this.handleSync}
      />
    ));
  };

  render() {
    const { loadingState } = this.state;

    return (
      <Layout>
        <I18n>{({ i18n }) => <Head title={i18n.t`My translations`} />}</I18n>
        <Container>
          <Typography
            variant="h4"
            component="h1"
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
            <Typography align="center" color="error" variant="body1">
              <Trans>An error has occurred. Please try again.</Trans>
            </Typography>
          )}
        </Container>
      </Layout>
    );
  }
}

export default securePage(MyTranslationsPage);
