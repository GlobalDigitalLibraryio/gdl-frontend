// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IconButton, Tooltip } from '@material-ui/core';
import { withRouter } from 'next/router';
import Router from 'next/router';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import media from '../../../style/media';
import { misc } from '../../../style/theme';
import { SIDE_DRAWER_WIDTH } from '../../../style/constants';

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

class RouteAwareSearch extends React.Component<Props, { searchQuery: string }> {
  constructor(props) {
    super(props);

    let q = '';
    if (this.props.router.pathname === '/search' && this.props.router.query.q) {
      q = this.props.router.query.q;
    }

    this.state = {
      searchQuery: q
    };
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

export default withRouter(RouteAwareSearch);

const SearchInput = injectIntl(
  ({ autoFocus, className, onSubmit, onChange, value, intl }) => (
    /* action attribute ensures mobile safari shows search button in keyboard. See https://stackoverflow.com/a/26287843*/
    <Form role="search" onSubmit={onSubmit} className={className} action=".">
      <>
        {/* We use an adjacent sibling selector, se be careful when moving stuff around here. See Form */}
        <Input
          data-cy="search-book-field"
          aria-label={intl.formatMessage({
            id: 'Search for books',
            defaultMessage: 'Search for books'
          })}
          autoComplete="off"
          type="search"
          placeholder={intl.formatMessage({
            id: 'Search for books',
            defaultMessage: 'Search for books'
          })}
          autoFocus={autoFocus}
          onChange={onChange}
          value={value}
        />
        <Tooltip title={<FormattedMessage id="Search" />}>
          <IconButton aria-label="Search" css={iconButton} type="submit">
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </>
    </Form>
  )
);

// NB, adjacent sibling selector here. See SearchInput
const Form = styled('form')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 1;
  input:focus + button {
    color: rgba(0, 0, 0, 0.54);
  }
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
  padding-left: 50px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: background 100ms ease-in, width 100ms ease-out;
  background-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  &:focus {
    background-color: #fff;
    color: black;
    &::placeholder {
      color: rgb(117, 117, 117);
    }
  }
`;

const iconButton = css`
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  margin-left: 5px;
  color: #fff;
`;
