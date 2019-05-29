// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, Router } from '../routes';
import { css } from '@emotion/core';
import getConfig from 'next/config';

import {
  Grow,
  Button,
  ButtonBase,
  Typography,
  ClickAwayListener
} from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import { colors } from '../style/theme';

import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

type Props = {
  menuIsOpen: boolean,
  bookId: number,
  crowdinUrl: ?string,
  translatedTo: string,
  popperStyle?: Object,
  onClose: (event: Event) => void
};

// $FlowFixMe forwardRef fixed in flow@0.89 https://github.com/facebook/flow/issues/6103
const TranslateDropdown = React.forwardRef(
  (
    {
      menuIsOpen,
      bookId,
      translatedTo,
      crowdinUrl,
      onClose,
      popperStyle
    }: Props,
    ref: React$ElementRef<typeof Button>
  ) => (
    <Popper
      open={menuIsOpen}
      transition
      disablePortal
      placement="bottom-end"
      css={[styles.translationMenu, popperStyle]}
    >
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} id="menu-list-grow">
          <ClickAwayListener onClickAway={onClose}>
            <div>
              <div style={{ marginTop: 5 }}>
                <Link
                  passHref
                  route={`/en/books/translate/${bookId}/${translatedTo.toLowerCase()}/edit`}
                  params={{
                    id: bookId,
                    lang: DEFAULT_LANGUAGE.code,
                    toLang: translatedTo.toLowerCase()
                  }}
                >
                  <MenuButton buttonRef={ref}>
                    <Typography style={{ fontSize: '0.9375rem' }} align="left">
                      <FormattedMessage
                        id="Translate in context"
                        defaultMessage="Translate in context"
                      />
                    </Typography>
                  </MenuButton>
                </Link>
              </div>
              <div style={{ marginTop: 5 }}>
                <MenuButton
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crowdinUrl}
                  buttonRef={ref}
                  onClick={() => Router.pushRoute('translations')}
                >
                  <Typography style={{ fontSize: '0.9375rem' }} align="left">
                    <FormattedMessage
                      id="Mobile translation"
                      defaultMessage="Mobile translation"
                    />
                  </Typography>
                </MenuButton>
              </div>
            </div>
          </ClickAwayListener>
        </Grow>
      )}
    </Popper>
  )
);

/**
 * Wrapped ButtonBase, so we can reuse css style which initially cant handle dynamic props
 *
 * @param {ref of parent button to scale width} param0
 */
const MenuButton = ({ buttonRef, ...rest }) => {
  const clientWidth = buttonRef.current ? buttonRef.current.clientWidth : null;
  const style = css`
    padding: 8px 0 8px 24px;
    width: ${clientWidth}px;
    justify-content: flex-start;
    border-radius: 0;
    background-color: #c6e9fd;
    &:hover,
    &:focus {
      background-color: ${colors.default};
      p {
        color: #fff;
        font-weight: 500;
      }
    }
  `;

  return <ButtonBase {...rest} css={style} />;
};

const styles = {
  translationMenu: css`
    top: initial;
    position: absolute;
    left: 0;
    right: 0;
    margin-right: auto;
    margin-left: auto;
    z-index: 1000;
    width: fit-content;
  `
};

export default TranslateDropdown;
