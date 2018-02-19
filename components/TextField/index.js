// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { MdSearch } from 'react-icons/lib/md';
import { Input, Label, Container, Icon } from './styledTextField';

type Props = {
  autoFocus?: boolean,
  disabled?: boolean,
  id: string,
  label: string,
  maxLength?: number,
  minLength?: number,
  pattern?: string,
  name?: string,
  onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  placeholder?: string,
  readOnly?: boolean,
  required?: boolean,
  type: 'text' | 'password' | 'email' | 'search',
  value?: string
};

const TextField = ({ id, label, ...props }: Props) => (
  <Container>
    <Label htmlFor={id}>{label}</Label>
    <Icon>
      <MdSearch aria-hidden />
    </Icon>
    <Input id={id} {...props} />
  </Container>
);

TextField.defaultProps = {
  type: 'text'
};

export default TextField;
