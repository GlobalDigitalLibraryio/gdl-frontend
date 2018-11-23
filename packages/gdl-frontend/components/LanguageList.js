// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import {
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { css } from 'react-emotion';

import { Link } from '../routes';
import SrOnly from './SrOnly';
import type { Language } from '../types';
import { colors } from '../style/theme';

type Props = {
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  linkProps?: (language: Language) => {}
};

type State = {
  searchResult: Array<Language>
};

class LanguageList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const selectedLanguage = this.getSelectedLangauge();
    const filteredLanguages = this.getFilteredLanguages(selectedLanguage);

    this.state = {
      searchResult: filteredLanguages
    };
  }

  searchLanguage = (
    value: SyntheticInputEvent<EventTarget>,
    filteredLanguages: Array<Language>
  ) => {
    const input = value.target.value.toLowerCase();

    const result = filteredLanguages.filter(element =>
      element.name.toLowerCase().includes(input)
    );
    this.setState({ searchResult: result });
  };

  getSelectedLangauge = () =>
    this.props.languages.find(l => l.code === this.props.selectedLanguageCode);

  // Remove selected language so it wont display again as a selectable language
  getFilteredLanguages = (selectedLanguage: ?Language) => {
    const { languages } = this.props;
    return selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;
  };

  render() {
    const { onSelectLanguage, linkProps } = this.props;
    const { searchResult } = this.state;

    const selectedLanguage = this.getSelectedLangauge();
    const filteredLanguages = this.getFilteredLanguages(selectedLanguage);
    const noResult = searchResult.length === 0;

    return (
      <List
        component="div"
        className={styles.visibleScrollbar}
        subheader={
          <ListSubheader component="div">
            <Trans>Choose book language</Trans>
          </ListSubheader>
        }
      >
        <TextField
          placeholder="Search here"
          className={styles.textfield}
          onChange={values => this.searchLanguage(values, filteredLanguages)}
        />

        {selectedLanguage && (
          <>
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
          </>
        )}
        {noResult ? (
          <NoLanguageItem />
        ) : (
          searchResult.map(l => (
            <LanguageItem
              key={l.code}
              language={l}
              linkProps={linkProps}
              onSelectLanguage={onSelectLanguage}
            />
          ))
        )}
      </List>
    );
  }
}

const styles = {
  visibleScrollbar: css`
    overflow-y: scroll;
    width: 300px;
  `,
  textfield: css`
    width: 300px;
    padding: 0 16px;
    @media (min-width: 600px) {
      padding: 0 24px;
    }
  `
};

const NoLanguageItem = () => (
  <ListItem component="div">
    <ListItemText inset>No language found</ListItemText>
  </ListItem>
);

const LanguageItem = ({ language, linkProps, onSelectLanguage }) => {
  if (linkProps) {
    return (
      <Link key={language.code} passHref {...linkProps(language)}>
        <ListItem
          button
          component="a"
          onClick={() => onSelectLanguage(language)}
        >
          <ListItemText inset>{language.name}</ListItemText>
        </ListItem>
      </Link>
    );
  }

  return (
    <ListItem
      key={language.code}
      onClick={() => onSelectLanguage(language)}
      button
    >
      <ListItemText inset>{language.name}</ListItemText>
    </ListItem>
  );
};

export default LanguageList;
