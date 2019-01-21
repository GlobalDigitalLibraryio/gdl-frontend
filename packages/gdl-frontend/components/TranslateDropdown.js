// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { Trans } from '@lingui/react';
import { Link, Router } from '../routes';
import { css, cx } from 'react-emotion';

import {
  Grow,
  Popper,
  Button,
  ButtonBase,
  Typography,
  ClickAwayListener
} from '@material-ui/core';

type Props = {
  menuIsOpen: boolean,
  bookId: number,
  crowdinUrl: ?string,
  popperStyle?: Object,
  onClose: (event: SyntheticInputEvent<EventTarget>) => void
};

// $FlowFixMe forwardRef fixed in flow@0.89 https://github.com/facebook/flow/issues/6103
const TranslateDropdown = React.forwardRef(
  (
    { menuIsOpen, bookId, crowdinUrl, onClose, popperStyle }: Props,
    ref: React$ElementRef<Button>
  ) => (
    <Popper
      open={menuIsOpen}
      transition
      disablePortal
      placement="bottom-end"
      css={cx(styles.translationMenu, popperStyle)}
    >
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} id="menu-list-grow">
          <ClickAwayListener onClickAway={onClose}>
            <div>
              <div style={{ marginTop: 5 }}>
                <Link
                  passHref
                  route={`/en/books/translate/${bookId}/edit`}
                  params={{
                    id: bookId,
                    lang: 'en'
                  }}
                >
                  <ButtonBase
                    css={{
                      padding: '8px 0 8px 24px',
                      width: ref.current ? ref.current.clientWidth : null,
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      backgroundColor: '#C6E9FD'
                    }}
                  >
                    <Typography style={{ fontSize: '0.9375rem' }} align="left">
                      <Trans>Translate in context</Trans>
                    </Typography>
                  </ButtonBase>
                </Link>
              </div>
              <div style={{ marginTop: 5 }}>
                <ButtonBase
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crowdinUrl}
                  onClick={() => Router.pushRoute('translations')}
                  css={{
                    padding: '8px 0 8px 24px',
                    width: ref.current ? ref.current.clientWidth : null,
                    justifyContent: 'flex-start',
                    borderRadius: 0,
                    backgroundColor: '#C6E9FD'
                  }}
                >
                  <Typography style={{ fontSize: '0.9375rem' }} align="left">
                    <Trans>Mobile translation</Trans>
                  </Typography>
                </ButtonBase>
              </div>
            </div>
          </ClickAwayListener>
        </Grow>
      )}
    </Popper>
  )
);

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
