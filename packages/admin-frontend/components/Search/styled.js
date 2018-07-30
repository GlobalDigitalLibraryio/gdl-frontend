// @flow
import styled from 'react-emotion';
import { placeholder, hideVisually } from 'polished';
import colors from '../../style/colors';

export const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: justify;
  position: relative;
`;

export const Input = styled('input')`
  -webkit-appearance: none;
  background-color: #fff;
  width: 100%;
  outline: none;
  border-radius: 0;
  border: 1px solid #bbbbbb;
  padding: 12px 16px;
  padding-left: 40px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  ${placeholder({ color: colors.base.gray })};

  &:focus {
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
  }
  &:hover,
  &:focus {
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  }
`;

export const Icon = styled('span')`
  position: absolute;
  color: ${colors.base.grayDarkest};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  top: 0;
  bottom: 0;
  width: 40px;
`;

export const Label = styled('label')(hideVisually);
