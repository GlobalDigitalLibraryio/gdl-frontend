// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Button, CardContent, Typography } from '@material-ui/core';
import { View, Hidden } from '../../elements';
import Pagination from '../FeaturedContentCarousel/Pagination';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay, virtualize } from 'react-swipeable-views-utils';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons/';
import styled from '@emotion/styled';

import Head from '../../components/Head';
import {
  Banner,
  HeroCovertitle,
  HeroCardMobile,
  HeroCardTablet
} from '../HomePage/index';
import { logEvent } from '../../lib/analytics';
import { FormattedMessage } from 'react-intl';
import { css } from '@emotion/core';
import type { HomeContent_featuredContent as FeaturedContent } from '../../gqlTypes';
import { colors, misc } from '../../style/theme';

type State = { index: number };
const AutoPlaySwipeableViews = autoPlay(virtualize(SwipeableViews));

type Props = {|
  featuredContent: Array<FeaturedContent>
|};

function mod(n, m) {
  let remain = n % m;
  return remain >= 0 ? remain : remain + m;
}
class Carousel extends React.Component<Props, State> {
  state = { index: 0 };
  handleNextIndex = () => {
    this.setState({
      index: this.state.index + 1
    });
  };

  handlePrevIndex = () => {
    this.setState({
      index: this.state.index - 1
    });
  };
  cardContent = (content: FeaturedContent) => {
    return (
      // Specifying width here makes text in IE11 wrap
      <View alignItems="center" style={{ width: '100%' }}>
        <Typography
          lang={content.language.code}
          align="center"
          variant="h5"
          component="h2"
          gutterBottom
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {content.title}
        </Typography>
        <Typography
          lang={content.language.code}
          align="center"
          paragraph
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {content.description}
        </Typography>
        <Button
          onClick={() => logEvent('Navigation', 'Featured', content.title)}
          href={content.link}
          variant="contained"
          color="primary"
          size="large"
        >
          <FormattedMessage id="More" defaultMessage="More" />
        </Button>
      </View>
    );
  };
  card = (content: FeaturedContent) => {
    return (
      <>
        <Head image={content.imageUrl} />
        <Banner src={content.imageUrl}>
          <HeroCovertitle>
            <Typography
              component="h1"
              variant="h6"
              css={{ color: colors.base.white }}
            >
              <FormattedMessage id="Featured" defaultMessage="Featured" />
            </Typography>
          </HeroCovertitle>
          <HeroCardTablet>
            {/* Specifying width here makes text in IE11 wrap*/}
            <CardContent style={{ width: '100%' }}>
              {this.cardContent(content)}
            </CardContent>
          </HeroCardTablet>
        </Banner>
      </>
    );
  };
  slideRenderer = (params: { index: number, key: number }) => {
    const { key, index } = params;
    const { featuredContent } = this.props;
    const indexPage = mod(index, featuredContent.length);
    const content = featuredContent[indexPage];
    return (
      <div key={key}>
        {this.card(content)}
        <HeroCardMobile>
          <CardContent>
            {this.cardContent(content)}
            <Hidden only="mobile">
              <div style={{ paddingTop: '8px' }}>
                <Pagination
                  dots={featuredContent.length}
                  index={indexPage}
                  onChangeIndex={index => this.setState({ index })}
                />
              </div>
            </Hidden>
          </CardContent>
        </HeroCardMobile>
      </div>
    );
  };
  render() {
    const { index } = this.state;
    const { featuredContent } = this.props;

    return (
      <Container>
        {featuredContent.length > 1 ? (
          <>
            <AutoPlaySwipeableViews
              interval={7000}
              index={index}
              onChangeIndex={index => this.setState({ index })}
              slideRenderer={this.slideRenderer}
            />
            <Hidden only="desktop">
              <div
                css={[arrowLeftContainer, fadeIn]}
                aria-label="Previous"
                onClick={this.handlePrevIndex}
              >
                <KeyboardArrowLeft style={{ color: 'white' }} />
              </div>

              <div
                css={[arrowRightContainer, fadeIn]}
                aria-label="Next"
                onClick={this.handleNextIndex}
              >
                <KeyboardArrowRight style={{ color: 'white' }} />
              </div>
              <div css={dotsContainer}>
                <Pagination
                  dots={featuredContent.length}
                  index={mod(index, featuredContent.length)}
                  onChangeIndex={index => this.setState({ index })}
                />
              </div>
            </Hidden>
            <Hidden only="tablet">
              <div css={dotsContainer}>
                <Pagination
                  dots={featuredContent.length}
                  index={mod(index, featuredContent.length)}
                  onChangeIndex={index => this.setState({ index })}
                />
              </div>
            </Hidden>
          </>
        ) : (
          <>
            {this.card(featuredContent[0])}

            <HeroCardMobile>
              <CardContent>{this.cardContent(featuredContent[0])}</CardContent>
            </HeroCardMobile>
          </>
        )}
      </Container>
    );
  }
}

export default Carousel;

const Container = styled('div')`
  position: relative;
  max-width: ${misc.containers.small}px;
  margin-left: auto;
  margin-right: auto;
`;

const fadeIn = css`
  &:hover {
    animation: fade-in ease 0.5s;

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
`;

const arrowRightContainer = css`
  position: absolute;
  width: 9.9%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
  &:hover {
    background-image: linear-gradient(
      90deg,
      rgba(240, 240, 240, 0.1),
      rgba(0, 0, 0, 0.5)
    );
    cursor: pointer;
  }
`;
const arrowLeftContainer = css`
  position: absolute;
  width: 9.9%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  &:hover {
    background-image: linear-gradient(
      -90deg,
      rgba(240, 240, 240, 0.1),
      rgba(0, 0, 0, 0.5)
    );
    cursor: pointer;
  }
`;
const dotsContainer = css`
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justifycontent: center;
`;
