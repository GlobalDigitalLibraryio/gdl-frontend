import React from 'react';
import PropTypes from 'prop-types';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';

import BlockLink from '../components/BlockLink';
import Layout from '../components/Layout';
import { Container, Section } from '../components/generic';
import Hero from '../components/Hero';

const Card = ({ children, header, src, alt }) => (
  <div className="root">
    <figure>
      <img src={src} alt={alt} />
    </figure>

    <div className="content">
      <h2>{header}</h2>
      {children}
    </div>
    <style jsx>{`
      @media screen and (min-width: 600px) {
        .root {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          background: #fff;
          box-shadow: 0px 5px 20px -4px rgba(0, 0, 0, 0.35);
          font-size: 1.2rem;
        }

        .root:nth-of-type(odd) figure {
          order: 2;
        }
        figure {
          width: 50%;
        }

        .content {
          padding: 10px 30px;
          width: 50%;
        }
      }

      .root:not(:first-child) {
        margin: 60px 0;
      }

      a {
        color: #20588f;
      }

      img {
        display: block;
        width: 100%;
        height: auto;
      }

      h2 {
        margin-bottom: 16px;
        color: #1c5791;
        font-size: 2rem;
      }
    `}</style>
  </div>
);

Card.propTypes = {
  header: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

const AboutLink = ({ children, ...props }) => (
  <Link>
    <a {...props}>
      {children}
      <style jsx>{`
        a {
          background: #309556;
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          color: #fff;
          border-radius: 0;
          -webkit-appearance: none;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
          transition: background-color 100ms ease-in-out;
        }
        a:hover,
        a:focus {
          background: #60bb82;
        }
      `}</style>
    </a>
  </Link>
);

export default () => (
  <Layout>
    <Hero teachingIcons>
      <Hero.Body>
        <Container>
          <h1>
            Global digital <small>library</small>
          </h1>
          <p>
            The Global Digital Library (GDL) is being developed to increase the
            availability of high quality mother tongue learning resources
            worldwide.
          </p>
          <p>
            The GDL-project is currently in an initial stage; establishing the
            implementation plan and steering structure and piloting the
            technical platform.
          </p>
          <ScrollLink
            aria-label="Read more"
            href="#content"
            to="content"
            smooth
            className="read-more-arrow"
            title="Click here to read more about Global Digital Library"
          >
            Read more
          </ScrollLink>
          <style jsx>{`
            :global(.read-more-arrow) {
              display: block;
              padding: 5px;
              width: 70px;
              height: 70px;
              text-indent: -9000px;
              background: url('static/hero/arrow.png') no-repeat center 65%;
              background-size: 70% 70%;
              border: 5px solid #fff;
              transition: all 150ms ease-in-out;
              border-radius: 50%;
              margin-bottom: 5em;
            }
            :global(.read-more-arrow:hover) {
              background-size: 80% 80%;
            }

            p {
              font-size: 1.3rem;
            }

            h1 {
              font-size: 2.4rem;
              margin-bottom: 20px;
            }

            @media screen and (min-width: 900px) {
              h1 {
                font-size: 5rem;
              }
            }

            h1 small {
              text-transform: uppercase;
              display: block;
              text-indent: 1em;
            }
          `}</style>
        </Container>
      </Hero.Body>
    </Hero>
    <Section as="section" id="content">
      <Container>
        <Card
          src="/static/index/children-smiling.jpg"
          alt="Smiling children"
          header="About the Global Digital Library"
        >
          <div>
            <p>
              The Global Digital Library will expand access to mother tongue
              (MT) content by providing openly licensed, downloadable materials
              that allow sharing, electronic use and large scale printing, as
              well as linking to other sources for those materials.
            </p>
            <p>
              The initial focus will be on learning resources that can support
              children’s literacy learning. Other learning resources will be
              included at a later stage.
            </p>

            <BlockLink href="/about">Read more about the project</BlockLink>
          </div>
        </Card>

        <Card
          src="/static/index/children-cheering.jpg"
          alt="Happy children"
          header="Compilation of digital libraries"
        >
          <div>
            <p>
              If you are looking for reading resources, All Children Reading
              have made a compilation of digital libraries, carefully curated to
              feature a variety of sites that provide local language early grade
              reading materials.
            </p>
            <BlockLink
              href="https://allchildrenreading.org/digital-libraries/"
              rel="noopener noreferrer"
              target="_blank"
            >
              All Children Reading
            </BlockLink>
          </div>
        </Card>

        <Card
          src="/static/index/children-laughing.jpg"
          alt="Children in the grass with computer"
          header="Project partners"
        >
          <div>
            <p>
              The Norwegian Agency for Development Cooperation (NORAD) and
              Norwegian Digital Learning Arena (NDLA) are leading the
              development of the Global Digital Library as part of the Global
              Book Alliance. Other collaborating partners include the All
              Children Reading: A Grand Challenge for Development partners
              (USAID, World Vision, and the Australian Government).
            </p>
            <BlockLink
              href="http://globalbookalliance.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Global book alliance
            </BlockLink>
          </div>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <AboutLink href="/about">More about Global Digital Library</AboutLink>
        </div>
      </Container>
    </Section>
  </Layout>
);
