// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import getConfig from 'next/config';
import type { ConfigShape } from '../../types';

import Container from '../../elements/Container';
import CCLogo from './cc-logo.svg';
import { colors } from '../../style/theme';
import media from '../../style/media';

import FaFacebookSquare from 'react-icons/lib/fa/facebook-square';
import FaTwitterSquare from 'react-icons/lib/fa/twitter-square';
import FaYoutubeSquare from 'react-icons/lib/fa/youtube-square';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

const FooterStyle = styled('footer')`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 50px;
  a {
    text-decoration: none;
    color: ${colors.text.default};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const WrappingList = styled('ul')`
  display: flex;
  justify-content: space-between;
  flex-grow: 3;
  flex-wrap: wrap;
  order: 2;
  font-size: 0.8rem;
  padding: 0;
  margin-left: 28px;
  list-style: none;
  li {
    padding: 8px;
  }
  ${media.tablet`
    li {
      width: 33%;
     }
  `} ${media.mobile`
    li {
      width: 50%;
    }
      margin-top: 20px;mh
  `};
`;

const SocialMediaIcons = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 14px 36px 20px 36px;
  a {
    font-size: 2.25rem;
    color: ${colors.text.subtle};
    &:hover {
      color: ${colors.default};
    }
  }
  ${media.tablet`
    order: 4;
  `};
  ${media.mobile`
    order: 1;
  `};
`;

const CreativeCommons = styled('div')`
  order: 3;
  flex-grow: 1;
  text-align: center;
  a {
    &:hover {
    fill: ${colors.default};
    }
  ${media.mobile`
    width: 100%;
  `}
`;

const Footer = () => {
  return (
    <Container
      size="large"
      stickToEdgeOnLargeScreens
      width="100%"
      // https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/
      css={{ flexShrink: '0' }}
    >
      <FooterStyle>
        <div
          css={[
            {
              order: 2,
              width: '100%',
              borderBottom: `1px solid ${colors.base.grayLight}`,
              margin: '10px'
            },
            media.tablet({ display: 'none' })
          ]}
        />

        <WrappingList>
          <li>
            <a href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
              <Trans>Cookie policy</Trans>
            </a>
          </li>
          <li>
            <a href="https://home.digitallibrary.io/privacy/">
              <Trans>Privacy policy</Trans>
            </a>
          </li>
          <li>
            <a href="https://home.digitallibrary.io/cc/">
              <Trans>Licensing and reuse</Trans>
            </a>
          </li>
          <li>
            <a href={zendeskUrl}>
              <Trans>Report issues</Trans>
            </a>
          </li>
          <li>
            <a href="https://home.digitallibrary.io/about/">
              <Trans>About</Trans>
            </a>
          </li>
          <li>
            <a href="https://blog.digitallibrary.io/">
              <Trans>Blog</Trans>
            </a>
          </li>
        </WrappingList>

        <CreativeCommons>
          <a
            href="https://creativecommons.org/"
            component="a"
            aria-label="Creative Commons"
          >
            <CCLogo css={{ width: '100px' }} />
          </a>
        </CreativeCommons>

        <SocialMediaIcons>
          <a
            title="Facebook"
            aria-label="Facebook"
            href="https://www.facebook.com/globaldigitallibrary/"
          >
            <FaFacebookSquare />
          </a>
          <a
            title="Twitter"
            aria-label="Twitter"
            href="https://twitter.com/gdigitallibrary"
          >
            <FaTwitterSquare />
          </a>
          <a
            title="YouTube"
            aria-label="YouTube"
            href="https://www.youtube.com/channel/UCN5RyDXS_aKA37YwIPzQPTg"
          >
            <FaYoutubeSquare />
          </a>
        </SocialMediaIcons>
      </FooterStyle>
    </Container>
  );
};

export default Footer;
