// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'styled-components';

const Page = styled.div`
  color: #000;
  overflow-wrap: break-word;
  word-wrap: break-word;

  b {
    font-weight: bold;
  }
  & img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  & :first-child {
    margin-top: 0;
  }
  overflow-y: auto;
`;

export default Page;
