// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField
} from '@material-ui/core';
import RootRef from '@material-ui/core/RootRef';
import { Check as CheckIcon } from '@material-ui/icons';

import { Link } from '../routes';
import SrOnly from './SrOnly';
import { colors } from '../style/theme';
import { RouteNameContext } from '../context';

import type { intlShape } from 'react-intl';
import type { languages_languages as Language } from '../gqlTypes';

type Props = {
  enableSearch?: boolean,
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  linkProps?: (language: Language, routeName: string) => {},
  intl: intlShape
};

type State = {
  filterText: ?string
};

class LanguageList extends React.Component<Props, State> {
  listRef: ?React$ElementRef<typeof List> = React.createRef();

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

  getFilteredLanguages = (selectedLanguage: ?Language): Array<Language> => {
    const { languages } = this.props;
    const { filterText } = this.state;

    const withoutSelected: Array<Language> = selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;

    return filterText
      ? withoutSelected.filter(lang =>
          lang.name.toLowerCase().includes(filterText)
        )
      : withoutSelected;
  };

  render() {
    const { enableSearch, onSelectLanguage, linkProps, intl } = this.props;

    const selectedLanguage = this.getSelectedLanguage();
    // Remove selected language so it wont display again as a selectable language
    const filteredLanguages = this.getFilteredLanguages(selectedLanguage);
    const noResult = filteredLanguages.length === 0;

    return (
      <RootRef rootRef={this.listRef}>
        <List
          component="div"
          css={{ overflowY: 'scroll' }}
          subheader={
            <ListSubheader component="div">
              <FormattedMessage
                id="Choose book language"
                defaultMessage="Choose book language"
              />
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
                  <SrOnly>
                    {intl.formatMessage({
                      id: 'Selected',
                      defaultMessage: 'Selected'
                    })}
                    {': '}
                  </SrOnly>
                  {selectedLanguage.name}
                </ListItemText>
              </ListItem>
              <Divider />
            </>
          )}
          {enableSearch && (
            <ListItem>
              <ListItemText inset>
                <TextField
                  css={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'Search',
                    defaultMessage: 'Search'
                  })}
                  onChange={value =>
                    this.setState({
                      filterText: value.target.value.toLowerCase()
                    })
                  }
                />
              </ListItemText>
            </ListItem>
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

const NoLanguageItem = () => (
  <ListItem component="div">
    <ListItemText inset>
      <FormattedMessage
        id="No language found"
        defaultMessage="No language found"
      />
    </ListItemText>
  </ListItem>
);

const LanguageItem = ({ language, linkProps, onSelectLanguage }) => {
  if (linkProps) {
    return (
      <RouteNameContext.Consumer>
        {pageRoute => (
          <Link
            key={language.code}
            passHref
            {...linkProps(language, pageRoute)}
          >
            <ListItem
              data-cy="choose-language-field"
              button
              component="a"
              onClick={() => onSelectLanguage(language)}
            >
              <ListItemText inset>{language.name}</ListItemText>
            </ListItem>
          </Link>
        )}
      </RouteNameContext.Consumer>
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

export default injectIntl(LanguageList);
