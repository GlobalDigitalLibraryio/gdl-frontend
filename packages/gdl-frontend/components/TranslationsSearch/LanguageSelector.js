//@flow

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

class LanguageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.languages = props.languages;
    this.state = {
      language: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ language: event.target.value }, () => {
      this.props.callbackFromParent(this.state.language);
    });
  }

  render() {
    return (
      <FormControl variant="outlined" css={{ width: '100%' }}>
        <InputLabel>select to-language</InputLabel>
        <Select
          native
          value={this.state.language}
          onChange={this.handleChange}
          input={<OutlinedInput labelWidth={130} name="language" />}
        >
          <option value="" />
          <option value="">All languages</option>
          {this.languages.map((language, i) => {
            return (
              <option value={language} key={i}>
                {language}
              </option>
            );
          })}
        </Select>
      </FormControl>
    );
  }
}
export default LanguageSelector;
