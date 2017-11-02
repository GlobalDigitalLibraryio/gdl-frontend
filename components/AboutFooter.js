// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import Hero from './Hero';
import Container from './Container';
import Flex from './Flex';

const PartnerImg = styled.img`
  object-fit: scale-down;
  height: 40px;
  widht: 90px;
`;

const SocialLink = styled.a`
  margin-left: 10px;
  margin-right: 10px;
  &:focus img,
  &:hover img {
    margin-top: -5px;
  }

  img {
    transition: margin-top 100ms ease-in-out;
    width: 50px;
    height: 50px;
  }
`;

const Footer = () => (
  <footer>
    <Container>
      <Flex justify="center" mt={40}>
        <SocialLink
          href="https://www.facebook.com/globaldigitallibrary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/static/footer/facebook.png" alt="GDL on Facebook" />
        </SocialLink>
        <SocialLink
          id="twitter"
          href="https://twitter.com/gdigitallibrary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/static/footer/twitter.png" alt="GDL on Twitter" />
        </SocialLink>
        <SocialLink href="mailto:christer@digitallibrary.io">
          <img src="/static/footer/mail.png" alt="Send us an e-mail" />
        </SocialLink>
      </Flex>
    </Container>
    <Hero mt={32}>
      <Container py={32} mw={1075}>
        <Flex justify="space-between" wrap>
          <a href="https://allchildrenreading.org/">
            <PartnerImg
              src="/static/footer/all-children.png"
              alt="All Children Reading"
            />
          </a>
          <a href="https://www.usaid.gov/">
            <PartnerImg src="/static/footer/usaid.png" alt="USAID" />
          </a>
          <a href="https://www.worldvision.org/">
            <PartnerImg
              src="/static/footer/world-vision.png"
              alt="World Vision"
            />
          </a>
          <PartnerImg
            src="/static/footer/australian-aid.png"
            alt="Australian Aid"
          />
          <a href="https://norad.no/en/front/">
            <PartnerImg src="/static/footer/norad.png" alt="NORAD" />
          </a>
          <a href="https://ndla.no/">
            <PartnerImg src="/static/footer/ndla.png" alt="NDLA" />
          </a>
        </Flex>
      </Container>
    </Hero>
  </footer>
);

export default Footer;
