// @flow

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import type { Language } from '../types';
import { fetchLanguages, exportBooks } from '../lib/fetch';
import Layout from '../components/Layout';


// Current book sources. Currently there's no endpoint to get these, so hardcode here for now
const sources = [
  { code: 'all', name: 'All' },
  { code: 'african_storybook', name: 'African Storybook Project' },
  { code: 'bookdash', name: 'Bookdash' },
  { code: 'ew', name: 'EW' },
  { code: 'storyweaver', name: 'Storyweaver' },
  { code: 'taf', name: 'Taf' },
  { code: 'usaid', name: 'USAID' }
];

type State = {
  selectedLanguage: string,
  selectedSource: string,
  sources: Array<{ code: string, name: string }>
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
    sources: sources
  };

  handleLanguageChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      selectedLanguage: event.target.value
    });
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
        <Typography variant="headline" component="h1" gutterBottom>
          Export books as CSV
        </Typography>

        <form>
          <Grid container alignItems="center">
            <Grid item xs>
              <FormControl>
                <InputLabel htmlFor="language-select">
                  Select language
                </InputLabel>
                <Select
                  native
                  inputProps={{ id: 'language-select' }}
                  value={this.state.selectedLanguage}
                  onChange={this.handleLanguageChange}
                >
                  <option value="" />
                  {this.props.languages.map(language => {
                    return (
                      <option key={language.code} value={language.code}>
                        {language.name} ({language.code})
                      </option>
                    );
                  })};
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs>
              <FormControl>
                <InputLabel htmlFor="source-select">Select source</InputLabel>

                <Select
                  inputProps={{ id: 'source-select' }}
                  value={this.state.selectedSource}
                  onChange={this.handleSourceChange}
                  native
                >
                  {this.state.sources.map(source => (
                    <option key={source.code} value={source.code}>
                      {source.name}
                    </option>
                  ))};
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <Button
                color="primary"
                disabled={Boolean(
                  !this.state.selectedSource || !this.state.selectedLanguage
                )}
                onClick={this.handleExportButtonClick}
              >
                Export books
              </Button>
            </Grid>
          </Grid>
        </form>
      </Layout>
    );
  }
}

export default Export;
