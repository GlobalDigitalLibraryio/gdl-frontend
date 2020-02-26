// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';
import { FormattedMessage } from 'react-intl';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import {
  Container,
  View,
  Hidden,
  SideMenuMargin,
  LoadingButton
} from '../../elements';
import { spacing } from '../../style/theme';
import MobileBottomBar from '../../components/Navbar/MobileBottomBar';
import SideMenuBar from '../../components/Navbar/SideMenuBar';
import { Typography } from '@material-ui/core';
import GridContainer from '../BookGrid/styledGridContainer';
import LevelHR from '../Level/LevelHR';

type Props = {|
  languageCode: string,
|};

const VideoPage = ({
  languageCode
}: Props) => (
  <Layout wrapWithMain={false}>
    <Hidden only="desktop">
      <SideMenuBar lang={languageCode}/>
    </Hidden>
    <SideMenuMargin>
      <Main elevation={0} style={{ backgroundColor: 'transparent' }}>
        <View css={scrollStyle}>
          <Container width="100%">
            <GridContainer>
              <Typography
                  variant="h4"
                  component="h1"
                  align="left"
                  css={{
                    margin: `${spacing.large} 0`,
                    width: 'auto',
                    gridColumn: '1/-1'
                  }}
              >   { true ? (
                  <>
                    {/* $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck */}
                    <ReadingLevelTrans readingLevel="Videos" />
                    <LevelHR  
                      // TODO: it this necessary when we want to show all videos atm
                      level="Games"
                      css={{
                        margin: `${spacing.xsmall} 0`
                      }}
                    />
                  </>
                ) : (
                  <FormattedMessage
                    id="No videos found"
                    defaultMessage="No videos found"
                  />
                )} 
              </Typography>
            </GridContainer>
            <GridContainer>
              {/* TODO: map videos <VideoLink or BookLink or the correct way ... /> */}
            </GridContainer>
            <div css={{ alignSelf: 'center' }}>
            <LoadingButton
                disabled={true} // TODO: Finish this
                onClick={() => console.log("Click")} // TODO: Finish this
                isLoading={false}
                color="primary"
                variant="outlined"
                css={{
                  marginTop: spacing.xlarge,
                  marginBottom: spacing.medium
                }}
              >
                <FormattedMessage id="More videos" defaultMessage="More videos" />
              </LoadingButton>
            </div>
          </Container>
        </View>
      </ Main>
    </ SideMenuMargin>


    <Hidden only="mobileAndTablet">
      <MobileBottomBar lang={languageCode}/>
    </Hidden>
  </Layout>
);

const scrollStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${spacing.medium} 0;
  margin-top: 20px;
`;

export default VideoPage;
