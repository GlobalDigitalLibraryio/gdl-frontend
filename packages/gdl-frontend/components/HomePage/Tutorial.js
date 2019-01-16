// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Joyride from 'react-joyride';
import styled, { css } from 'react-emotion';
import { Trans } from '@lingui/react';
import Arrow from '../tooltip-arrow.svg';
import Kenya from './kenya.svg';
import Ethiopia from './ethiopia.svg';
import Cambodia from './cambodia.svg';
import { Button, Typography } from '@material-ui/core';
import { withTheme, type Theme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const drawerTarget = 'global_menu_drawer';
export const languageTarget = 'global_menu_language';

const steps = [
  {
    target: `[data-target='${drawerTarget}']`,
    title: 'Welcome!',
    content: 'Use the main menu for more options.',
    placement: 'bottom-start',
    disableBeacon: true,
    floaterProps: {
      hideArrow: true
    }
  },
  {
    target: `[data-target='${languageTarget}']`,
    icon: true,
    content: 'Choose your preferred language here!',
    placement: 'bottom-end',
    disableBeacon: true,
    floaterProps: {
      hideArrow: true
    }
  }
];

type Props = {
  theme: Theme,
  status: boolean,
  onFinish: () => void
};

class Tutorial extends React.Component<Props> {
  render() {
    const { theme, status, onFinish } = this.props;
    // Find the max zIndex from Material Ui components, because this component should be on top
    // $FlowFixMe flow currently handle indirect array number types as mixed
    const maxZIndex = Math.max(...Object.values(theme.zIndex));

    return (
      <Joyride
        disableOverlayClose
        disableScrolling={true}
        continuous
        steps={steps}
        run={status}
        styles={{ options: { zIndex: maxZIndex + 1 } }}
        tooltipComponent={props => (
          <Tooltip {...props} closeTutorial={onFinish} />
        )}
      />
    );
  }
}

const Tooltip = ({
  index,
  tooltipProps,
  media,
  title,
  step,
  size,
  closeProps,
  closeTutorial,
  isLastStep,
  primaryProps
}) => (
  <Center>
    <IconHeader isFirstStep={index === 0}>
      <BouncingArrow isFirstStep={index === 0} />
      <Close
        className={styles.closeButton}
        {...closeProps}
        onClick={closeTutorial}
      />
    </IconHeader>
    <div css={styles.tooltipBody} {...tooltipProps}>
      {step.icon && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Kenya css={styles.kenya} />
          <Cambodia css={styles.cambodia} />
          <Ethiopia css={styles.ethiopia} />
        </div>
      )}
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
        {isLastStep ? <Trans>Done!</Trans> : <Trans>Next tip</Trans>}
      </Button>
    </div>
  </Center>
);

const IconHeader = styled('div')`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: ${props => (props.isFirstStep ? 'row' : 'row-reverse')};
`;

const BouncingArrow = props => {
  const alignSelf = props.isFirstStep ? null : 'flex-end';
  const keyframeByStep = props.isFirstStep ? 'firstStep' : 'secondStep';

  const style = css`
    margin-top: 15px;
    width: 100px;
    animation: ${keyframeByStep} 1s infinite alternate;
    align-self: ${alignSelf};

    @keyframes firstStep {
      from {
        transform: scale(1, -1) rotate(180deg) translateY(0px);
      }
      to {
        transform: scale(1, -1) rotate(180deg) translateY(-15px);
      }
    }

    @keyframes secondStep {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(-15px);
      }
    }
  `;
  return <Arrow className={style} />;
};

const Center = styled('div')`
  display: flex;
  flex-direction: column;
`;

const styles = {
  kenya: css`
    height: 80px;
    width: 50px;
    margin-right: 20px;
    transform: rotate(-30deg);
  `,
  cambodia: css`
    height: 50px;
    width: 50px;
  `,
  ethiopia: css`
    height: 80px;
    width: 50px;
    margin-left: 20px;
    transform: rotate(30deg);
  `,
  closeButton: css`
    color: #fff;
    background-color: #000;
    border: 2px solid #fff;
    height: 30px;
    width: 30px;
    border-radius: 50%;
  `,
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

export default withTheme()(Tutorial);
