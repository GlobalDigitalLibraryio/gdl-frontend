import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const SocialLinks = ({ renderAboutLink }) => (
  <div>
    {renderAboutLink &&
      <Link href="/about">
        <a className="about-link">More about Global Digital Library</a>
      </Link>}
    <div className="links__social">
      <ul>
        <li>
          <a
            className="icon facebook"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/globaldigitallibrary"
          >
            GDL on Facebook
          </a>
        </li>
        <li>
          <a
            className="icon twitter"
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/gdigitallibrary"
          >
            GDL on Twitter
          </a>
        </li>
        <li>
          <a className="icon mail" href="mailto:christer@digitallibrary.io">
            Send us an e-mail
          </a>
        </li>
      </ul>
    </div>
    <style jsx>{`
      .about-link {
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
      .about-link:hover, .about-link:focus {
        background: #60bb82;
      }

      ul {
        display: flex;
        margin: 40px auto;
        width: 210px;
        list-style: none;
      }

      li {
        width: 70px;
        text-align: center;
      }

      .icon {
        display: block;
        margin-top: 0;
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        text-indent: -9000px;
        transition: margin-top 100ms ease-in-out;
      }

      .icon:hover, .icon:focus {
        margin-top: -5px;
      }

      .facebook {
        background-image: url("/static/footer/facebook.png");
      }
      .twitter {
        background-image: url("/static/footer/twitter.png");
      }
      .mail {
        background-image: url("/static/footer/mail.png"); 
      }
  `}</style>
  </div>
);

SocialLinks.propTypes = {
  renderAboutLink: PropTypes.bool,
};

SocialLinks.defaultProps = {
  renderAboutLink: false,
};

const PartnersFooter = ({ renderAboutLink }) => (
  <div>
    <footer>
      <SocialLinks renderAboutLink={renderAboutLink} />
      <div className="partners">
        <ul>
          <li className="all-children-reading">
            <img
              src="/static/footer/all-children.png"
              alt="All Children Reading logo"
            />
          </li>
          <li className="us-aid">
            <img src="/static/footer/usaid.png" alt="US Aid logo" />
          </li>
          <li className="world-vision">
            <img
              src="/static/footer/world-vision.png"
              alt="World Vision logo"
            />
          </li>
          <li className="aud-aid">
            <img
              src="/static/footer/australian-aid.png"
              alt="Australian Aid logo"
            />
          </li>
          <li className="norad">
            <img src="/static/footer/norad.png" alt="Norad logo" />
          </li>
          <li className="ndla">
            <img src="/static/footer/ndla.png" alt="NDLA logo" />
          </li>
        </ul>
      </div>
    </footer>
    <style jsx>{`
      footer {
        position: relative;
        text-align: center;
        z-index: 10;
        background: #f5f5f5;
        border-top: 1px solid #f5f5f5; 
      }

      .partners {
        padding: 2em 1em;
        border-top: 1px solid #5fa1d1;
        background: #fff;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: 500px;
        list-style: none;
        justify-content: space-between;
      }

      li {
        margin: 20px 0;
        height: 40px;
        width: 46%; 
      }

      img {
        display: block;
        margin: 0 auto;
        width: auto;
        height: 100%;
      }
    `}</style>
  </div>
);

PartnersFooter.propTypes = {
  renderAboutLink: PropTypes.bool,
};

PartnersFooter.defaultProps = {
  renderAboutLink: false,
};

export default PartnersFooter;
