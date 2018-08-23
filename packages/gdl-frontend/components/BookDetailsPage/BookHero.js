// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import NextLink from 'next/link';
import { css } from 'react-emotion';
import {
  Menu,
  MenuItem,
  Button,
  Card,
  Typography,
  Tab
} from '@material-ui/core';
import {
  CloudDownload as CloudDownloadIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  Share as ShareIcon
} from '@material-ui/icons';

import { logEvent } from '../../lib/analytics';
import type { BookDetails } from '../../types';
import { Link } from '../../routes';
import { Center, View } from '../../elements';
import Container from '../../elements/Container';
import BookCover from '../../components/BookCover';
import media from '../../style/media';
import { spacing } from '../../style/theme';
import Favorite from '../../components/Favorite';

type Props = {
  book: BookDetails,
  userHasEditAccess: boolean
};

export default class BookHero extends React.Component<
  Props,
  { anchorEl: ?HTMLElement, supportsNavigatorShare: boolean }
> {
  state = {
    anchorEl: null,
    supportsNavigatorShare: false
  };

  componentDidMount() {
    this.setState({ supportsNavigatorShare: Boolean(navigator.share) });
  }

  handleDownloadClick = (event: SyntheticEvent<HTMLButtonElement>) =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

  handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: this.props.book.title,
        text: this.props.book.description,
        url: window.location.href
      });
    }
  };

  render() {
    const { book } = this.props;

    return (
      <Card square css={{ position: 'relative' }}>
        {/* Dont add bottom padding on mobile, because there is some padding in the tab buttons */}
        <Container pt={[spacing.medium, spacing.large]} pb={[0, spacing.large]}>
          <View flexDirection={['column', 'row']}>
            <BookCover
              // Center the coverImage on mobile
              css={media.mobile`align-self: center;`}
              coverImage={book.coverImage}
              w={[130, 260]}
              h={[175, 365]}
            />
            <View css={[{ flex: 1 }, media.tablet`margin-left: 20px;`]}>
              <Typography
                css={media.mobile`margin-top: 0.7rem;`}
                lang={book.language.code}
                variant="headline"
                align="center"
              >
                {book.title}
              </Typography>

              <Typography paragraph variant="subheading" align="center">
                <Trans>from {book.publisher.name}</Trans>
              </Typography>

              <Typography
                lang={book.language.code}
                paragraph
                align="center"
                css={media.tablet({ flex: 1 })}
              >
                {book.description}
              </Typography>

              <Center>
                {book.bookFormat === 'HTML' ? (
                  <Link
                    route="read"
                    passHref
                    params={{ id: book.id, lang: book.language.code }}
                    prefetch
                  >
                    <Button
                      variant="raised"
                      color="primary"
                      size="large"
                      onClick={() =>
                        logEvent('Books', 'Read', this.props.book.title)
                      }
                    >
                      <Trans>Read book</Trans>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button size="large" variant="raised" disabled>
                      <Trans>Read book</Trans>
                    </Button>
                    <Typography
                      align="center"
                      css={{ marginTop: spacing.small }}
                    >
                      This book is only available for download.
                    </Typography>
                  </>
                )}
              </Center>

              <div css={{ display: 'flex' }}>
                <Favorite
                  id={this.props.book.id}
                  language={this.props.book.language.code}
                >
                  {({ onClick, isFav }) => (
                    <TabButton
                      onClick={() => {
                        onClick();
                        logEvent(
                          'Books',
                          isFav ? 'Unfavorited' : 'Favorited',
                          book.title
                        );
                      }}
                      icon={
                        isFav ? (
                          <FavoriteIcon
                            style={isFav ? { color: 'red' } : null}
                          />
                        ) : (
                          <FavoriteOutlineIcon />
                        )
                      }
                      label={<Trans>Favorite</Trans>}
                    />
                  )}
                </Favorite>

                <TabButton
                  icon={<CloudDownloadIcon />}
                  label={<Trans>Download</Trans>}
                  aria-owns={this.state.anchorEl ? 'download-book-menu' : null}
                  aria-haspopup="true"
                  onClick={this.handleDownloadClick}
                />

                {this.state.supportsNavigatorShare && (
                  <TabButton
                    icon={<ShareIcon />}
                    label={<Trans>Share</Trans>}
                    onClick={this.handleShareClick}
                  />
                )}
              </div>

              <Menu
                id="download-book-menu"
                onClose={this.closeDownloadMenu}
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
              >
                {book.downloads.epub && (
                  <MenuItem
                    href={book.downloads.epub}
                    component="a"
                    onClick={() => {
                      this.closeDownloadMenu();
                      logEvent('Books', 'Downloaded ePub', book.title);
                    }}
                  >
                    <Trans>E-book (ePub)</Trans>
                  </MenuItem>
                )}
                {book.downloads.pdf && (
                  <MenuItem
                    href={book.downloads.pdf}
                    component="a"
                    onClick={() => {
                      this.closeDownloadMenu();
                      logEvent('Books', 'Downloaded PDF', book.title);
                    }}
                  >
                    <Trans>Printable book (PDF)</Trans>
                  </MenuItem>
                )}
              </Menu>
            </View>
          </View>
        </Container>
        {this.props.userHasEditAccess && (
          <NextLink
            href={{
              pathname: '/admin/edit',
              query: { id: book.id, lang: book.language.code }
            }}
            passHref
          >
            <Button className={editBookButtonStyle} color="secondary">
              Edit book
            </Button>
          </NextLink>
        )}
      </Card>
    );
  }
}

const editBookButtonStyle = css`
  position: absolute;
  top: ${spacing.small};
  right: 0;
`;

const TabButton = props => (
  <Tab
    role="button"
    css={`
      flex-grow: 1;
      flex-shrink: 1;
      ${media.tablet`
        min-width: 72px;
      `};
    `}
    {...props}
  />
);
