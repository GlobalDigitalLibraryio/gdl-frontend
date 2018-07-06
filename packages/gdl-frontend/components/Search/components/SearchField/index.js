// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';
import { Input, Label, Container, Icon } from './styled';

type Props = {
  autoFocus?: boolean,
  id: string,
  label: string,
  onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  placeholder?: string,
  required?: boolean,
  value?: string
};

class SearchField extends React.Component<Props> {
  render() {
    const { id, label } = this.props;

    return (
      <Container>
        <Label htmlFor={id}>{label}</Label>
        <Icon>
          <SearchIcon />
        </Icon>
        <Input id={id} type="search" {...this.props} />
      </Container>
    );
  }
}

export default SearchField;
