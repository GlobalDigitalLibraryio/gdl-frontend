import React from 'react';

const SocialLinks = () => (
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
    <style jsx>{`
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
  </ul>
);

const Footer = () => (
  <footer>
    <SocialLinks />
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
          <img src="/static/footer/world-vision.png" alt="World Vision logo" />
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
    <style jsx>{`
      footer {
        text-align: center;
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
  </footer>
);

export default Footer;
