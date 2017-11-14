// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import type { Language } from '../types';
import media from './helpers/media';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';

type Props = {
  children: React.Node,
  toolbarEnd?: React.Node,
  currentPage?: string,
  language: Language,
  router: {
    query: {
      lang?: string,
    },
  },
};

const Toolbar = styled.div`
  background: ${props => props.theme.grays.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 12px;
  height: 28px;
  ${media.tablet`
    font-size: 14px;
    height: 38px;
  `} ${Container} {
    display: flex;
    height: 100%;
  }
`;

const Layout = ({
  children,
  toolbarEnd,
  language,
  currentPage,
  router,
}: Props) => (
  <div>
    <Navbar lang={router.query.lang} />
    <Toolbar>
      <Container mw="1075px">
        <Breadcrumb
          language={language}
          lang={router.query.lang}
          router={router}
          currentPage={currentPage}
        />
        {toolbarEnd}
      </Container>
    </Toolbar>
    {children}
  </div>
);

export default withRouter(Layout);
