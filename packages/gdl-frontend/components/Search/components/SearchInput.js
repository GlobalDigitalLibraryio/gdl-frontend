// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { placeholder, hideVisually } from 'polished';
import { IconButton } from '@material-ui/core';
import styled, { css } from 'react-emotion';
import { Trans } from '@lingui/react';
import media from '../../../style/media';
import { colors } from '../../../style/theme';

type Props = {
  containerProps?: {},
  autoFocus?: boolean
};

export default class SmartSearch extends React.Component<> {
  render() {
    return <SearchInput {...this.props} />;
  }
}

const SearchInput = ({ containerProps, autoFocus }: Props) => (
  <Container {...containerProps}>
    <Label htmlFor="searchInput">
      <Trans>Search</Trans>
    </Label>
    <Input
      id="searchInput"
      type="search"
      placeholder="Search"
      autoFocus={autoFocus}
    />
    <IconButton type="submit" className={styles.iconButton}>
      <SearchIcon />
    </IconButton>
  </Container>
);

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Input = styled('input')`
  -webkit-appearance: none;
  background-color: #fff;
  width: 100%;
  outline: none;
  ${media.tablet`
    border-radius: 30px;
  `};
  border: 0;
  padding: 12px 16px;
  padding-left: 40px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  ${placeholder({ color: colors.base.gray })};
  &:focus {
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
  }
  &:hover,
  &:focus {
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  }
`;

const Label = styled('label')(hideVisually);

const styles = {
  iconButton: css`
    position: absolute;
    left: 0;
  `
};
