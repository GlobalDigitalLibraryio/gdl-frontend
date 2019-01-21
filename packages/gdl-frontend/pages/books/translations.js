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
  Typography,
  Grid,
  CircularProgress
} from '@material-ui/core';
import {
  ArrowForward as ArrowForwardIcon,
  Sync as SyncIcon,
  Translate as TranslateIcon
} from '@material-ui/icons';
import styled, { css } from 'react-emotion';

import doFetch, { fetchMyTranslations } from '../../fetch';
import { Link } from '../../routes';
import type { Translation } from '../../types';
import { securePage } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../elements/Container';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import TranslateDropdown from '../../components/TranslateDropdown';
import { spacing } from '../../style/theme';
import mq from '../../style/mq';
import { TABLET_BREAKPOINT } from '../../style/theme/misc';

class TranslationCard extends React.Component<
  {
    translation: Translation,
    handleSync: () => void
  },
  { menuIsOpen: boolean, isLoading: boolean, isSynchronized: boolean }
> {
  anchorEl: React$ElementRef<Button> = React.createRef();

  state = {
    menuIsOpen: false,
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

  closeMenu = (event: SyntheticInputEvent<EventTarget>) => {
    if (this.anchorEl.current.contains(event.target)) {
      return;
    }
    this.setState({ menuIsOpen: false });
  };

  handleToggle = () => {
    this.setState(prev => ({
      menuIsOpen: !prev.menuIsOpen
    }));
  };

  render() {
    const { translation } = this.props;
    const { isLoading, menuIsOpen } = this.state;

    return (
      <Card
        key={translation.id}
        css={mq({
          marginTop: spacing.xlarge,
          marginBottom: [spacing.xxlarge, spacing.medium],
          overflow: 'visible',
          marginLeft: ['-30px', 0, 0],
          marginRight: ['-30px', 0, 0]
        })}
      >
        <CustomGrid>
          <Grid
            item
            css={mq({
              gridArea: 'image',
              marginTop: [-50, 0, 0]
            })}
          >
            <Link
              route="book"
              params={{
                lang: translation.translatedTo.code,
                id: translation.id
              }}
            >
              <a>
                <CoverImage coverImage={translation.coverImage} size="medium" />
              </a>
            </Link>
          </Grid>
          <Grid item css={{ gridArea: 'buttons' }}>
            <Button
              onClick={this.handleSynchronize}
              disabled={isLoading}
              color="primary"
              size="large"
              fullWidth
              css={{
                justifyContent: 'flex-start',
                borderRadius: 0,
                fontSize: 16
              }}
            >
              <SyncIcon
                className={isLoading ? spin : null}
                css={{ fontSize: 30 }}
              />
              <Trans>Sync</Trans>
            </Button>
            <Button
              buttonRef={this.anchorEl}
              aria-owns={menuIsOpen ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle}
              color="primary"
              size="large"
              variant={menuIsOpen ? 'contained' : 'text'}
              fullWidth
              css={{
                justifyContent: 'flex-start',
                borderRadius: 0,
                fontSize: 16
              }}
            >
              <TranslateIcon css={{ fontSize: 30 }} />
              <Trans>Translate</Trans>
            </Button>

            <TranslateDropdown
              ref={this.anchorEl}
              bookId={translation.id}
              crowdinUrl={translation.crowdinUrl}
              onClose={this.closeMenu}
              menuIsOpen={menuIsOpen}
              popperStyle={css`
                margin-right: initial;
              `}
            />
          </Grid>
          <Grid
            container
            direction="column"
            justify="space-between"
            css={mq({
              gridArea: 'content',
              paddingLeft: [0, '1em', '1em'],
              borderRight: [0, '1px solid #e5e5e5', '1px solid #e5e5e5']
            })}
          >
            <Grid item>
              <Typography variant="h5">{translation.title}</Typography>
              <Typography variant="body1">
                <Trans>From {translation.publisher.name}</Trans>
              </Typography>
            </Grid>

            <Grid item>
              <Grid
                container
                direction="row"
                css={{ marginTop: spacing.medium }}
              >
                <Grid item>
                  <Typography variant="body1">
                    <Trans>From</Trans>:
                  </Typography>
                  <Typography variant="h6">
                    {translation.translatedFrom.name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: spacing.large,
                    marginRight: spacing.large
                  }}
                >
                  <ArrowForwardIcon style={{ fontSize: 40 }} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">To:</Typography>
                  <Typography variant="h6">
                    {translation.translatedTo.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CustomGrid>
      </Card>
    );
  }
}

const spin = css`
  font-size: 30px;
  animation-name: spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  transform-origin: 50% 50%;
  display: inline-block;

  @keyframes spin {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const CustomGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'image'
    'content'
    'buttons';

  @media (min-width: 0px) and (orientation: portrait) {
    padding: 30px 0px 30px 30px;
    grid-gap: 1em;
    grid-template-columns: 130px auto;
    grid-template-rows: 150px auto;
    grid-template-areas:
      'image buttons'
      'content content';
  }

  @media (min-width: ${TABLET_BREAKPOINT}px) {
    padding: 40px 0px 40px 40px;
    grid-gap: 1em;
    grid-template-columns: 130px auto 170px;
    grid-template-areas: 'image content buttons';
  }
`;

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
            paragraph
            css={{ marginTop: spacing.large, marginBottom: spacing.medium }}
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
