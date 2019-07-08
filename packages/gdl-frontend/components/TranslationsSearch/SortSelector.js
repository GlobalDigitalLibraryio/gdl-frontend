//@flow

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

class SortSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ sortBy: event.target.value }, () => {
      this.props.callbackFromParent(this.state.sortBy);
    });
  }

  render() {
    return (
      <FormControl variant="outlined" css={{ width: '100%' }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          native
          value={this.state.sortBy}
          onChange={this.handleChange}
          input={<OutlinedInput labelWidth={50} name="sortBy" />}
        >
          <option value="" />
          <option value="title">title (A to Z)</option>
          <option value="-title">title (Z to A)</option>
          <option value="readingLevel">level</option>
          <option value="language">to-language (A to Z)</option>
          <option value="-language">to-language (Z to A)</option>
        </Select>
      </FormControl>
    );
  }
}
export default SortSelector;
