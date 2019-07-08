//@flow
import React from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

type Props = {
  languages: Array<string>,
  callbackFromParent: (language: string) => void
};
type State = {
  language: string
};
class LanguageSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      language: ''
    };
  }
  handleChange(event: SyntheticInputEvent<EventTarget>) {
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
          onChange={this.handleChange.bind(this)}
          input={<OutlinedInput labelWidth={130} name="language" />}
        >
          <option value="" />
          <option value="">All languages</option>
          {this.props.languages.map((language, i) => {
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
