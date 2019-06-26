//@flow
import * as React from 'react';
import { Button, CardContent, Typography } from '@material-ui/core';
import { View, Hidden } from '../../elements';
import Pagination from '../FeaturedContentCarousel/Pagination';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons/';
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
import { colors } from '../../style/theme';

type State = { index: number };
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

type Props = {|
  featuredContent: Array<FeaturedContent>
|};

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

  goToLastPage = () => {
    this.setState({
      index: this.props.featuredContent.length - 1
    });
  };
  goToFirstPage = () => {
    this.setState({
      index: 0
    });
  };
  render() {
    const { index } = this.state;
    const { featuredContent } = this.props;
    const cardContent = content => {
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
    return (
      <div style={{ position: 'relative' }}>
        <AutoPlaySwipeableViews
          interval={7000}
          index={index}
          onChangeIndex={index => this.setState({ index })}
        >
          {featuredContent.map(content => (
            <div key={content.id}>
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
                    {cardContent(content)}
                  </CardContent>
                </HeroCardTablet>
              </Banner>

              <HeroCardMobile>
                <CardContent>
                  {cardContent(content)}
                  <Hidden only="mobile">
                    <div style={{ paddingTop: '8px' }}>
                      <Pagination
                        dots={featuredContent.length}
                        index={index}
                        onChangeIndex={index => this.setState({ index })}
                      />
                    </div>
                  </Hidden>{' '}
                </CardContent>
              </HeroCardMobile>
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <Hidden only="desktop">
          {(index !== 0 && (
            <div
              css={arrowLeftContainer}
              aria-label="Previous"
              onClick={this.handlePrevIndex}
            >
              {' '}
              <KeyboardArrowLeft style={{ color: 'white' }} />
            </div>
          )) ||
            (index === 0 && (
              <div
                css={arrowLeftContainer}
                aria-label="Previous"
                onClick={this.goToLastPage}
              >
                {' '}
                <KeyboardArrowLeft style={{ color: 'white' }} />
              </div>
            ))}
          {(index !== featuredContent.length - 1 && (
            <div
              css={arrowRightContainer}
              aria-label="Next"
              onClick={this.handleNextIndex}
            >
              {' '}
              <KeyboardArrowRight style={{ color: 'white' }} />
            </div>
          )) ||
            (index === featuredContent.length - 1 && (
              <div
                css={arrowRightContainer}
                aria-label="Next"
                onClick={this.goToFirstPage}
              >
                {' '}
                <KeyboardArrowRight style={{ color: 'white' }} />
              </div>
            ))}
          <div css={dotsContainer}>
            <Pagination
              dots={featuredContent.length}
              index={index}
              onChangeIndex={index => this.setState({ index })}
            />
          </div>
        </Hidden>
        <Hidden only="tablet">
          <div css={dotsContainer}>
            <Pagination
              dots={featuredContent.length}
              index={index}
              onChangeIndex={index => this.setState({ index })}
            />
          </div>
        </Hidden>
      </div>
    );
  }
}

export default Carousel;

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
    transition: all 0.2s ease-in;
    background: rgba(0, 0, 0, 0.5);
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
    transition: all 0.2s ease-in;
    background: rgba(0, 0, 0, 0.5);
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
