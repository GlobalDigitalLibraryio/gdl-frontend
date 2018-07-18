// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import {
  Drawer,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import type { Language } from '../../types';
import { spacing, colors } from '../../style/theme';
import media from '../../style/media';

type Props = {
  anchor: 'left' | 'right',
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  showActivityIndicator: boolean,
  linkProps?: (language: Language) => {},
  onClose: (
    event:
      | SyntheticMouseEvent<any>
      | SyntheticKeyboardEvent<any>
      | KeyboardEvent
  ) => void
};

export default class LanguageMenu extends React.Component<Props> {
  static defaultProps = {
    anchor: 'left',
    showActivityIndicator: false
  };

  renderMenuItem = (language: Language) => {
    if (this.props.linkProps) {
      return (
        <Link key={language.code} passHref {...this.props.linkProps(language)}>
          <ListItem
            button
            component="a"
            onClick={() => this.props.onSelectLanguage(language)}
          >
            <ListItemText inset>{language.name}</ListItemText>
          </ListItem>
        </Link>
      );
    }

    return (
      <ListItem
        key={language.code}
        onClick={() => this.props.onSelectLanguage(language)}
        button
      >
        <ListItemText inset>{language.name}</ListItemText>
      </ListItem>
    );
  };

  render() {
    const {
      anchor,
      languages,
      onClose,
      selectedLanguageCode,
      showActivityIndicator
    } = this.props;

    const selectedLanguage = languages.find(
      l => l.code === selectedLanguageCode
    );

    // We don't want to display the seelected language in the list
    const filteredLanguages = selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;

    return (
      <Drawer anchor={anchor} open onClose={onClose}>
        <List
          // Add some padding bottom so we can select the bottom alternative in mobile safari
          // otherwise the option gets hidden behind browser chrome
          css={media.mobile({ paddingBottom: '100px' })}
          onClose={onClose}
          subheader={
            <ListSubheader component="div">
              <Trans>Choose language</Trans>
            </ListSubheader>
          }
        >
          {selectedLanguage && (
            <Fragment>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon css={{ color: colors.base.green }} />
                </ListItemIcon>
                <ListItemText inset>
                  <Trans>
                    <SrOnly>Selected: </SrOnly>
                    {selectedLanguage.name}
                  </Trans>
                </ListItemText>
              </ListItem>
              <Divider />
            </Fragment>
          )}
          {showActivityIndicator ? (
            <CircularProgress css={{ marginTop: spacing.large }} />
          ) : (
            filteredLanguages.map(this.renderMenuItem)
          )}
        </List>
      </Drawer>
    );
  }
}
