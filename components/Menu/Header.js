// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import { MdClose } from 'react-icons/lib/md';
import Flex from '../Flex';
import SrOnly from '../SrOnly';
import IconButton from './IconButton';
import theme from '../../style/theme';

const Div = styled(Flex)`
  border-bottom: 1px solid ${theme.colors.grayLight};
  font-size: 16px;
  font-weight: 500;
`;

type Props = {
  onClose: (event: SyntheticEvent<HTMLButtonElement>) => void,
  children: React.Node
};

const Header = ({ children, onClose, ...props }: Props) => (
  <Div justifyContent="space-between" alignItems="center" px={15} {...props}>
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
