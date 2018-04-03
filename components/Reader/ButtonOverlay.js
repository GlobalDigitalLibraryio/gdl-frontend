// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/lib/md';
import { Trans } from '@lingui/react';
import styled from 'react-emotion';
import SrOnly from '../SrOnly';
import { colors } from '../../style/theme';
import media from '../../style/media';

const Button = styled.button`
  color: ${colors.base.white};
  position: fixed;
  background-color: rgba(68, 68, 68, 0.1);
  height: 100%;
  width: 70px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  ${media.tablet`
    opacity: 1 !important;
    background: none; 
    
    &:hover, &:focus {
      background: rgba(0,0,0,0.1);
    }
    transition: background 0.3s ease;
    width: 120px;
  `};
`;

type Props = {
  onRequestNext(event: SyntheticEvent<HTMLButtonElement>): void,
  onRequestPrev(event: SyntheticEvent<HTMLButtonElement>): void,
  disableNext: boolean,
  disablePrev: boolean,
  showOnMobile: boolean
};

const TouchOverlay = (props: Props) => [
  <Button
    key="left"
    style={{ left: 0, opacity: props.showOnMobile ? 1 : 0 }}
    onClick={props.onRequestPrev}
    type="button"
    disabled={props.disablePrev}
  >
    <SrOnly>
      <Trans>Previous</Trans>
    </SrOnly>
    <MdKeyboardArrowLeft aria-hidden size={50} />
  </Button>,
  <Button
    key="right"
    style={{ right: 0, opacity: props.showOnMobile ? 1 : 0 }}
    onClick={props.onRequestNext}
    type="button"
    disabled={props.disableNext}
  >
    <SrOnly>
      <Trans>Next</Trans>
    </SrOnly>
    <MdKeyboardArrowRight aria-hidden size={50} />
  </Button>
];

export default TouchOverlay;
