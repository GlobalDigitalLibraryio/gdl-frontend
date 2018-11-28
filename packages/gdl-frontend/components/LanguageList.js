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
  ListItemIcon
} from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

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

const LanguageList = ({
  languages,
  onSelectLanguage,
  selectedLanguageCode,
  linkProps
}: Props) => {
  const selectedLanguage = languages.find(l => l.code === selectedLanguageCode);

  // We don't want to display the seelected language in the list
  const filteredLanguages = selectedLanguage
    ? languages.filter(l => l !== selectedLanguage)
    : languages;

  return (
    <List
      component="div"
      subheader={
        <ListSubheader component="div">
          <Trans>ជ្រើសរើសភាសាសៀវភៅ</Trans>
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
      {filteredLanguages.map(l => (
        <LanguageItem
          key={l.code}
          language={l}
          linkProps={linkProps}
          onSelectLanguage={onSelectLanguage}
        />
      ))}
    </List>
  );
};

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
