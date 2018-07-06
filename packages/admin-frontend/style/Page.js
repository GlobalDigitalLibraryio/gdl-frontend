// @flow
import styled from 'react-emotion';

import { fonts } from '../../gdl-frontend/style/theme/index';

export const Page = styled.div`
  color: #000;
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
  font-family: ${fonts.family.book};
  br {
    display: none;
  }

  b {
    font-weight: ${fonts.weight.bold};
  }

  img {
    max-width: 100%;
    max-height: 66vh;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
  }
  &:first-child {
    margin-top: 0;
  }
  overflow-y: auto;
`;
