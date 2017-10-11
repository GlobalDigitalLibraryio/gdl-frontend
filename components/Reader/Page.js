// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'styled-components';
import { space } from 'styled-system';

const Page = styled.div`
  overflow-y: auto;
  flex: 1 1 auto;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  ${space};
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
`;

Page.defaultProps = {
  px: [40, 120],
  py: [26, 40],
};

export default Page;
