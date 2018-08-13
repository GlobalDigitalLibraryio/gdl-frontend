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
import { Trans } from '@lingui/react';
import { IconButton, Tooltip } from '@material-ui/core';
import { withRouter } from 'next/router';
import Router from 'next/router';
import styled, { css } from 'react-emotion';

import I18n from '../../I18n';
import media from '../../../style/media';
import { colors } from '../../../style/theme';

type Props = {
  autoFocus?: boolean,
  className?: string,
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
        className={this.props.className}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        value={this.state.searchQuery}
      />
    );
  }
}

export default withRouter(SmartSearch);

const SearchInput = ({ autoFocus, className, onSubmit, onChange, value }) => (
  /* action attribute ensures mobile safari shows search button in keyboard. See https://stackoverflow.com/a/26287843*/
  <Form role="search" onSubmit={onSubmit} className={className} action=".">
    <I18n>
      {({ i18n }) => (
        <>
          <Input
            aria-label={i18n.t`Search for books`}
            autoComplete="off"
            type="search"
            placeholder={i18n.t`Search`}
            autoFocus={autoFocus}
            onChange={onChange}
            value={value}
          />
          <Tooltip title={<Trans>Search</Trans>}>
            <IconButton
              aria-label="Search"
              className={styles.iconButton}
              type="submit"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </I18n>
  </Form>
);

const Form = styled('form')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 1024px;
  flex: 1;
`;

/**
 * Set height on mobile so it takes up as much space as the appbar
 */
const Input = styled('input')`
  -webkit-appearance: none;
  width: 100%;
  outline: none;
  ${media.tablet`
    border-radius: 4px;
  `};
  ${media.mobile`
    min-height: 56px;
  `};
  border: 0;
  padding: 12px 16px;
  padding-left: 45px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  background-color: #fff;
  ${placeholder({ color: colors.base.gray })};
  &:focus,
  &:hover {
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
  }
`;

const styles = {
  iconButton: css`
    position: absolute;
    left: 0;
  `
};
