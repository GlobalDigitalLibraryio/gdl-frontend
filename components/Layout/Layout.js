import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Footer from './Footer';

const Layout = ({ children, title = 'Global Digital Library' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="description" content="Global Digital Library GDL" />
      <meta
        name="keywords"
        content="global, digital, library, gdl, reading, children"
      />
      <link
        rel="stylesheet"
        href="//fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700"
        type="text/css"
      />
    </Head>
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Source Sans Pro', sans-serif;
        background: #f5f5f5;
        color: #333; 
      }
      html {
        font-size: 16px;
      }
      p {
        margin-bottom: 16px;
      }
    `}</style>
    <div className="site">
      <div className="site-content">
        {children}
      </div>
      <Footer />
    </div>
    <style jsx>{`
      .site {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
      }
      .site-content {
        flex: 1;
      }
    `}</style>
  </div>
);

Layout.propTypes = {
  title: PropTypes.string,
};

export default Layout;
