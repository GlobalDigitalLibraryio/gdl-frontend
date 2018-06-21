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
  Button,
  CircularProgress
} from '@material-ui/core';
import { spacing } from '../../gdl-frontend/style/theme';

type LoadingState = 'LOADING' | 'SUCCESS' | 'ERROR';

type State = {
  flaggedBooks: Array<Book>,
  loadingState: LoadingState,
  page: number,
  pageSize: number,
  totalCount: number
};

class Flagged extends React.Component<Props, State> {
  state = {
    flaggedBooks: [],
    loadingState: 'LOADING',
    page: 0,
    pageSize: 0,
    totalCount: 0
  };

  handleChangeRowsPerPage = event => {
    this.setState({ pageSize: event.target.value });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  async componentDidMount() {
    const flaggedBooksRes = await fetchFlaggedBooks();
    if (!flaggedBooksRes.isOk) {
      this.setState({ loadingState: 'ERROR' });
    } else {
      this.setState({
        loadingState: 'SUCCESS',
        flaggedBooks: flaggedBooksRes.data.results,
        page: flaggedBooksRes.data.page - 1,
        pageSize: flaggedBooksRes.data.pageSize,
        totalCount: flaggedBooksRes.data.totalCount
      });
    }
  }

  renderTableRow = (id, title, language) => {
    return (
      <TableRow key={`${id}-${language.code}`}>
        <TableCell>{title}</TableCell>
        <TableCell>{language.name}</TableCell>
        <TableCell>
          <Button variant="contained">Unflag this book</Button>
        </TableCell>
      </TableRow>
    );
  };

  renderFlaggedBooks = () => {
    const { page, pageSize, totalCount, flaggedBooks } = this.state;
    if (totalCount === 0) {
      return <div>There are no flagged books.</div>;
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Unflag book</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {flaggedBooks
            .slice(page * pageSize, page * pageSize + pageSize)
            .map(book =>
              this.renderTableRow(book.id, book.title, book.language)
            )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={totalCount}
              page={page}
              rowsPerPage={pageSize}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  };

  render() {
    const { loadingState } = this.state;
    return (
      <div>
        {loadingState === 'LOADING' && (
          <div>
            <CircularProgress
              css={{
                marginTop: spacing.large,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
          </div>
        )}
        {loadingState === 'SUCCESS' && this.renderFlaggedBooks()}
      </div>
    );
  }
}

export default Flagged;
