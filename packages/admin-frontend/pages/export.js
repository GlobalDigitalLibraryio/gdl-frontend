// @flow

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import fetch from 'isomorphic-fetch';

import { getTokenFromLocalCookie, fetchLanguages } from '../lib/fetch';

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
  languages: Array<{ code: string, name: string }>,
  providers: Array<{ code: string, name: string }>,
  exportResult: string
};

class Export extends React.Component<{}, State> {
  state = {
    selectedLanguage: '',
    selectedProvider: '',
    languages: [],
    providers,
    exportResult: ''
  };

  componentDidMount() {
    this.getLanguages();
  }

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

  getLanguages = async () => {
    const languages = await fetchLanguages();

    if (languages.isOk) {
      this.setState({ languages: languages.data });
    }
  };

  handleExportButtonClick = async () => {
    const language = this.state.selectedLanguage;
    const provider = this.state.selectedProvider;

    // Do not proceed with fetching of books if some of the selects is not filled in
    if (
      this.state.selectedLanguage === '' ||
      this.state.selectedProvider === ''
    ) {
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
    } else if (response.status === 403) {
      this.setState({ exportResult: 'Unauthorized please login!' });
      return;
    } else {
      this.setState({ exportResult: 'Unknown error' });
      return;
    }

    // Download the CSV file
    const data = await response.text();
    const MIME_TYPE = 'text/csv';
    const blob = new Blob([data], { type: MIME_TYPE });
    window.location.href = window.URL.createObjectURL(blob);
  };

  render() {
    return (
      <div>
        <h1>Export books from language and provider</h1>

        <form>
          <FormControl>
            <InputLabel htmlFor="language-select">Language</InputLabel>
            <Select
              inputProps={{ id: 'language-select' }}
              value={this.state.selectedLanguage}
              onChange={this.handleLanguageChange}
            >
              {this.state.languages.map(language => {
                return (
                  <MenuItem key={language.code} value={language.code}>
                    {language.name}
                  </MenuItem>
                );
              })};
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="provider-select">Provider</InputLabel>

            <Select
              inputProps={{ id: 'provider-select' }}
              value={this.state.selectedProvider}
              onChange={this.handleProviderChange}
            >
              {this.state.providers.map(provider => (
                <MenuItem key={provider.code} value={provider.code}>
                  {provider.name}
                </MenuItem>
              ))};
            </Select>
          </FormControl>
          <Button
            color="primary"
            disabled={Boolean(
              !this.state.selectedProvider || !this.state.selectedLanguage
            )}
            onClick={this.handleExportButtonClick}
          >
            Export data
          </Button>

          <p>{this.state.exportResult}</p>
        </form>
      </div>
    );
  }
}

export default Export;
