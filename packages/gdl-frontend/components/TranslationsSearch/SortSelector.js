//@flow

import React from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

type Props = {
  callbackFromParent: (sortBy: string) => void
};
type State = {
  sortBy: string
};

class SortSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortBy: ''
    };
  }
  handleChange(event: SyntheticInputEvent<EventTarget>) {
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
          onChange={this.handleChange.bind(this)}
          input={<OutlinedInput labelWidth={50} name="sortBy" />}
        >
          <option value="" />
          <option value="title">title (A to Z)</option>
          <option value="-title">title (Z to A)</option>
          <option value="readingLevel">level</option>
          <option value="name">to-language (A to Z)</option>
          <option value="-name">to-language (Z to A)</option>
        </Select>
      </FormControl>
    );
  }
}
export default SortSelector;
