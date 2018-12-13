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
  TextField,
  RootRef
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { css } from 'react-emotion';
import { I18n } from '@lingui/react';

import { Link } from '../routes';
import SrOnly from './SrOnly';
import type { Language } from '../types';
import { colors } from '../style/theme';

type Props = {
  enableSearch?: boolean,
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  linkProps?: (language: Language) => {}
};

type State = {
  input: ?string
};

class LanguageList extends React.Component<Props, State> {
  listRef: ?React$ElementRef<List> = React.createRef();

  state = {
    input: undefined
  };

  componentDidMount() {
    if (this.listRef) {
      const width = this.listRef.current.offsetWidth;
      this.listRef.current.style.width = `${width}px`;
    }
  }

  getSelectedLanguage = () =>
    this.props.languages.find(l => l.code === this.props.selectedLanguageCode);

  getFilteredLanguages = (selectedLanguage: ?Language) => {
    const { languages } = this.props;
    return selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;
  };

  render() {
    const { enableSearch, onSelectLanguage, linkProps } = this.props;
    const { input } = this.state;

    const selectedLanguage = this.getSelectedLanguage();
    // Remove selected language so it wont display again as a selectable language
    const filteredLanguages = this.getFilteredLanguages(selectedLanguage);
    const searchResult = input
      ? filteredLanguages.filter(lang =>
          lang.name.toLowerCase().includes(input)
        )
      : filteredLanguages;
    const noResult = searchResult.length === 0;

    return (
      <RootRef rootRef={this.listRef}>
        <List
          component="div"
          className={styles.visibleScrollbar}
          subheader={
            <ListSubheader component="div">
              <Trans>Choose book language</Trans>
            </ListSubheader>
          }
        >
          {enableSearch && (
            <I18n>
              {({ i18n }) => (
                <ListItem>
                  <ListItemText inset>
                    <TextField
                      className={styles.textfield}
                      placeholder={i18n.t`Search`}
                      onChange={value =>
                        this.setState({
                          input: value.target.value.toLowerCase()
                        })
                      }
                    />
                  </ListItemText>
                </ListItem>
              )}
            </I18n>
          )}

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
      </RootRef>
    );
  }
}

const styles = {
  visibleScrollbar: css`
    overflow-y: scroll;
  `,
  textfield: css`
    width: 100%;
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
