import * as React from 'react';
import { fetchFlaggedBooks } from '../lib/fetch';
import type { Book } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  TablePagination,
  Typography
} from '@material-ui/core';
import NextLink from 'next/link';
import Layout from '../components/Layout';

type LoadingState = 'LOADING' | 'SUCCESS' | 'ERROR';

type State = {
  loadingState: { [number]: LoadingState },
  page: number,
  pageSize: number,
  totalCount?: number,
  pages: { [number]: Array<Book> }
};

class Flagged extends React.Component<Props, State> {
  state = {
    loadingState: {},
    page: 0,
    pageSize: 30,
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

    const flaggedBooksRes = await fetchFlaggedBooks(
      this.state.pageSize,
      page + 1
    );

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

  render() {
    const { loadingState, page, totalCount, pageSize, pages } = this.state;

    return (
      <Layout>
        <Typography variant="headline" gutterBottom>
          Flagged books
        </Typography>

        {totalCount === 0 && (
          <Typography variant="subheading" align="center">
            Could not find any flagged books.
          </Typography>
        )}

        {totalCount > 0 && (
          <FlaggedTable
            page={page}
            totalCount={totalCount}
            pageSize={pageSize}
            pages={pages}
            onPageChange={this.handleChangePage}
            loadingState={loadingState}
          />
        )}
      </Layout>
    );
  }
}

const FlaggedTable = ({
  page,
  totalCount,
  pageSize,
  loadingState,
  onPageChange,
  pages
}) => {
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
        {loadingState[page] === 'SUCCESS' &&
          flaggedBooks.map(book => (
            <TableRow key={`${book.id}-${book.language.code}`}>
              <TableCell>
                <NextLink
                  href={{
                    pathname: '/admin/edit',
                    query: { id: book.id, lang: book.language.code }
                  }}
                  passHref
                >
                  <a>{book.title}</a>
                </NextLink>
              </TableCell>
              <TableCell>{book.language.name}</TableCell>
            </TableRow>
          ))}
      </TableBody>

      <TableFooter>
        <TableRow />
        <TableRow>
          <TablePagination
            count={totalCount}
            page={page}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[]}
            onChangePage={onPageChange}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default Flagged;
