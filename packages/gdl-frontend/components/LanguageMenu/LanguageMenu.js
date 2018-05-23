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
  ListItemIcon
} from '@material-ui/core';
import MdCheck from 'react-icons/lib/md/check';

import { Link } from '../../routes';
import SrOnly from '../SrOnly';
import type { Language } from '../../types';
import { ActivityIndicator } from '../../elements';
import { spacing, colors } from '../../style/theme';

type Props = {
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
    linkToLandingPage: false,
    showActivityIndicator: false
  };

  renderMenuItem = (language: Language) => {
    if (this.props.linkProps) {
      return (
        <Link key={language.code} passHref {...this.props.linkProps(language)}>
          <ListItem
            button
            onCustomClick={() => this.props.onSelectLanguage(language)}
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
      <Drawer open onClose={onClose}>
        <List
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
                <ListItemIcon aria-hidden>
                  <MdCheck color={colors.base.green} />
                </ListItemIcon>
                <ListItemText inset>
                  <SrOnly>
                    <Trans>Selected:</Trans>
                  </SrOnly>
                  {selectedLanguage.name}
                </ListItemText>
              </ListItem>
              <Divider />
            </Fragment>
          )}
          {showActivityIndicator ? (
            <ActivityIndicator
              size="large"
              style={{ marginTop: spacing.large }}
            />
          ) : (
            filteredLanguages.map(this.renderMenuItem)
          )}
        </List>
      </Drawer>
    );
  }
}
