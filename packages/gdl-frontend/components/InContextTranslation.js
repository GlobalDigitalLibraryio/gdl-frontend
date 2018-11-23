// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'react-emotion';
import { fetchMyTranslations } from '../fetch';
import Head from 'next/head';

type Props = {
  bookId: string,
  project: { en: string },
  children: Node
};

type State = {
  loading: boolean
};

// In-context requires that jipt is defined before the crowdin script is initialized
if (typeof window !== 'undefined') {
  window._jipt = [];
}

class InContextTranslation extends React.Component<Props, State> {
  state = {
    loading: true
  };

  async componentDidMount() {
    const { project } = this.props;
    window.localStorage.clear();

    const toLanguage = await this.loadTranslation();
    await initInContext(project.en, toLanguage);

    this.setState({ loading: false });
  }

  loadTranslation = async () => {
    const myTranslations = await fetchMyTranslations();
    if (!myTranslations.isOk) return { statusCode: myTranslations.statusCode };

    const selectedTranslation = myTranslations.data.find(
      element => element.id.toString() === this.props.bookId
    );
    if (!selectedTranslation)
      throw new Error('Selected book is not part of your translation list.');

    return {
      ...selectedTranslation.translatedTo,
      id: this.props.bookId
    };
  };

  render() {
    return this.state.loading ? (
      <Layout>
        <CircularProgress />
      </Layout>
    ) : (
      <>
        <Head>
          <script src="https://cdn.crowdin.com/jipt/jipt.js" />
        </Head>
        {this.props.children}
      </>
    );
  }
}

const Layout = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function initInContext(project: string, toLanguage: any) {
  window.localStorage.setItem(`jipt_language_code_${project}`, toLanguage.code);
  window.localStorage.setItem(`jipt_language_id_${project}`, toLanguage.id);
  window.localStorage.setItem(`jipt_language_name_${project}`, toLanguage.name);

  window._jipt.push(['preload_texts', true]);
  window._jipt.push(['project', project]);
}

export default InContextTranslation;
