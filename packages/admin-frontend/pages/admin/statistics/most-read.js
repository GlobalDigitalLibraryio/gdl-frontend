import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  Typography,
  CircularProgress
} from '@material-ui/core';
import type { BookStatistics } from '../../../types';
import Container from '../../../components/Container';
import Layout from '../../../components/Layout';
import { fetchMostReadBooks } from '../../../lib/fetch';

class MostRead extends React.Component<
  Props,
  { mostReadBooks: Array<BookStatistics>, loading: boolean }
> {
  state = {
    mostReadBooks: [],
    loading: true
  };

  async componentDidMount() {
    const bookStatisticsRes = await fetchMostReadBooks();

    if (bookStatisticsRes.isOk) {
      this.setState({ loading: false, mostReadBooks: bookStatisticsRes.data });
    }
  }

  render() {
    const { loading, mostReadBooks } = this.state;
    return (
      <Layout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Most read
          </Typography>
          {mostReadBooks.length === 0 && !loading && (
            <Typography variant="subtitle1" align="center">
              Could not find any statistics on most read books.
            </Typography>
          )}
          {loading ? (
            <CircularProgress />
          ) : (
            mostReadBooks.length > 0 && (
              <MostReadTable mostReadBooks={mostReadBooks} />
            )
          )}
        </Container>
      </Layout>
    );
  }
}

const MostReadTable = ({ mostReadBooks }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Count</TableCell>
          <TableCell>Title</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {mostReadBooks.map(book => (
          <TableRow key={`${book.count}-${book.title}`}>
            <TableCell>{book.count}</TableCell>
            <TableCell>{book.title}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter />
    </Table>
  );
};

export default MostRead;
