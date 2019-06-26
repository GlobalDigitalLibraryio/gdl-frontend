//@flow
import React from 'react';

const styles = {
  root: {
    height: 18,
    width: 18,
    cursor: 'pointer',
    border: 0,
    background: 'none',
    padding: 0
  },
  dot: {
    backgroundColor: '#e4e6e7',
    height: 9,
    width: 9,
    borderRadius: 6,
    margin: 3
  },
  active: {
    backgroundColor: '#0277bd'
  }
};

type Props = {|
  active: boolean,
  index: number,
  onClick: any
|};

class PaginationDot extends React.Component<Props> {
  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.props.onClick(event, this.props.index);
  };

  render() {
    const { active } = this.props;
    const styleDot = active
      ? Object.assign({}, styles.dot, styles.active)
      : styles.dot;

    return (
      <button type="button" style={styles.root} onClick={this.handleClick}>
        <div style={styleDot} />
      </button>
    );
  }
}

export default PaginationDot;
