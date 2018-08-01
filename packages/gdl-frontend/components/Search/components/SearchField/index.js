// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { Container, Input, InputDesktopAppbar, Label } from './styled';
import { IconButton } from '@material-ui/core';

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

    let submitButton =
      inputFieldType === 'desktopAppbar' ? (
        <IconButton
          aria-label="Search"
          type="submit"
          css={{ position: 'absolute' }}
        >
          <SearchIcon />
        </IconButton>
      ) : (
        <IconButton aria-label="Search" type="submit">
          <SearchIcon />
        </IconButton>
      );

    return (
      <Container>
        <Label htmlFor={id}>{label}</Label>
        {inputField}
        {submitButton}
      </Container>
    );
  }
}

export default SearchField;
