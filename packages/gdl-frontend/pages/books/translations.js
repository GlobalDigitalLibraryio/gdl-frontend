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
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import doFetch from '../../fetch';
import { Link } from '../../routes';
import { securePage } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../elements/Container';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import { LoadingButton } from '../../elements';
import { spacing } from '../../style/theme';

import type {
  MyBookTranslations,
  MyBookTranslations_currentUser_translations as Translation
} from '../../gqlTypes';

const MY_TRANSLATION_QUERY = gql`
  query MyBookTranslations {
    currentUser {
      translations {
        crowdinUrl
        synchronizeUrl
        from {
          language {
            name
          }
        }
        to {
          bookId
          title
          publisher {
            name
          }
          coverImage {
            url
          }
          language {
            name
            code
          }
        }
      }
    }
  }
`;

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
    const {
      translation: { to: translateTo, from: translateFrom, crowdinUrl }
    } = this.props;
    const { isLoading } = this.state;

    return (
      <Card key={translateTo.bookId} css={{ marginBottom: spacing.large }}>
        <Grid container>
          <Grid item>
            <Link
              route="book"
              params={{
                lang: translateTo.language.code,
                id: translateTo.bookId
              }}
            >
              <a>
                <CoverImage coverImage={translateTo.coverImage} size="small" />
              </a>
            </Link>
          </Grid>
          <Grid item xs>
            <CardContent>
              <Typography variant="h5" component="h2">
                {translateTo.title}
              </Typography>
              <Typography variant="subtitle1">
                <Trans>from {translateTo.publisher.name}</Trans>
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography>{translateFrom.language.name}</Typography>
            </Grid>
            <Grid item xs={4} css={{ textAlign: 'center' }}>
              <ArrowForwardIcon />
            </Grid>
            <Grid item xs={4}>
              <Typography align="right" variant="body2">
                {translateTo.language.name}
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
            href={crowdinUrl}
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

class MyTranslationsPage extends React.Component<*> {
  render() {
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
          <Query query={MY_TRANSLATION_QUERY}>
            {({
              loading,
              error,
              data,
              refetch
            }: {
              loading: boolean,
              error: *,
              data: MyBookTranslations,
              refetch: () => void
            }) => {
              if (loading)
                return (
                  <CircularProgress
                    css={{
                      marginTop: spacing.large,
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  />
                );
              if (error || !data.currentUser)
                return (
                  <Typography align="center" color="error" variant="body1">
                    <Trans>An error has occurred. Please try again.</Trans>
                  </Typography>
                );
              const { translations } = data.currentUser;

              return translations.length === 0 ? (
                <Typography
                  align="center"
                  paragraph
                  variant="body1"
                  css={{ marginTop: spacing.medium }}
                >
                  <Trans>You have not translated any books yet.</Trans>
                </Typography>
              ) : (
                translations.map(translation => (
                  <TranslationCard
                    key={translation.to.bookId}
                    translation={translation}
                    handleSync={refetch}
                  />
                ))
              );
            }}
          </Query>
        </Container>
      </Layout>
    );
  }
}

export default securePage(MyTranslationsPage);
