// @flow

/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  Typography,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  Grid
} from '@material-ui/core';
import { SaveAlt as SaveIcon } from '@material-ui/icons';
import type { BookStatistics } from '../../../types';
import Container from '../../../components/Container';
import Layout from '../../../components/Layout';
import { fetchMostReadBooks } from '../../../lib/fetch';
import formatMostReadDataToObjects from '../../../lib/utils';

type State = {
  mostReadBooks: Array<BookStatistics>,
  loading: boolean,
  numberOfBooksWanted: number,
  periodOfDays: number
};
class MostRead extends React.Component<*, State> {
  state = {
    mostReadBooks: [],
    loading: true,
    numberOfBooksWanted: 0,
    periodOfDays: 0
  };

  async componentDidMount() {
    this.fetchResults();
  }

  handleChange = (name: string) => (event: any) => {
    this.setState({
      [name]: event.target.value
    });
  };

  fetchResults = async () => {
    const { numberOfBooksWanted, periodOfDays } = this.state;
    this.setState({ loading: true });
    const bookStatisticsRes = await fetchMostReadBooks(
      numberOfBooksWanted,
      periodOfDays
    );

    this.setState({
      loading: false,
      mostReadBooks: bookStatisticsRes.isOk ? bookStatisticsRes.data : []
    });
  };

  handleExportButtonClick = async () => {
    const { numberOfBooksWanted, periodOfDays, mostReadBooks } = this.state;
    // We create a hidden a tag
    const a: Object = document.createElement('a');
    const body = document.body;
    // Required by flow
    if (body) {
      body.appendChild(a);
    }
    a.style = 'display: none';

    // Small trick to download the CSV file with a custom filename
    const blob = new Blob([mostReadBooks], { type: 'text/csv' });
    const blobUrl = window.URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `most-read-books-${periodOfDays}-days-${numberOfBooksWanted}-results.csv`;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  };

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
          <Grid container direction="row" justify="space-between">
            <FormControl style={{ flexDirection: 'row' }}>
              <TextField
                label="Period - days (0 = all)"
                value={this.state.periodOfDays}
                onChange={this.handleChange('periodOfDays')}
                type="number"
                style={{ marginRight: '15px' }}
              />
              <TextField
                label="Results (0 = all)"
                value={this.state.numberOfBooksWanted}
                onChange={this.handleChange('numberOfBooksWanted')}
                type="number"
              />
            </FormControl>
            <Grid item>
              <Button
                color="primary"
                onClick={this.fetchResults}
                variant="outlined"
                style={{ marginRight: '15px' }}
              >
                Apply filter
              </Button>
              <Button
                color="primary"
                onClick={this.handleExportButtonClick}
                variant="contained"
              >
                <SaveIcon style={{ marginRight: '5px' }} />
                Export CSV
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <CircularProgress />
          ) : (
            <MostReadTable mostReadBooks={mostReadBooks} />
          )}
        </Container>
      </Layout>
    );
  }
}

const MostReadTable = ({ mostReadBooks }) => {
  const formattedData = formatMostReadDataToObjects(mostReadBooks);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Count</TableCell>
          <TableCell>Title</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {formattedData.map(book => (
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
