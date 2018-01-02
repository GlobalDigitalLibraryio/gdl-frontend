// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { Trans } from 'lingui-react';
import {
  MdClose,
} from 'react-icons/lib/md';
import Flex from '../Flex';
import SrOnly from '../SrOnly';
import IconButton from './IconButton';
import theme from '../../style/theme';


const Div = styled(Flex) `
  border-bottom: 1px solid ${theme.colors.grayLight};
  font-size: 16px;
  font-weight: 500;
`;

type Props = {
  onClose: (event: SyntheticEvent<HTMLButtonElement>) => void,
};

const Header = ({ children, onClose, ...props }: Props) => (
  <Div justify="space-between" align="center" px={15} {...props}>
    {children}
    <IconButton type="button" onClick={onClose}>
      <MdClose />
      <SrOnly>
        <Trans>Close menu</Trans>
      </SrOnly>
    </IconButton>
  </Div>
);

export default Header;