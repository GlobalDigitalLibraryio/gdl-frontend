// @flow

import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Downshift from 'downshift';
import { Avatar, ListItemText, ListItem, Paper } from '@material-ui/core';

import { search } from '../../lib/fetch';
import colors from '../../style/colors';
import type { Book } from '../../types';
import SearchField from './SearchField';

type State = {
  searchResult: ?{
    results: Array<Book>,
    page: number,
    totalCount: number
  }
};

export default class AutoCompleteSearchField extends React.Component<
  {},
  State
> {
  state = {
    searchResult: null
  };

  handleSelection = (selectedBook: Book) => {
    Router.push({
      pathname: '/admin/edit',
      query: { id: selectedBook.id, lang: selectedBook.language.code }
    });
  };

  handleSearch = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ searchResult: null });

    if (!event.target.value) {
      return;
    }

    this.fetchBooks(event);
  };

  fetchBooks = async (event: SyntheticInputEvent<EventTarget>) => {
    const queryRes = await search(event.target.value);

    if (!queryRes.isOk) {
      return;
    }

    const searchResult = queryRes.data;

    this.setState({ searchResult: searchResult });
  };

  render() {
    const result = this.state.searchResult;

    return (
      <Downshift
        onChange={this.handleSelection}
        itemToString={item => (item ? item.title : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          isOpen,
          highlightedIndex
        }) => (
          <div>
            <SearchField
              {...getInputProps({
                placeholder: 'Search books',
                onChange: e => this.handleSearch(e),
                autoFocus: true
              })}
            />
            {isOpen ? (
              <Paper css={{ position: 'absolute', maxWidth: '960px' }}>
                {result &&
                  result.results.map((book, index) => {
                    return (
                      <ListItem
                        {...getItemProps({
                          key: book.id,
                          item: book,
                          index,
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? colors.base.grayLight
                                : 'inherit'
                          }
                        })}
                        button
                      >
                        {book.coverImage && (
                          <Avatar src={book.coverImage.url} />
                        )}
                        <ListItemText
                          primary={book.title}
                          secondary={book.description}
                          primaryTypographyProps={{ noWrap: true }}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                    );
                  })}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}
