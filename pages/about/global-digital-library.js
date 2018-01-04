// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Link } from '../../routes';
import defaultPage from '../../hocs/defaultPage';
import A from '../../components/A';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Head from '../../components/Head';
import H1 from '../../components/H1';
import H3 from '../../components/H3';
import P from '../../components/P';
import { HeroWithIcons } from '../about';
import Footer from '../../components/AboutFooter';

const GlobalDigitalLibrary = () => (
  <div>
    <Head title="Who are we?" />
    <HeroWithIcons
      h={455}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: -1 }}
    />
    <Container mw={1075} mt={[20, 100]}>
      <Card px={[20, 80]} py={20}>
        <H1>The Global Digital Library</H1>
        <H3>Introduction</H3>
        <P>
          Major progress has been made towards increasing primary school
          enrolment rates. Still, 250 million children of primary school age are
          not able to recognize basic letters and numbers, despite most of them
          having attended school for several years. There are also 750 million
          illiterate youth and adults. One important reason for one billion
          people not learning to read is that they do not have access to quality
          early grade reading resources in a language they understand.
        </P>
        <P>
          The Global Digital Library (GDL) is being developed to increase the
          availability of high quality reading resources in underserved
          languages worldwide. “Underserved languages” refer to languages where
          there is currently a lack of quality early grade reading resources.
          “Reading resources” refer primarily to supplementary reading books and
          reading textbooks, but the GDL will also link to some more interactive
          resources, such as literacy games.
        </P>
        <H3>What is the purpose of the Global Digital Library?</H3>
        <P>
          The GDL will collect existing high quality open educational reading
          resources, and make them available on web, mobile and for print. It
          will also facilitate translation and localization of these resources
          to more than 300 languages. The GDL’s initial purpose is to support
          access to high quality early-grade reading resources. Other types of
          learning resources may be included at a later stage.
        </P>
        <P>
          The goal is to make at least 50.000 titles in 100 languages available
          on the GDL-platform by the end of 2020.
        </P>
        <H3>Who can use the Global Digital Library?</H3>
        <P>
          The GDL is aimed at many different types of users and the platform
          will be open for everyone. Intended users include ministries of
          education, school managers, teachers, donor agencies and their
          implementing partners, international and national non-governmental
          organizations, local publishers, digital distributors and content
          providers, and households in developing countries.
        </P>
        <H3>Who is behind the Global Digital Library?</H3>
        <P>
          The GDL-platform is a collaborative endeavor which will require
          involvement from a broad spectrum of stakeholders in order to be truly
          successful and widely used. It is being built based on existing
          quality learning resources provided from a variety of initiatives. The
          content pool will expand over time through discovery and sharing or
          more existing quality content, translations and localizations of the
          platform’s content, as well as additions of newly created content. The
          Platform will be designed both for direct use by a variety of user
          groups and for integration with existing initiatives in the field.
        </P>
        <P>
          The Global Digital Library is part of The Global Book Alliance, an
          international effort involving multiple stakeholders working to
          transform book development, procurement and distribution to ensure
          that no child is without books. The mission of the Global Book
          Alliance is to guarantee that children everywhere have the books and
          learning materials they need to learn to read and read to learn.
        </P>
        <P>
          The idea to develop a Global Digital Library for reading resources
          came from All Children Reading: a Grand Challenge for Development
          (ACR) in 2014. ACR and the Norwegian Agency for Development
          Cooperation (Norad) subsequently conducted joint feasibility work in
          2015 and 2016, which outlined important parameters for such a project.
        </P>
        <P>
          The GDL-platform is being developed and will initially be operated by
          the{' '}
          <A href="https://ndla.no/">Norwegian Digital Learning Arena (NDLA)</A>,
          based on NDLA’s open source digital infrastructure.{' '}
          <A href="https://norad.no/en/front/">
            The Norwegian Agency for Development Cooperation (Norad)
          </A>{' '}
          has the overall project management responsibility.
        </P>
        <P>
          GDL-content is currently being provided by the following initiatives
          and organizations;{' '}
          <A href="https://storyweaver.org.in/">Storyweaver</A>,
          <A href="http://www.africanstorybook.org/">
            African Storybook Project
          </A>, <A href="https://www.usaid.gov/">USAID</A> missions,{' '}
          <A href="https://allchildrenreading.org/">
            All Children Reading: a Grand Challenge for Development
          </A>{' '}
          and <A href="https://benetech.org/">Benetech</A>. GDL’s open
          source-digital infrastructure has so far been provided by NDLA and the{' '}
          <A href="https://www.nypl.org/">New York Public Library</A>.
        </P>
        <P>
          A GDL advisory group provides technical advice and expertise input for
          the project implementation. The group is composed by representatives
          from the following organizations;{' '}
          <A href="https://allchildrenreading.org/">
            All Children Reading: a Grand Challenge for Development
          </A>, <A href="http://en.unesco.org/">UNESCO</A>,{' '}
          <A href="http://www.globalpartnership.org/">
            The Global Partnership for Education
          </A>, <A href="https://www.unicef.org/">UNICEF</A>,{' '}
          <A href="http://globalbookalliance.org/">the Global Book Alliance</A>,
          <A href="https://benetech.org/">Benetech</A>,{' '}
          <A href="https://storyweaver.org.in/">Storyweaver</A>,{' '}
          <A href="https://creativecommons.org/">Creative Commons</A>, and the{' '}
          <A href="https://www.gsma.com/">GSMA</A>. In addition a range of
          institutions and individuals have provided and are providing
          invaluable input.
        </P>
        <Link route="about" passHref prefetch>
          <A>Back</A>
        </Link>
      </Card>
    </Container>
    <Footer />
  </div>
);

export default defaultPage(GlobalDigitalLibrary);
