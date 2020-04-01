// @flow

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Typography from '@material-ui/core/Typography';

import Container from '../../components/Container';
import type { Language } from '../../types';
import { fetchLanguages, fetchSources, exportBooks } from '../../lib/fetch';
import Layout from '../../components/Layout';
import getSourceName from '../../data/sources';
import Row from '../../components/Row';

type State = {
  selectedLanguage: string,
  selectedSource: string,
  sources: Array<{ source: string, count: number }>
};

class Export extends React.Component<{ languages: Array<Language> }, State> {
  static async getInitialProps() {
    const languagesRes = await fetchLanguages();

    return {
      languages: languagesRes.isOk ? languagesRes.data : []
    };
  }

  state = {
    selectedLanguage: '',
    selectedSource: 'all', // Default value
    sources: []
  };

  handleLanguageChange = async (event: SyntheticInputEvent<EventTarget>) => {
    const languageCode = event.target.value;
    this.setState({
      selectedLanguage: languageCode
    });

    const sourcesResult = await fetchSources(languageCode);
    if (sourcesResult.isOk) {
      this.setState(state => {
        const sourcesForLanguage = sourcesResult.data;

        /* This logic keeps the source selection if the language choice includes the same source,
           otherwise we reset to ALL */
        const selectedSource = sourcesForLanguage.find(
          s => s.source === state.selectedSource
        )
          ? state.selectedSource
          : 'all';

        return { sources: sourcesResult.data, selectedSource };
      });
    }
    throw new Error('Something wrong happen during language change');
  };

  handleSourceChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      selectedSource: event.target.value
    });
  };

  handleExportButtonClick = async () => {
    const language = this.state.selectedLanguage;
    const source = this.state.selectedSource;

    // Do not proceed with fetching of books if some of the selects is not filled in
    if (!language || !source) {
      return;
    }

    const booksRes = await exportBooks(language, source);
    const data = booksRes.isOk ? booksRes.data : [];

    // Create a hidden a tag
    const a: Object = document.createElement('a');
    const body = document.body;
    // Required by flow
    if (body) {
      body.appendChild(a);
    }
    a.style = 'display: none';

    // Small trick to download the CSV file with a custom filename
    const blob = new Blob([data], { type: 'text/csv' });
    const blobUrl = window.URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = `${language}-${source}-${new Date().toLocaleString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  };

  render() {
    return (
      <Layout>
        <Container>
          <Row autoFlow="row">
            <Typography variant="h5" component="h1">
              Export books as CSV
            </Typography>
            <FormControl>
              <InputLabel htmlFor="language-select">Select language</InputLabel>
              <Select
                native
                inputProps={{ id: 'language-select' }}
                value={this.state.selectedLanguage}
                onChange={this.handleLanguageChange}
              >
                <option value="" />
                <option key="all" value="all">
                  All
                </option>
                {this.props.languages.map(language => {
                  return (
                    <option key={language.code} value={language.code}>
                      {language.name} ({language.code})
                    </option>
                  );
                })}
                ;
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="source-select">Select source</InputLabel>

              <Select
                inputProps={{ id: 'source-select' }}
                value={this.state.selectedSource}
                onChange={this.handleSourceChange}
                native
              >
                <option value="all">All</option>
                {this.state.sources.map(source => (
                  <option key={source.source} value={source.source}>
                    {getSourceName(source.source)} ({source.count})
                  </option>
                ))}
                ;
              </Select>
            </FormControl>
            <Button
              color="primary"
              disabled={Boolean(
                !this.state.selectedSource || !this.state.selectedLanguage
              )}
              onClick={this.handleExportButtonClick}
            >
              Export books
            </Button>
          </Row>
        </Container>
      </Layout>
    );
  }
}

export default Export;
