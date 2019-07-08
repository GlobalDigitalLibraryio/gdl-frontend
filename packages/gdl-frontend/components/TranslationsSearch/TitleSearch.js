//@flow
import React from 'react';
import TextField from '@material-ui/core/TextField';

type Props = {
  callbackFromParent: (titleSearch: string) => void
};
type State = {
  titleSearch: string
};

class TitleSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      titleSearch: ''
    };
  }
  handleChange(event: SyntheticInputEvent<EventTarget>) {
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
        onChange={this.handleChange.bind(this)}
        variant="outlined"
        css={{ width: '100%' }}
      />
    );
  }
}
export default TitleSearch;
