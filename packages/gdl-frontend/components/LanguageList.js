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
  filterText: ?string
};

class LanguageList extends React.Component<Props, State> {
  listRef: ?React$ElementRef<List> = React.createRef();

  state = {
    filterText: undefined
  };

  /**
   * When searching, the languages get filtered and the drawer renders
   * the width corresponding to the shortest element. Therefore, we set the
   * width on the drawer dynamically to the longest element on mount.
   */
  componentDidMount() {
    if (this.props.enableSearch && this.listRef) {
      const listElement = this.listRef.current;
      const width = listElement.getBoundingClientRect().width;
      listElement.style.width = `${width}px`;
    }
  }

  getSelectedLanguage = () =>
    this.props.languages.find(l => l.code === this.props.selectedLanguageCode);

  getFilteredLanguages = (selectedLanguage: ?Language) => {
    const { languages } = this.props;
    const { filterText } = this.state;

    const withoutSelected = selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;

    return filterText
      ? withoutSelected.filter(lang =>
          lang.name.toLowerCase().includes(filterText)
        )
      : withoutSelected;
  };

  render() {
    const { enableSearch, onSelectLanguage, linkProps } = this.props;

    const selectedLanguage = this.getSelectedLanguage();
    // Remove selected language so it wont display again as a selectable language
    const filteredLanguages = this.getFilteredLanguages(selectedLanguage);
    const noResult = filteredLanguages.length === 0;

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
                          filterText: value.target.value.toLowerCase()
                        })
                      }
                    />
                  </ListItemText>
                </ListItem>
              )}
            </I18n>
          )}
          {noResult ? (
            <NoLanguageItem />
          ) : (
            filteredLanguages.map(l => (
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
          data-cy="choose-language-field"
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
