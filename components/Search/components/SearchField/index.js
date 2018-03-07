// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { MdSearch } from 'react-icons/lib/md';
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

const SearchField = ({ id, label, ...props }: Props) => (
  <Container>
    <Label htmlFor={id}>{label}</Label>
    <Icon>
      <MdSearch aria-hidden />
    </Icon>
    <Input id={id} type="search" {...props} />
  </Container>
);

export default SearchField;
