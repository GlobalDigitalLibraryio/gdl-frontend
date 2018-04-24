// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Element } from 'react';
import MdStar from 'react-icons/lib/md/star';
import MdWarning from 'react-icons/lib/md/warning';
import MdInfo from 'react-icons/lib/md/info';
import MdClose from 'react-icons/lib/md/close';
import { Trans } from '@lingui/react';
import { Container, DismissButton, Icon, Text } from './styledFlag';
import SrOnly from '../SrOnly';

type Props = {
  /**
   * The appeareance of the flag. Alters the color of the flag and the type of icon shown
   */
  appearance: 'error' | 'info' | 'normal' | 'success' | 'warning',
  /** If an icon should be shown on the flag. Type of icon is determined by the appearance */
  icon?: boolean,
  /** Boolean indicating if a dismiss button should be shown on the flag */
  isDismissAllowed?: boolean,
  /**
    Function that will be called to initiate dismissal of the flag
  */
  onDismissed?: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void,
  /** The text content of the flag */
  description: string | Element<typeof Trans>
};

export default class Flag extends React.Component<Props> {
  static defaultProps = {
    appearance: 'normal',
    icon: false,
    isDismissAllowed: false
  };

  renderIcon() {
    switch (this.props.appearance) {
      case 'error':
        return <MdWarning />;
      case 'success':
        return <MdStar />;
      default:
        return <MdInfo />;
    }
  }

  render() {
    const {
      appearance,
      icon,
      isDismissAllowed,
      onDismissed,
      description
    } = this.props;

    return (
      <Container appearance={appearance}>
        {icon && (
          <Icon aria-hidden appearance={appearance}>
            {this.renderIcon()}
          </Icon>
        )}

        <Text>{description}</Text>

        {isDismissAllowed && (
          <DismissButton type="button" onClick={onDismissed}>
            <MdClose aria-hidden />
            <SrOnly>
              <Trans>Dismiss</Trans>
            </SrOnly>
          </DismissButton>
        )}
      </Container>
    );
  }
}
