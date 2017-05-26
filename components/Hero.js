import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Hero = ({ children, teachingIcons, fixed, ...props }) => (
  <section className={classNames('hero', { fixed })} {...props}>
    {children}
    {teachingIcons && <div className="icons"><img src="/static/hero/icons.png" alt="" /></div>}
    <style jsx>{`
      .hero {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        justify-content: space-between;
        -ms-flex-pack: justify;
        -ms-flex-direction: column;
        color: #fff;
        background: url("/static/hero/books.png"), linear-gradient(to right, #1c5791 0%, #5fa1d1 100%);
      }
      .icons {
        opacity: 0.4;
        float: right;
        height: auto;
      }

      .icons img {
        position: absolute;
        right: 10%;
        top: 0%;
        height: auto;
      }

      .fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      }
    `}</style>
  </section>
);

Hero.propTypes = {
  teachingIcons: PropTypes.bool,
  fixed: PropTypes.bool,
};

Hero.defaultProps = {
  teachingIcons: false,
  fixed: false,
};

const HeroBody = ({ children, size, ...props }) => (
  <div className={classNames('hero-body', { [`${size}`]: size })} {...props}>
    {children}
    <style jsx>{`
      .hero-body {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        padding: 3rem 1.5rem;
      }

      @media screen and (min-width: 1192px) {
        .hero-body {
          padding-left: 0;
          padding-right: 0;
        }
      }

      @media screen and (min-width: 769px), print {
        .hero-body.medium {
          padding-bottom: 9rem;
          padding-top: 9rem;
        }
      }

      @media screen and (min-width: 769px), print {
        .hero-body.large {
          padding-bottom: 18rem;
          padding-top: 18rem;
        }
      }
    `}</style>
  </div>
);

HeroBody.propTypes = {
  size: PropTypes.oneOf(['medium', 'large']),
};

Hero.Body = HeroBody;

export default Hero;
