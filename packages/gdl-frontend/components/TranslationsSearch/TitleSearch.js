//@flow

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import styled from '@emotion/styled';
import TextField from '@material-ui/core/TextField';

class TitleSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleSearch: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ titleSearch: event.target.value }, () => {
      this.props.callbackFromParent(this.state.titleSearch);
    });
  }

  render() {
    return (
      <TextField
        id="standard-search"
        label="Search titles"
        type="search"
        value={this.state.titleSearch}
        onChange={() => this.handleChange(event)}
        variant="outlined"
        css={{ width: '100%' }}
      />
    );
  }
}
export default TitleSearch;
