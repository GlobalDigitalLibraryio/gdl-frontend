// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { MainCategory } from '../types';

export const CategoryContext = React.createContext<{
  category: MainCategory,
  setCategory: (category: MainCategory) => void
}>({
  category: 'books',
  setCategory: () => {}
});

type Props = {
  initialMainCategory: MainCategory,
  children: React.Node
};

type State = {
  category: MainCategory
};

class CategoryProvider extends React.Component<Props, State> {
  state = {
    category: this.props.initialMainCategory
  };
  render() {
    const { category } = this.state;
    const { children } = this.props;
    return (
      <CategoryContext.Provider
        value={{
          category,
          setCategory: (category: MainCategory) => this.setState({ category })
        }}
      >
        {children}
      </CategoryContext.Provider>
    );
  }
}

export default CategoryProvider;
