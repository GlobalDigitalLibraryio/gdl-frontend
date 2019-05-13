// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
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
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import facepaint from 'facepaint';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import doFetch from '../../fetch';
import { Link } from '../../routes';
import { securePage } from '../../hocs';
import Layout from '../../components/Layout';
import Container from '../../elements/Container';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import TranslateDropdown from '../../components/TranslateDropdown';
import { spacing } from '../../style/theme';
import mq from '../../style/mq';
import { TABLET_BREAKPOINT } from '../../style/theme/misc';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import CircleLabel from '../../components/GlobalMenu/CircleLabel';

import type { intlShape } from 'react-intl';
import type {
  MyBookTranslations,
  MyBookTranslations_currentUser_translations as Translation
} from '../../gqlTypes';

/**
 * There is a breakpoint interval between 768-865px in width
 * that breaks the UI for the translate dropdown. Which is why
 * a custom media query is used here.
 */
const customMedia = facepaint([
  `@media(min-width: ${TABLET_BREAKPOINT}px)`,
  `@media(min-width: 866px)`
]);

const MY_TRANSLATION_QUERY = gql`
  query MyBookTranslations {
    currentUser {
      translations {
        readingLevel
        crowdinUrl
        synchronizeUrl
        from {
          language {
            name
          }
        }
        to {
          id
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
  {
    menuIsOpen: boolean,
    isLoading: boolean,
    isSynchronized: boolean
  }
> {
  anchorEl: React$ElementRef<typeof Button> = React.createRef();

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
    const {
      translation: {
        to: translateTo,
        from: translateFrom,
        crowdinUrl,
        readingLevel
      }
    } = this.props;
    const { isLoading, menuIsOpen } = this.state;

    return (
      <Card
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
                lang: translateTo.language.code,
                id: translateTo.bookId
              }}
            >
              <a>
                <CoverImage coverImage={translateTo.coverImage} size="medium" />
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
              css={mq({
                justifyContent: 'flex-start',
                borderRadius: 0,
                fontSize: [13, 16, 16]
              })}
            >
              <SyncIcon
                css={
                  isLoading
                    ? spin
                    : mq({
                        fontSize: [24, 30, 30]
                      })
                }
              />
              <FormattedMessage id="Sync" defaultMessage="Sync" />
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
              css={mq({
                justifyContent: 'flex-start',
                borderRadius: 0,
                fontSize: [13, 16, 16]
              })}
            >
              <TranslateIcon css={mq({ fontSize: [24, 30, 30] })} />
              <FormattedMessage id="Translate" defaultMessage="Translate" />
            </Button>

            <TranslateDropdown
              ref={this.anchorEl}
              bookId={translateTo.bookId}
              crowdinUrl={crowdinUrl}
              translatedTo={translateTo.language.code}
              onClose={this.closeMenu}
              menuIsOpen={menuIsOpen}
              popperStyle={css`
                margin-right: initial;
                ${customMedia({ paddingRight: [0, 28, 0] })};
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
              <Typography variant="h5">{translateTo.title}</Typography>
              <Typography variant="body1" component="span">
                <FormattedMessage id="From" defaultMessage="From" />
                {` ${translateTo.publisher.name}, `}
                <CircleLabel
                  level={readingLevel}
                  style={{
                    marginBottom: '-5px',
                    marginRight: '4px',
                    fontSize: 22
                  }}
                />
                <ReadingLevelTrans readingLevel={readingLevel} />
              </Typography>
            </Grid>

            <Grid item>
              <Grid container css={{ marginTop: spacing.large }}>
                <Grid item>
                  <Typography variant="body1">
                    <FormattedMessage id="From" defaultMessage="From" />:
                  </Typography>
                  <Typography variant="h6">
                    {translateFrom.language.name}
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
                    {translateTo.language.name}
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
  animation-name: spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  transform-origin: 50% 50%;
  display: inline-block;

  ${mq({ fontSize: [24, 30, 30] })}

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
    grid-template-areas:
      'image buttons'
      'content content';
  }

  @media (min-width: ${TABLET_BREAKPOINT}px) {
    padding: 40px 0px 40px 40px;
    grid-gap: 1em;
    grid-template-columns: 130px 1fr 170px;
    grid-template-areas: 'image content buttons';
  }
`;

class MyTranslationsPage extends React.Component<{
  intl: intlShape
}> {
  render() {
    const { intl } = this.props;
    return (
      <Layout>
        <Head
          title={intl.formatMessage({
            id: 'My translations',
            defaultMessage: 'My translations'
          })}
        />
        <Container style={{ marginBottom: spacing.large }}>
          <Typography
            variant="h4"
            component="h1"
            paragraph
            css={{ marginTop: spacing.large, marginBottom: spacing.medium }}
          >
            <FormattedMessage
              id="My translations"
              defaultMessage="My translations"
            />
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
                      marginBottom: spacing.large,
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  />
                );
              if (error) throw new Error(error);
              if (!data.currentUser)
                return (
                  <Typography align="center" color="error" variant="body1">
                    <FormattedMessage
                      id="An error has occurred"
                      defaultMessage="An error has occurred. Please try again."
                    />
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
                  <FormattedMessage
                    id="You have not translated any books yet"
                    defaultMessage="You have not translated any books yet."
                  />
                </Typography>
              ) : (
                translations.map(translation => (
                  <TranslationCard
                    key={translation.to.id}
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

export default securePage(injectIntl(MyTranslationsPage));
