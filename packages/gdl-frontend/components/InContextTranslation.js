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

type Props = {
  bookId: string,
  project: { en: string },
  children: Node
};

type State = {
  loading: boolean
};

class InContextTranslation extends React.Component<Props, State> {
  state = {
    loading: true
  };

  async componentDidMount() {
    const { project } = this.props;
    window.localStorage.clear();

    const toLanguage = await this.loadTranslation();
    await initInContext(project.en, toLanguage);

    const script = document.createElement('script');
    script.src = 'https://cdn.crowdin.com/jipt/jipt.js';

    if (!document.head) throw new Error('Unexpectedly missing <head>.');
    document.head.appendChild(script);
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
      this.props.children
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

  window._jipt = [];
  window._jipt.push(['preload_texts', true]);
  window._jipt.push(['project', project]);
}

export default InContextTranslation;
