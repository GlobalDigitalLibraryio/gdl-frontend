//@flow
import React from 'react';
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
        onChange={() => this.handleChange()}
        variant="outlined"
        css={{ width: '100%' }}
      />
    );
  }
}
export default TitleSearch;
