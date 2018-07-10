// @flow

import React from 'react';
import Avatar from '@material-ui/core/Avatar/Avatar';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Paper from '@material-ui/core/Paper/Paper';
import { ListItem } from '@material-ui/core/index';
import Link from 'next/link';
import Router from 'next/router';
import Downshift from 'downshift';

import { search } from '../../lib/fetch';
import colors from '../../style/colors';
import type { Book } from '../../types';
import SearchField from './SearchField';

const PAGE_SIZE = 10;
const LANGUAGE = 'en';
const DESCRIPTION_LENGTH = 70;

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
    Router.push(
      `/admin/edit?id=${selectedBook.id}&lang=${selectedBook.language.code}`
    );
  };

  handleSearch = (event: SyntheticInputEvent<EventTarget>) => {
    if (!event.target.value) {
      return;
    }

    this.fetchBooks(event);
  };

  fetchBooks = async (event: SyntheticInputEvent<EventTarget>) => {
    const queryRes = await search(event.target.value, LANGUAGE, {
      pageSize: PAGE_SIZE
    });

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
        itemToString={item => (item ? item.data : '')}
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
              <Paper css={{ position: 'absolute' }}>
                {result &&
                  result.results.map((book, index) => {
                    return (
                      <Link
                        href={{
                          pathname: '/admin/edit',
                          query: { id: book.id, lang: book.language.code }
                        }}
                      >
                        <ListItem
                          {...getItemProps({
                            item: book,
                            key: book.id,
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
                            secondary={
                              book.description.length > DESCRIPTION_LENGTH
                                ? book.description.slice(
                                    0,
                                    DESCRIPTION_LENGTH
                                  ) + '...'
                                : book.description
                            }
                          />
                        </ListItem>
                      </Link>
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
