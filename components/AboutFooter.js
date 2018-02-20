// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import Hero from './Hero';
import Container from './Container';
import Flex from './Flex';

const allChildrenPNG = require('../static/footer/all-children.png');
const australianAidPNG = require('../static/footer/australian-aid.png');
const noradPNG = require('../static/footer/norad.png');
const usaidPNG = require('../static/footer/usaid.png');
const ndlaPNG = require('../static/footer/ndla.png');
const facebookPNG = require('../static/footer/facebook.png');
const twitterPNG = require('../static/footer/twitter.png');
const emailPNG = require('../static/footer/mail.png');
const worldvisionPNG = require('../static/footer/world-vision.png');

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
      <Flex justifyContent="center" mt={40}>
        <SocialLink
          href="https://www.facebook.com/globaldigitallibrary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={facebookPNG} alt="GDL on Facebook" />
        </SocialLink>
        <SocialLink
          id="twitter"
          href="https://twitter.com/gdigitallibrary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={twitterPNG} alt="GDL on Twitter" />
        </SocialLink>
        <SocialLink href="mailto:christer@digitallibrary.io">
          <img src={emailPNG} alt="Send us an e-mail" />
        </SocialLink>
      </Flex>
    </Container>
    <Hero mt={32}>
      <Container py={32} mw={1075}>
        <Flex justifyContent="space-between" flexWrap="wrap">
          <a href="https://allchildrenreading.org/">
            <PartnerImg src={allChildrenPNG} alt="All Children Reading" />
          </a>
          <a href="https://www.usaid.gov/">
            <PartnerImg src={usaidPNG} alt="USAID" />
          </a>
          <a href="https://www.worldvision.org/">
            <PartnerImg src={worldvisionPNG} alt="World Vision" />
          </a>
          <PartnerImg src={australianAidPNG} alt="Australian Aid" />
          <a href="https://norad.no/en/front/">
            <PartnerImg src={noradPNG} alt="NORAD" />
          </a>
          <a href="https://ndla.no/">
            <PartnerImg src={ndlaPNG} alt="NDLA" />
          </a>
        </Flex>
      </Container>
    </Hero>
  </footer>
);

export default Footer;
