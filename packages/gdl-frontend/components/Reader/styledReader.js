// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { fonts } from '../../style/theme';
import media from '../../style/media';

export const Page = styled('div')`
  color: #000;
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-size: 1.375rem;
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
  &:first-of-type {
    margin-top: 0;
  }
  overflow-y: auto;

  padding: 20px 40px;
  flex: 1 auto;
  ${media.tablet`
    padding-left: 120px;
    padding-right: 120px;
  `};
`;

export const Backdrop = () => (
  <Global
    styles={css`
      body {
        background-color: rgba(0, 0, 0, 0.7);
      }
    `}
  />
);
