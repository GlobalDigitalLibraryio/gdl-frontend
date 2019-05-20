// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import React, { Component } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

const size = 10;
const visible = 5;
const margin = 1;

const DotContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  transition: all 0.5s ease;
  margin-right: 10px;
`;

const DotHolder = styled('div')`
  flex-shrink: 0;
  transition: transform 0.5s ease;
`;

const Dot = styled('div')`
  margin: ${margin}px;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background-color: white;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: transform 0.5s ease;

  background-color: ${p => (p.active ? '#0c0c0c' : '#bbbbbb')};
  transform: ${p => (p.small ? 'scale(0.5)' : 'none')};
`;

type Props = {
  active: number,
  length: number
};

type State = {
  translate: number,
  changed: boolean,
  bigDots: any,
  changeCount: number,
  direction: string
};

export default class CarouselDots extends Component<Props, State> {
  static defaultProps = {
    active: 2,
    length: 10
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      changed: false,
      translate: 0,
      direction: 'forwards',
      changeCount: 0,
      bigDots: this.getNewBigDots(props, false)
    };
  }

  shouldComponentUpdate(nextProps: Props) {
    return this.props.active !== nextProps.active;
  }

  componentDidUpdate = (prevProps: Props) => {
    let newBigDots = [];
    if (this.props.active > prevProps.active) {
      // Forwards
      if (this.props.length - 3 < this.props.active) {
        this.setState({
          translate: (this.props.length - (visible + 1)) * (size + 2 * margin)
        });
      }
      if (this.state.direction === 'forwards') {
        // Dir doesnt change
        if (this.state.changed) {
          // If there was a recent change increment the counter
          if (this.state.changeCount >= visible - 4 - (visible % 2)) {
            // If we reached the limit, remove the changed
            newBigDots = this.getNewBigDots(this.props, false);
            this.setState({
              bigDots: newBigDots,
              direction: 'forwards',
              changed: false,
              changeCount: 0
            });
          } else {
            // Else increment the counter
            newBigDots = this.getNewBigDots(this.props, true);
            this.setState({
              bigDots: newBigDots,
              direction: 'forwards',
              changed: true,
              changeCount: this.state.changeCount + 1
            });
          }
        } else {
          // Simply set the direction and the transform
          newBigDots = this.getNewBigDots(this.props, false);
          this.setState({
            bigDots: newBigDots,
            translate:
              (this.props.active - (visible - 2)) * (size + 2 * margin),
            direction: 'forwards'
          });
        }
      } else if (this.state.direction === 'backwards') {
        // Change happened in the direction
        if (visible > 4) {
          newBigDots = this.getNewBigDots(this.props, true);
          this.setState({
            bigDots: newBigDots,
            direction: 'forwards',
            changed: true,
            changeCount: this.state.changeCount + 1
          });
        } else {
          newBigDots = this.getNewBigDots(this.props, false);
          this.setState({ bigDots: newBigDots, direction: 'forwards' });
        }
      }
    } else if (this.props.active < prevProps.active) {
      // Backwards
      if (this.props.length - visible < this.props.active) {
        this.setState({
          bigDots: newBigDots,
          translate: (this.props.length - (visible + 1)) * (size + 2 * margin)
        });
      }
      if (this.state.direction === 'backwards') {
        // Dir doesnt change
        if (this.state.changed) {
          // If there was a recent change increment the counter
          if (this.state.changeCount >= visible - 4 - (visible % 2)) {
            // If we reached the limit, remove the changed
            newBigDots = this.getNewBigDots(this.props, false);
            this.setState({
              bigDots: newBigDots,
              direction: 'backwards',
              changed: false,
              changeCount: 0
            });
          } else {
            // Else increment the counter
            newBigDots = this.getNewBigDots(this.props, true);
            this.setState({
              bigDots: newBigDots,
              direction: 'backwards',
              changed: true,
              changeCount: this.state.changeCount + 1
            });
          }
        } else {
          // Simply set the direction and the transform
          newBigDots = this.getNewBigDots(this.props, false);
          this.setState({
            bigDots: newBigDots,
            translate: (this.props.active - 2) * (size + 2 * margin),
            direction: 'backwards'
          });
        }
      } else if (this.state.direction === 'forwards') {
        // Change happened in the direction
        if (visible > 4) {
          newBigDots = this.getNewBigDots(this.props, true);
          this.setState({
            bigDots: newBigDots,
            direction: 'backwards',
            changed: true,
            changeCount: this.state.changeCount + 1
          });
        } else {
          newBigDots = this.getNewBigDots(this.props, false);
          this.setState({ direction: 'backwards', bigDots: newBigDots });
        }
      }
    }
  };

  getNewBigDots = (nextProps: Props, changed: boolean) => {
    let newBigDots = [];
    if (nextProps.active >= this.props.active) {
      if (visible % 2 === 1) {
        if (nextProps.active < visible - 2) {
          for (let j = 0; j < visible - 1; j += 1) {
            newBigDots.push(j);
          }
        } else if (nextProps.active === visible - 2) {
          for (let j = 0; j < visible; j += 1) {
            newBigDots.push(j);
          }
        } else if (this.props.length - 4 < nextProps.active) {
          for (
            let j = this.props.length - visible;
            j < this.props.length;
            j += 1
          ) {
            newBigDots.push(j);
          }
        } else if (!changed) {
          for (
            let j = nextProps.active - (visible - 3);
            j < nextProps.active + 2;
            j += 1
          ) {
            newBigDots.push(j);
          }
        } else {
          newBigDots = this.state.bigDots;
        }
      } else if (nextProps.active < visible - 2) {
        for (let j = 0; j < visible - 1; j += 1) {
          newBigDots.push(j);
        }
      } else if (nextProps.active === visible - 2) {
        for (let j = 0; j < visible; j += 1) {
          newBigDots.push(j);
        }
      } else if (this.props.length - 4 < nextProps.active) {
        for (
          let j = this.props.length - visible;
          j < this.props.length;
          j += 1
        ) {
          newBigDots.push(j);
        }
      } else if (!changed) {
        for (
          let j = nextProps.active - (visible - 3);
          j < nextProps.active + 2;
          j += 1
        ) {
          newBigDots.push(j);
        }
      } else {
        newBigDots = this.state.bigDots;
      }
    } else if (visible % 2 === 1) {
      if (nextProps.active < visible - (visible - 3)) {
        for (let j = 0; j < visible - 1; j += 1) {
          newBigDots.push(j);
        }
      } else if (this.props.length - visible < nextProps.active) {
        for (
          let j = this.props.length - visible;
          j < this.props.length;
          j += 1
        ) {
          newBigDots.push(j);
        }
      } else if (!changed) {
        for (
          let j = nextProps.active - 1;
          j < nextProps.active + (visible - 2);
          j += 1
        ) {
          newBigDots.push(j);
        }
      } else {
        newBigDots = this.state.bigDots;
      }
    } else if (nextProps.active < 3) {
      for (let j = 0; j < visible - 1; j += 1) {
        newBigDots.push(j);
      }
    } else if (this.props.length - 4 < nextProps.active) {
      for (let j = this.props.length - visible; j < this.props.length; j += 1) {
        newBigDots.push(j);
      }
    } else if (!changed) {
      for (
        let j = nextProps.active - 1;
        j < nextProps.active + (visible - 2);
        j += 1
      ) {
        newBigDots.push(j);
      }
    } else {
      newBigDots = this.state.bigDots;
    }

    return newBigDots;
  };

  getDotStyle = () => {
    let style = {
      height: size,
      width: size,
      marginRight: margin,
      marginLeft: margin
    };
    if (this.state.direction === 'forwards') {
      if (this.props.active < visible - 2) {
        style = {
          ...style
        };
      } else if (this.props.length - 3 < this.props.active) {
        style = {
          ...style,
          transform: `translateX(-${(this.props.length - (visible + 1)) *
            (size + 2 * margin)}px)`
        };
      } else if (!this.state.changed) {
        style = {
          ...style,
          transform: `translateX(-${(this.props.active - (visible - 2)) *
            (size + 2 * margin)}px)`
        };
      } else {
        style = {
          ...style,
          transform: `translateX(-${this.state.translate}px)`
        };
      }
    } else if (this.props.active < 2) {
      style = {
        ...style
      };
    } else if (this.props.length - visible < this.props.active) {
      style = {
        ...style,
        transform: `translateX(-${(this.props.length - (visible + 1)) *
          (size + 2 * margin)}px)`
      };
    } else if (!this.state.changed) {
      style = {
        ...style,
        transform: `translateX(-${(this.props.active - 2) *
          (size + 2 * margin)}px)`
      };
    } else {
      style = {
        ...style,
        transform: `translateX(-${this.state.translate}px)`
      };
    }
    return style;
  };

  getHolderStyle = () => {
    let style = {
      height: size + 2
    };
    if (this.state.direction === 'forwards') {
      if (this.props.active < visible - 2) {
        style = {
          ...style,
          width: size * visible + visible * margin * 2
        };
      } else {
        style = {
          ...style,
          width: size * (visible + 1) + (visible + 1) * margin * 2
        };
      }
    } else if (this.props.active < 3) {
      style = {
        ...style,
        width: size * visible + visible * margin * 2
      };
    } else {
      style = {
        ...style,
        width: size * (visible + 1) + (visible + 1) * margin * 2
      };
    }

    return style;
  };

  getDotClassName = index => !this.state.bigDots.includes(index);

  render() {
    const { active } = this.props;
    console.log('render');
    return (
      <DotContainer style={this.getHolderStyle()}>
        {[...Array(this.props.length)].map((_, index) => (
          <DotHolder key={index} style={this.getDotStyle()}>
            <Dot
              active={active - 1 === index}
              small={this.getDotClassName(index)}
            />
          </DotHolder>
        ))}
      </DotContainer>
    );
  }
}
