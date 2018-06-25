import * as React from 'react';
import { Fragment } from 'react';
import { fetchFlaggedBooks } from '../lib/fetch';
import type { Book } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  TablePagination
} from '@material-ui/core';
import NextLink from 'next/link';

type LoadingState = 'LOADING' | 'SUCCESS' | 'ERROR';

type State = {
  loadingState: { [number]: LoadingState },
  page: number,
  pageSize: number,
  totalCount: number,
  pages: { [number]: Array<Book> }
};

class Flagged extends React.Component<Props, State> {
  state = {
    loadingState: {},
    page: 0,
    pageSize: 30,
    totalCount: 0,
    pages: {}
  };

  handleChangePage = async (event, page) => {
    this.setState({ page });
    const loadingState = this.state.loadingState[page];
    if (!loadingState) {
      this.loadPage(page);
    }
  };

  loadPage = async page => {
    this.setState(state => ({
      loadingState: { ...state.loadingState, [page]: 'LOADING' }
    }));

    const flaggedBooksRes = await fetchFlaggedBooks(page + 1);

    if (!flaggedBooksRes.isOk) {
      this.setState(state => ({
        ...state.loadingState,
        [flaggedBooksRes.data.page - 1]: 'ERROR'
      }));
    } else {
      this.setState(state => ({
        loadingState: {
          ...state.loadingState,
          [flaggedBooksRes.data.page - 1]: 'SUCCESS'
        },
        pageSize: flaggedBooksRes.data.pageSize,
        totalCount: flaggedBooksRes.data.totalCount,
        pages: {
          ...state.pages,
          [flaggedBooksRes.data.page - 1]: flaggedBooksRes.data.results
        }
      }));
    }
  };

  async componentDidMount() {
    this.loadPage(this.state.page);
  }

  renderTableRow = (id, title, language) => {
    return (
      <TableRow key={`${id}-${language.code}`}>
        <TableCell>
          <NextLink
            href={{
              pathname: '/admin/edit',
              query: { id: id, lang: language.code }
            }}
            passHref
          >
            <a>{title}</a>
          </NextLink>
        </TableCell>
        <TableCell>{language.name}</TableCell>
      </TableRow>
    );
  };

  renderFlaggedBooks = () => {
    const { page, totalCount, pages, pageSize } = this.state;
    if (totalCount === 0) {
      return <div>There are no flagged books.</div>;
    }
    const flaggedBooks = pages[page] || [];
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Language</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {flaggedBooks.map(book =>
            this.renderTableRow(book.id, book.title, book.language)
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={totalCount}
              page={page}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[]}
              onChangePage={this.handleChangePage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  };

  render() {
    const { loadingState, page } = this.state;
    return (
      <Fragment>
        <h1>Flagged books</h1>
        {loadingState[page] === 'SUCCESS' && this.renderFlaggedBooks()}
      </Fragment>
    );
  }
}

export default Flagged;
