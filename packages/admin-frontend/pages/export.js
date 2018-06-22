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
  providers: Array<{ code: string, name: string }>
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
    providers
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

    const booksRes = await exportBooks(language, provider);
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
    a.download = `${language}-${provider}-${new Date().toLocaleString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  };

  render() {
    return (
      <Container>
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
                <InputLabel htmlFor="provider-select">
                  Select provider
                </InputLabel>

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
                Export books
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    );
  }
}

export default withMuiRoot(Export);
