// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import getConfig from 'next/config';
import type { ConfigShape } from '../../types';

import { withOnlineStatusContext } from '../OnlineStatusContext';
import { FacebookIcon, TwitterIcon, YoutubeIcon } from '../../components/icons';
import Container from '../../elements/Container';
import CCLogo from './cc-logo.svg';
import { colors } from '../../style/theme';
import media from '../../style/media';

const UNESCO_LOGO_URL = '/static/unesco.png';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

const Footer = ({ online }) => {
  if (!online) return null;
  return (
    <FooterWrapper>
      <Container
        size="small"
        // https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/
        css={{ flexShrink: '0', width: '100%' }}
      >
        <FooterStyle>
          <div
            css={[
              {
                order: 2,
                width: '100%',
                borderBottom: `1px solid ${colors.base.grayLight}`,
                margin: '10px 10px 18px'
              },
              media.tablet({ display: 'none' })
            ]}
          />

          <Unesco>
            <a href="https://en.unesco.org/" aria-label="Unesco">
              <img
                src={UNESCO_LOGO_URL}
                css={{ width: '150px' }}
                alt="Unesco"
              />
            </a>
          </Unesco>

          <LinkList>
            <li>
              <a href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
                <FormattedMessage
                  id="Cookie policy"
                  defaultMessage="Cookie policy"
                />
              </a>
            </li>
            <li>
              <a href="https://home.digitallibrary.io/accessibility/">
                <FormattedMessage
                  id="Accessibility"
                  defaultMessage="Accessibility"
                />
              </a>
            </li>
            <li>
              <a href="https://home.digitallibrary.io/privacy/">
                <FormattedMessage
                  id="Privacy policy"
                  defaultMessage="Privacy policy"
                />
              </a>
            </li>
            <li>
              <a href="https://home.digitallibrary.io/cc/">
                <FormattedMessage
                  id="Licensing and reuse"
                  defaultMessage="Licensing and reuse"
                />
              </a>
            </li>
            <li>
              <a href={zendeskUrl}>
                <FormattedMessage
                  id="Report issues"
                  defaultMessage="Report issues"
                />
              </a>
            </li>
            <li>
              <a href="https://home.digitallibrary.io/about/">
                <FormattedMessage id="About" defaultMessage="About" />
              </a>
            </li>
            <li>
              <a href="https://blog.digitallibrary.io/">
                <FormattedMessage id="Blog" defaultMessage="Blog" />
              </a>
            </li>
          </LinkList>

          <CreativeCommons>
            <a
              href="https://creativecommons.org/"
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
              <FacebookIcon />
            </a>
            <a
              title="Twitter"
              aria-label="Twitter"
              href="https://twitter.com/gdigitallibrary"
            >
              <TwitterIcon />
            </a>
            <a
              title="YouTube"
              aria-label="YouTube"
              href="https://www.youtube.com/channel/UCN5RyDXS_aKA37YwIPzQPTg"
            >
              <YoutubeIcon />
            </a>
          </SocialMediaIcons>
        </FooterStyle>
      </Container>
    </FooterWrapper>
  );
};

const FooterWrapper = styled('footer')`
  background-color: #f6f7f9;
  border-top: solid 0.5px rgba(112, 112, 112, 0.22);
  margin-top: 24px;
`;

const FooterStyle = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 50px;
  position: relative;
  a {
    text-decoration: none;
    color: ${colors.text.default};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Unesco = styled('div')`
  order: 3;
  flex-grow: 1;
  text-align: center;
  padding-right: 15px;
  a:hover {
    fill: ${colors.default};
  }
  ${media.tablet`
    order: 1;
  `};
  ${media.largerTablet`
    order: 1;
  `}
`;

const LinkList = styled('ul')`
  display: flex;
  justify-content: space-between;
  flex-grow: 2;
  flex-wrap: wrap;
  order: 2;
  font-size: 0.8rem;
  padding: 0;
  margin-left: 28px;
  list-style: none;
  width: 75%;
  li {
    padding: 8px;
    width: 45%;
    ${media.tablet`
      width: 45%;
  `}
  }
  ${media.tablet`
  width: 45%;
`};
  ${media.largerTablet`
    li {
      padding: 8px 0;
      width: 40%;
    }
    margin-left: 10px;
    width: 33%;
  `}
`;

const SocialMediaIcons = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 14px 36px 20px 36px;
  svg {
    font-size: 2.25rem;
  }
  a {
    color: ${colors.text.subtle};
    &:hover {
      color: ${colors.default};
    }
  }
  order: 1;
  ${media.tablet`
    order: 4;
  `};
  ${media.largerTablet`
    order: 4;
    margin: 14px 0 14px 30px;
  `}
`;

const CreativeCommons = styled('div')`
  order: 4;
  flex-grow: 1;
  text-align: center;
  a:hover {
    fill: ${colors.default};
  }
`;

export default withOnlineStatusContext(Footer);
