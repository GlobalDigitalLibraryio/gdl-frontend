// @flow

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import fetch from 'isomorphic-fetch';

import type { Language } from '../types';
import { getTokenFromLocalCookie, fetchLanguages } from '../lib/fetch';
import withMuiRoot from '../withMuiRoot';
import Container from '../components/Container';

// Current book providers. Currently there's no endpoint to get these, so hardcode here for now
const providers = [
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
  selectedProvider: string,
  providers: Array<{ code: string, name: string }>,
  exportResult: string
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
    selectedProvider: 'all', // Default value
    providers,
    exportResult: ''
  };

  handleLanguageChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      selectedLanguage: event.target.value
    });
  };

  handleProviderChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      selectedProvider: event.target.value
    });
  };

  handleExportButtonClick = async () => {
    const language = this.state.selectedLanguage;
    const provider = this.state.selectedProvider;

    // Do not proceed with fetching of books if some of the selects is not filled in
    if (!language || !provider) {
      return;
    }

    // Build the url to fetch the books
    const url = `https://api.test.digitallibrary.io/book-api/v1/export/${language}/${provider}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + getTokenFromLocalCookie(),
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      this.setState({ exportResult: 'Ok!' });
    } else {
      this.setState({ exportResult: 'Unknown error' });
      return;
    }

    // Small trick to download the CSV file
    const data = await response.text();
    const MIME_TYPE = 'text/csv';
    const blob = new Blob([data], { type: MIME_TYPE });
    window.location.href = window.URL.createObjectURL(blob);
  };

  render() {
    return (
      <Container>
        <Typography variant="headline" component="h1" gutterBottom>
          Export
        </Typography>
        <Typography variant="subheading" component="h2" gutterBottom>
          Export data as CSV file
        </Typography>

        <form>
          <Grid container alignItems="center">
            <Grid item xs>
              <FormControl>
                <InputLabel htmlFor="language-select">Language</InputLabel>
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
                <InputLabel htmlFor="provider-select">Provider</InputLabel>

                <Select
                  inputProps={{ id: 'provider-select' }}
                  value={this.state.selectedProvider}
                  onChange={this.handleProviderChange}
                  native
                >
                  {this.state.providers.map(provider => (
                    <option key={provider.code} value={provider.code}>
                      {provider.name}
                    </option>
                  ))};
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <Button
                color="primary"
                disabled={Boolean(
                  !this.state.selectedProvider || !this.state.selectedLanguage
                )}
                onClick={this.handleExportButtonClick}
              >
                Export data
              </Button>
            </Grid>
          </Grid>

          <p>{this.state.exportResult}</p>
        </form>
      </Container>
    );
  }
}

export default withMuiRoot(Export);
