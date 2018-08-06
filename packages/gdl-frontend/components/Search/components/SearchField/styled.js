// @flow
import styled from 'react-emotion';
import { placeholder, hideVisually } from 'polished';
import { colors } from '../../../../style/theme';

export const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: justify;
  position: relative;

  :focus-within {
    ::after {
      content: '';
      position: absolute;
      bottom: 0;
    }
  }
`;

export const Input = styled('input')`
  -webkit-appearance: none;
  background-color: #fff;
  width: 100%;
  outline: none;
  border-radius: 0;
  border: 1px solid #bbbbbb;
  padding: 12px 16px;
  font-size: 1rem;
  line-height: 1.5rem;
  transition: all 0.2s ease-in-out;
  ${placeholder({ color: colors.base.gray })};

  &:hover,
  &:focus {
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  }
  &:focus {
    ${placeholder({ color: 'rgb(117, 117, 117)' })};
    border: 1px solid ${colors.default};
  }
`;

export const InputDesktopAppbar = styled('input')`
  -webkit-appearance: none;
  background-color: #fff;
  width: 100%;
  outline: none;
  border-radius: 0;
  border: 0;
  padding: 12px 16px;
  padding-left: 48px;
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

export const Label = styled('label')(hideVisually);
