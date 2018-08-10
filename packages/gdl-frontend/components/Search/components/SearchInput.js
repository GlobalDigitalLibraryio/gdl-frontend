// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { placeholder } from 'polished';
import { IconButton } from '@material-ui/core';
import { withRouter } from 'next/router';
import Router from 'next/router';
import styled, { css } from 'react-emotion';
import media from '../../../style/media';
import { colors } from '../../../style/theme';

type Props = {
  autoFocus?: boolean,
  onSubmit?: () => void,
  router: {
    pathname: string,
    query: {
      q?: string
    }
  }
};

class SmartSearch extends React.Component<Props, { searchQuery: string }> {
  state = {
    searchQuery: ''
  };

  componentDidMount() {
    if (this.props.router.pathname === '/search' && this.props.router.query.q) {
      this.setState({ searchQuery: this.props.router.query.q });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const trimmedQuery = this.state.searchQuery.trim();

    if (trimmedQuery !== '') {
      Router.push({ pathname: '/search', query: { q: trimmedQuery } });
      this.props.onSubmit && this.props.onSubmit();
    }
  };

  handleChange = event => this.setState({ searchQuery: event.target.value });

  render() {
    return (
      <SearchInput
        autoFocus={this.props.autoFocus}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        value={this.state.searchQuery}
      />
    );
  }
}

export default withRouter(SmartSearch);

const SearchInput = ({ autoFocus, onSubmit, onChange, value }) => (
  /* action attribute ensures mobile safari shows search button in keyboard. See https://stackoverflow.com/a/26287843*/
  <Form role="search" onSubmit={onSubmit} action=".">
    <Input
      aria-label="Search for books"
      autoComplete="off"
      type="search"
      placeholder="Search"
      autoFocus={autoFocus}
      onChange={onChange}
      value={value}
    />
    <IconButton aria-label="Search" className={styles.iconButton} type="submit">
      <SearchIcon />
    </IconButton>
  </Form>
);

const Form = styled('form')`
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
  padding-left: 45px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  ${placeholder({ color: colors.base.gray })};
  &:focus {
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
  }
  &:hover,
  &:focus {
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  }
`;

const styles = {
  iconButton: css`
    position: absolute;
    left: 0;
  `
};
