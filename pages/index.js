// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import H1 from '../components/H1';
import H3 from '../components/H3';
import P from '../components/P';
import A from '../components/A';
import Button from '../components/Button';
import Card from '../components/Card';
import Flex from '../components/Flex';
import Box from '../components/Box';
import Container from '../components/Container';
import defaultPage from '../hocs/defaultPage';
import Meta from '../components/Meta';

import Hero from '../components/Hero';

const PartnerImg = styled.img`
  object-fit: scale-down;
  height: 40px;
  widht: 90px;
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const Home = () => (
  <div>
    <Meta
      title="Global Digital Library"
      description="Global Digital Library (GDL)"
    />
    <Hero colorful style={{ color: '#fff' }} py={64}>
      <Container mw={1075}>
        <H1 style={{ textTransform: 'uppercase' }}>Global digital library</H1>
        <P fontSize={26}>
          The Global Digital Library (GDL) is being developed to increase the
          availability of high quality reading resources in languages children
          and youth speak and understand.
        </P>
        <P fontSize={26}>
          The GDL-project is currently collecting reading resources and piloting
          the technical platform. The platform is expected to launch before
          April 2018.
        </P>
      </Container>
    </Hero>
    <Container mw={1075}>
      <Card my={60}>
        <Flex wrap={[true, false]}>
          <Box w={[1, 0.5]} py={10} px={30} order={[1, 0]}>
            <H3>About the Global Digital Library</H3>
            <P>
              The GDL will collect existing high quality open educational
              reading resources, and make them available on web, mobile and for
              print. It will also facilitate translation and localization of
              these resources to more than 300 languages. The goal is to make at
              least 50.000 titles in 100 languages available on the GDL-platform
              by the end of 2020.
            </P>
            <P>
              The GDL’s initial purpose is to support access to high quality
              early-grade reading resources. Other types of learning resources
              may be included at a later stage.
            </P>
            <Link href="/about" passHref prefetch>
              <A>Read more about the project</A>
            </Link>
          </Box>
          <Box w={[1, 0.5]}>
            <HeroImg src="/static/children-306607.jpg" alt="Girl reading" />
          </Box>
        </Flex>
      </Card>
      <Card my={60}>
        <Flex wrap={[true, false]}>
          <Box w={[1, 0.5]}>
            <HeroImg src="/static/kids-playing.jpg" alt="Kids playing" />
          </Box>
          <Box w={[1, 0.5]} py={10} px={30}>
            <H3>Compilation of digital libraries</H3>
            <P>
              If you are looking for reading resources, All Children Reading
              have made a compilation of digital libraries, carefully curated to
              feature a variety of sites that provide local language early grade
              reading materials.
            </P>
            <A href="https://allchildrenreading.org/digital-libraries/">
              All children reading
            </A>
          </Box>
        </Flex>
      </Card>
      <Card my={60}>
        <Flex wrap={[true, false]}>
          <Box w={[1, 0.5]} py={10} px={30} order={[1, 0]}>
            <H3>Who is behind the GDL?</H3>
            <P>
              The GDL-platform is a collaborative endeavour which will require
              involvement from a broad spectrum of stakeholders in order to be
              truly successful and widely used. It is being built based on
              existing quality learning resources provided from a variety of
              initiatives.
            </P>
            <P>
              The idea to develop a Global Digital Library for reading resources
              came from All Children Reading: a Grand Challenge for Development
              (ACR) in 2014. The GDL-platform is being developed and will
              initially be operated by the Norwegian Digital Learning Arena
              (NDLA). The Norwegian Agency for Development Cooperation (Norad)
              has the overall project management responsibility.
            </P>
            <A href="http://globalbookalliance.org/">
              The Global Digital Library is part of the Global Book Alliance
            </A>
          </Box>
          <Box w={[1, 0.5]}>
            <HeroImg src="/static/boy-reading.jpg" alt="Boy reading" />
          </Box>
        </Flex>
      </Card>
      <Box textAlign="center">
        <Link href="/about">
          <Button>More about Global Digital Library</Button>
        </Link>
      </Box>
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
          <PartnerImg
            src="/static/footer/all-children.png"
            alt="All Children Reading logo"
          />
          <PartnerImg src="/static/footer/usaid.png" alt="US Aid logo" />
          <PartnerImg
            src="/static/footer/world-vision.png"
            alt="World Vision logo"
          />
          <PartnerImg
            src="/static/footer/australian-aid.png"
            alt="Australian Aid logo"
          />
          <PartnerImg src="/static/footer/norad.png" alt="Norad logo" />
          <PartnerImg src="/static/footer/ndla.png" alt="NDLA logo" />
        </Flex>
      </Container>
    </Hero>
  </div>
);

export default defaultPage(Home);
