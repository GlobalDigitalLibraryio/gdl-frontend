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
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Typography
} from '@material-ui/core';

import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { Translate as TranslateIcon } from '@material-ui/icons';
import { Sync as SyncIcon } from '@material-ui/icons';
import { Edit as EditIcon } from '@material-ui/icons';

import doFetch, { fetchMyTranslations } from '../../fetch';
import { Link } from '../../routes';
import type { Translation, I18n } from '../../types';
import { securePage, withI18n } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import { spacing } from '../../style/theme';
import media from '../../style/media';

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
        <CardContent css={{ display: 'flex' }}>
          <TranslateIcon />
          <Typography
            css={{ marginLeft: spacing.large, marginRight: spacing.medium }}
          >
            {translation.translatedFrom.name}
          </Typography>
          <ArrowForwardIcon />
          <Typography
            css={{ marginLeft: spacing.medium, marginRight: spacing.medium }}
          >
            {translation.translatedTo.name}
          </Typography>
        </CardContent>
        <Divider />

        <CardContent
          css={{
            display: 'flex',
            marginTop: spacing.small,
            marginBottom: spacing.small
          }}
        >
          <Link
            route="book"
            params={{
              lang: translation.translatedTo.code,
              id: translation.id
            }}
          >
            <a>
              <BookCover
                w={[120, 120]}
                h={[150, 150]}
                coverImage={translation.coverImage}
              />
            </a>
          </Link>

          <div
            css={{
              marginLeft: spacing.medium
            }}
          >
            <Typography variant="headline">{translation.title}</Typography>
            <Typography variant="subheading">
              <Trans>from {translation.publisher.name}</Trans>
            </Typography>
          </div>
        </CardContent>

        <Divider />

        <CardActions
          css={[
            { display: 'flex' },
            media.mobile({ justifyContent: 'space-evenly' }),
            media.tablet({ justifyContent: 'flex-end' })
          ]}
        >
          <Button
            color="primary"
            onClick={this.handleSynchronize}
            disabled={this.state.isSynchronized}
            aria-label="Sync Translation"
            css={{ textAlign: 'left' }}
          >
            <SyncIcon css={{ margin: spacing.xsmall }} />
            <Trans>Sync with Crowdin</Trans>
          </Button>

          <Button
            color="primary"
            href={translation.crowdinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Edit Translation"
          >
            <EditIcon css={{ margin: spacing.xsmall }} />
            <Trans>Edit translation</Trans>
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
      <TranslationCard
        key={`${translation.id}-${translation.translatedTo.code}`}
        translation={translation}
      />
    ));
  };

  render() {
    const { i18n } = this.props;
    const { loadingState } = this.state;

    return (
      <Layout>
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

export default securePage(withI18n(MyTranslationsPage));
