// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import PaginationDot from './PaginationDot';

const styles = {
  root: {
    position: 'absolute',
    bottom: '8px',
    left: '0',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: 'auto',
    justifyContent: 'center'
  }
};

type Props = {|
  dots: number,
  index: number,
  onChangeIndex: number => void
|};

class Pagination extends React.Component<Props> {
  handleClick = (event: SyntheticEvent<HTMLButtonElement>, index: number) => {
    this.props.onChangeIndex(index);
  };

  render() {
    const { index, dots } = this.props;

    const children = Array(dots)
      .fill()
      .map((e, i) => (
        <PaginationDot
          key={i}
          index={i}
          active={i === index}
          onClick={this.handleClick}
        />
      ));

    return <div style={styles.root}>{children}</div>;
  }
}
export default Pagination;
