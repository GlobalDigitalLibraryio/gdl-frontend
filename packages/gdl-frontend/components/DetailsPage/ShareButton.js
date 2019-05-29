// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import copyToClipboard from 'copy-to-clipboard';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Share as ShareIcon, Link as LinkIcon } from '@material-ui/icons';
import { FacebookIcon, TwitterIcon } from '../../components/icons';

import { logEvent, type Category } from '../../lib/analytics';
import { IconButton } from '../../elements';

type Props = {
  title: string,
  description: string,
  logEvent: Category
};

class ShareButton extends React.Component<Props, { anchorEl: ?HTMLElement }> {
  state = {
    anchorEl: null
  };
  handleShareClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    /**
     * If the browser supports the web share api, we use that instead of displaying a dropdown
     */
    if (navigator.share) {
      navigator
        .share({
          title: this.props.title,
          text: this.props.description,
          url: window.location.href
        })
        .then(() => logEvent(this.props.logEvent, 'Shared', this.props.title))
        .catch(() => {}); // Ignore here because we don't care if people cancel sharing
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  closeShareMenu = () => this.setState({ anchorEl: null });

  render() {
    return (
      <>
        <IconButton
          icon={<ShareIcon />}
          label={<FormattedMessage id="Share" defaultMessage="Share" />}
          onClick={event => this.handleShareClick(event)}
        />
        <Menu
          id="share-book-menu"
          onClose={this.closeShareMenu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
        >
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.facebook.com/sharer.php?u=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <FacebookIcon />
            </ListItemIcon>
            <ListItemText>Facebook</ListItemText>
          </MenuItem>
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://twitter.com/intent/tweet?url=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText>Twitter</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              copyToClipboard(window.location.href);
              this.closeShareMenu();
            }}
            component="button"
          >
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="Copy URL" defaultMessage="Copy URL" />
            </ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default ShareButton;
