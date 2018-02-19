// @flow
import styled from 'react-emotion';
import { placeholder, hideVisually } from 'polished';
import theme from '../../style/theme';

export const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: justify;
  position: relative;
`;

export const Input = styled('input')`
  background-color: #fff;
  width: 100%;
  outline: none;
  border: 1px solid #e6e5f0;
  border-bottom: 3px solid ${theme.colors.gray};
  padding: 12px 16px;
  padding-left: 40px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    border-color: #d8d8d8;
  }
  &:focus {
    border-bottom-color: ${theme.colors.blues.dark};
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
  }
  ${placeholder({ color: theme.colors.gray })};
`;

export const Icon = styled('span')`
  position: absolute;
  color: ${theme.colors.grayDark};
  margin-left: 12px;
`;

export const Label = styled('label')(hideVisually);
