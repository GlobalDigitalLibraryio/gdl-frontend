// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'react-emotion';

const Page = styled.div`
  color: #000;
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: 18px;
  text-align: center;
  line-height: 1.5;
  font-family: Palatino, Iowan, 'Times New Roman', Times, serif;

  br {
    display: none;
  }

  b {
    font-weight: bold;
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

export default Page;
