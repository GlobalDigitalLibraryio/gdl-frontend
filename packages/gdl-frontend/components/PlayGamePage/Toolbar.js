// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import SrOnly from '../../components/SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

type Props = {
  title: string,
  onClose: () => void
};

const Toolbar = ({ title, onClose }: Props) => (
  <Div>
    <div>{title}</div>
    <Buttons>
      <IconButton onClick={onClose}>
        <CloseIcon />
        <SrOnly>
          <FormattedMessage id="Close book" defaultMessage="Close book" />
        </SrOnly>
      </IconButton>
    </Buttons>
  </Div>
);

const Div = styled.div`
  z-index: 2;
  background: #fff;
  position: relative;
  position: sticky;
  top: 0;
  color: ${colors.text.subtle};
  border-bottom: 1px solid ${colors.base.grayLight};
  ${flexCenter};

  font-size: 14px;
  min-height: 48px;
  ${media.tablet`
    margin-bottom: 50px;
  `};
`;

const Buttons = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default Toolbar;
