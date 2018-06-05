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
  Divider
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

type Props = {
  i18n: I18n
};

type State = {
  translations: Array<Translation>
};

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
          <Grid item>
            <CardContent>
              <Typography variant="headline">{translation.title}</Typography>
              <Typography variant="subheading">
                <Trans>from {translation.publisher.name}</Trans>
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
        <Divider />
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

class MyTranslationsPage extends React.Component<Props, State> {
  state = {
    translations: []
  };

  async componentDidMount() {
    const translationsRes = await fetchMyTranslations();
    // TODO: Notify user of error
    if (translationsRes.isOk) {
      this.setState({ translations: translationsRes.data });
    }
  }

  render() {
    const { i18n } = this.props;
    const { translations } = this.state;

    return (
      <Layout>
        <Head title={i18n.t`My translations`} />
        <Container css={{ marginTop: spacing.large }}>
          <Typography
            variant="display2"
            align="center"
            paragraph
            css={{ marginTop: spacing.large }}
          >
            <Trans>My translations</Trans>
          </Typography>
          {translations.map(translation => (
            <TranslationCard key={translation.id} translation={translation} />
          ))}
        </Container>
      </Layout>
    );
  }
}

export default withMuiRoot(securePage(withI18n(MyTranslationsPage)));
