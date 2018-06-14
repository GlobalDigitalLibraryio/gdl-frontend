// @flow

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import fetch from 'isomorphic-fetch';
import {allLanguagesWithContentUrl} from '../config';
import {getTokenFromLocalCookie} from '../lib/fetch';

type State = {
    selectedLanguage: string,
    selectedProvider: string,
    languages: Array<{ code: string, name: string }>,
    providers: Array<{ code: string, name: string }>,
    inputCompleted: boolean
};

class Export extends React.Component<State> {
    state = {
        selectedLanguage: '',
        selectedProvider: '',
        languages: [],
        providers: [
            {code: "all", name: 'All'},
            {code: "african_storybook", name: 'African Storybook'},
            {code: "bookdash", name: "Bookdash"},
            {code: "ew", name: "EW"},
            {code: "storyweaver", name: "Storyweaver"},
            {code: "taf", name: "Taf"},
            {code: "usaid", name: "Usaid"}
        ]
    };

    handleLanguageChange = (event: Event) => {
        this.setState({
            selectedLanguage: event.target.value,
        });
    };

    handleProviderChange = (event: Event) => {

        const toState = event.target.value;
        this.setState({
            selectedProvider: toState
        });

    };

    componentDidMount() {
        this.getLanguages();
    }

    getLanguages = async () => {
        const result = await fetch(allLanguagesWithContentUrl);
        const languages = await result.json();

        this.setState({languages});
    };

    exportBooks = async () => {

        const language = this.state.selectedLanguage;
        const provider = this.state.selectedProvider;


        // Do not proceed with fetching of books if some of the selects is not filled in
        if (this.state.selectedLanguage === '' || this.state.selectedProvider === '') {
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

        // Download the CSV file
        const data = await response.text();
        const MIME_TYPE = 'text/csv';
        const blob = new Blob([data], {type: MIME_TYPE});
        window.location.href = window.URL.createObjectURL(blob);
    };

    render() {
        return <div>
            <h1>Export books from language and provider</h1>

            <form>
                <FormControl css={{minWidth: 120}}>
                    <InputLabel
                        htmlFor="language-select"
                    >
                        Language
                    </InputLabel>
                    <Select
                        inputProps={{id: 'language-select'}}
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

                <FormControl css={{minWidth: 120}}>
                    <InputLabel
                        htmlFor="provider-select"
                    >
                        Provider
                    </InputLabel>

                    <Select
                        inputProps={{id: 'provider-select'}}
                        value={this.state.selectedProvider}
                        onChange={this.handleProviderChange}
                    >
                        {this.state.providers.map(provider =>
                            <MenuItem key={provider.code} value={provider.code}>{provider.name}</MenuItem>
                        )};
                    </Select>
                </FormControl>
                <Button color="primary" onClick={this.exportBooks}>
                    Export data
                </Button>
            </form>
        </div>;
    }
}

export default Export;
