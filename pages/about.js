// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Hero from '../components/Hero';
import BlockLink from '../components/BlockLink';
import Container from '../components/Container';
import H1 from '../components/H1';
import H3 from '../components/H3';
import P from '../components/P';

export default () => (
  <Layout title="About - Global Digital Library">
    <Hero fixed>
      <Hero.Body size="large" />
    </Hero>
    <Container>
      <Card>
        <H1>The Global Digital Library</H1>
        <P>
          Although there have been major strides in education enrolment over the
          past 15 years, about 250 million children of primary school age are
          still unable to recognize basic letters and numbers. Worryingly, 130
          million of these children attend 4 years or more of school and still
          leave without basic foundational skills.
        </P>
        <P>
          Evidence supports the role of books in improving learning and reading
          acquisition. Over the past few decades, donors, including bilateral
          organizations and private foundations, have therefore provided
          millions of dollars in funding and programmatic support to improve the
          provision and usage of books. Despite these efforts, millions of
          children lack access to reading books and textbooks in the languages
          they speak and understand.
        </P>
        <P>
          The Global Digital Library will expand access to mother tongue (MT)
          content by providing openly licensed, downloadable materials that
          allow sharing, electronic use and large scale printing, as well as
          linking to other sources for those materials.
        </P>
        <P>
          The GDL will be a reliable source for high-quality MT books and other
          learning resources. This reliable supply, in concert with outreach,
          advocacy, and training could increase the use of MT books in schools
          and communities and improve literacy outcomes worldwide. The GDL will
          be a web-based platform. It will initially facilitate the
          identification of and access to high-quality, early grade reading
          educational materials in MT languages, whereas other types of learning
          resources are expected to be included later. The GDL content will be
          accessible in a print ready format as well as other relevant formats
          for web and mobile platforms.
        </P>

        <H3>Open licenses</H3>
        <P>
          The GDL platform will hold digital copies of Creative Commons or
          otherwise openly licensed, publicly accessible materials in
          print-ready formats. The primary licenses for the GDL will be CC BY
          and CC BY-SA. These licenses drive innovation and creativity,
          including commercial reuse. They also support the overall goal of
          sharing, translation and re-contextualization of early grade reading
          educational materials, open textbooks and other open educational
          resources.
        </P>

        <H3>Target audience</H3>
        <P>
          The target audiences for the GDL include ministries of education,
          school managers, teachers, donor agencies and their implementing
          partners, international and national non-governmental organizations,
          local publishers and households in developing countries. The platform
          will be open for all users, including end users with access to mobile
          devices and internet. The GDL’s initial purpose is to support access
          to early-grade reading materials in children’s mother tongues. Other
          types of learning resources are expected to be included at a later
          stage.
        </P>

        <H3>Continuous quality assurance</H3>
        <P>
          The GDL will be set up to ensure continuous quality assurance and
          «guiding» of content providers, technology developers, and other
          contributors. In establishing the GDL, the project team will extract a
          number of MT books from existing digital libraries. In this process it
          will be ensured that metadata are accurate and that GDL quality
          assurance support is provided.
        </P>
        <BlockLink href="/">Back</BlockLink>
      </Card>
    </Container>
  </Layout>
);
