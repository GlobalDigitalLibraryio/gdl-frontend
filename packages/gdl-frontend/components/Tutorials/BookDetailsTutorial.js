// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Joyride from 'react-joyride';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from './tooltip-arrow.svg';
import { Button, Typography } from '@material-ui/core';
import { withTheme, type Theme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import type { intlShape } from 'react-intl';

export const tabletBookTarget = 'tutorial_read_book_tablet';
export const tabletOfflineTarget = 'tutorial_save_offline_tablet';
export const mobileBookTarget = 'tutorial_read_book_mobile';
export const mobileOfflineTarget = 'tutorial_save_offline_mobile';

const translations = defineMessages({
  online: {
    id: 'Tutorial online',
    defaultMessage: 'Start reading a book!'
  },
  offline: {
    id: 'Tutorial offline',
    defaultMessage: 'Click here to save books so you can read offline.'
  }
});

const getSteps = (media, intl) => {
  const steps = {
    tablet: [
      {
        target: `[data-target='${tabletBookTarget}']`,
        content: intl.formatMessage(translations.online),
        placement: 'right',
        disableBeacon: true,

        floaterProps: {
          hideArrow: true
        }
      },
      {
        target: `.${tabletOfflineTarget}`,
        content: intl.formatMessage(translations.offline),
        placement: 'bottom-start',
        disableBeacon: true,
        floaterProps: {
          hideArrow: true
        }
      }
    ],
    mobile: [
      {
        target: `[data-target='${mobileBookTarget}']`,
        content: intl.formatMessage(translations.online),
        placement: 'top-end',
        disableBeacon: true,
        floaterProps: {
          hideArrow: true
        }
      },
      {
        target: `.${mobileOfflineTarget}`,
        content: intl.formatMessage(translations.offline),
        placement: 'top-start',
        disableBeacon: true,
        floaterProps: {
          hideArrow: true
        }
      }
    ]
  };
  return steps[media];
};

type Props = {
  theme: Theme,
  status: boolean,
  onFinish: () => void,
  media: 'tablet' | 'mobile',
  intl: intlShape
};

type State = {
  currentSteps: Array<*> | null
};

class BookDetailsTutorial extends React.Component<Props, State> {
  state = {
    currentSteps: getSteps(this.props.media, this.props.intl)
  };

  render() {
    const { theme, media, status, onFinish } = this.props;
    const { currentSteps } = this.state;
    if (currentSteps === null) return null;
    // Find the max zIndex from Material Ui components, because this component should be on top
    // $FlowFixMe flow currently handle indirect array number types as mixed
    const maxZIndex = Math.max(...Object.values(theme.zIndex));

    return (
      <Joyride
        disableOverlayClose
        disableScrolling={true}
        continuous
        scrollToFirstStep
        steps={currentSteps}
        run={status}
        styles={{ options: { zIndex: maxZIndex + 1 } }}
        tooltipComponent={props => (
          <Tooltip {...props} media={media} closeTutorial={onFinish} />
        )}
      />
    );
  }
}

const Tooltip = ({
  isLastStep,
  index,
  tooltipProps,
  media,
  title,
  step,
  size,
  closeTutorial,
  closeProps,
  primaryProps
}) => (
  <Center isFirstStep={index === 0} media={media}>
    <BouncingArrow type={media} isFirstStep={index === 0} />
    <div css={styles.tooltipBody} {...tooltipProps}>
      <CloseButton
        {...closeProps}
        top={index === 0 || media === 'mobile' ? 0 : 50}
        isFirstStep={index === 0}
        onClick={closeTutorial}
      />

      {step.title && <Typography variant="h5">{step.title}</Typography>}
      <Typography
        style={{ marginTop: index === 0 ? 15 : 0 }}
        variant="body1"
        align="center"
      >
        {step.content}
      </Typography>
      <Button
        {...primaryProps}
        onClick={event => {
          isLastStep && closeTutorial();
          primaryProps.onClick(event);
        }}
        variant="contained"
        color="primary"
        size="large"
        style={{ marginTop: 20 }}
      >
        {isLastStep ? (
          <FormattedMessage id="Done!" defaultMessage="Done!" />
        ) : (
          <FormattedMessage id="Next tip" defaultMessage="Next tip" />
        )}
      </Button>
    </div>
  </Center>
);

const BouncingArrow = props => {
  const marginLeft =
    props.type === 'tablet' && props.isFirstStep ? '-50px' : '30px';
  const style = css`
    width: 100px;
    margin-bottom: 20px;
    animation: ${props.type}Bounce 1s infinite alternate;
    margin-left: ${marginLeft};

    @keyframes tabletBounce {
      from {
        transform: rotate(180deg) translateY(0px) scale(1, -1);
      }
      to {
        transform: rotate(180deg) translateY(-15px) scale(1, -1);
      }
    }

    @keyframes mobileBounce {
      from {
        transform: rotate(180deg) translateY(0px);
      }
      to {
        transform: rotate(180deg) translateY(-15px);
      }
    }
  `;
  return <Arrow css={style} />;
};

const CloseButton = props => {
  const style = css`
    position: absolute;
    top: ${props.top}px;
    right: 0;
    color: #fff;
    background-color: #000;
    border: 2px solid #fff;
    height: 30px;
    width: 30px;
    border-radius: 50%;
  `;
  return <Close css={style} onClick={props.onClick} />;
};

const Center = styled('div')`
  display: flex;
  flex-direction: ${props =>
    props.media === 'mobile'
      ? 'column-reverse'
      : props.isFirstStep
      ? 'row'
      : 'column'};
  align-items: ${props =>
    props.media === 'mobile'
      ? 'flex-start'
      : props.isFirstStep
      ? 'flex-end'
      : 'flex-start'};
`;

const styles = {
  tooltipBody: css`
    width: 270px;
    height: 270px;
    border-radius: 50%;
    background-color: white;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-left: 50px;
    padding-right: 50px;
  `
};

export default withTheme()(injectIntl(BookDetailsTutorial));
