// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { Input, InputDesktopAppbar, Label, Container, Icon } from './styled';

type Props = {
  autoFocus?: boolean,
  id: string,
  label: string,
  onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  placeholder?: string,
  required?: boolean,
  value?: string,
  inputFieldType?: string
};

class SearchField extends React.Component<Props> {
  render() {
    const { id, label, inputFieldType } = this.props;

    let inputField;

    if (inputFieldType === 'desktopAppbar') {
      inputField = <InputDesktopAppbar id={id} type="search" {...this.props} />;
    } else if (inputFieldType === 'mobileAppbar') {
      inputField = (
        <Input
          id={id}
          type="search"
          css={{ minHeight: '56px' }}
          {...this.props}
        />
      );
    } else {
      inputField = <Input id={id} type="search" {...this.props} />;
    }

    return (
      <Container>
        <Label htmlFor={id}>{label}</Label>
        <Icon>
          <SearchIcon />
        </Icon>
        {inputField}
      </Container>
    );
  }
}

export default SearchField;
