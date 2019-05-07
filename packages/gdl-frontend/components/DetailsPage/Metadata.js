// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { IconButton, Collapse, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { css } from '@emotion/core';

import type { book_book as Book } from '../../gqlTypes';
import type { intlShape } from 'react-intl';

import { withOnlineStatusContext } from '../OnlineStatusContext';
import A from '../../elements/A';

type Props = {
  book: Book,
  online: boolean
};

type ContributorProps = {
  contributorType: string,
  values: Array<{ name: string }>,
  intl: intlShape
};

const contributorMessages = defineMessages({
  author: {
    id: 'Author',
    defaultMessage: 'Author'
  },
  authors: {
    id: 'Authors',
    defaultMessage: 'Authors'
  },
  illustrator: {
    id: 'Illustrator',
    defaultMessage: 'Illustrator'
  },
  illustrators: {
    id: 'Illustrators',
    defaultMessage: 'Illustrators'
  },
  photographer: {
    id: 'Photographer',
    defaultMessage: 'Photographer'
  },
  photographers: {
    id: 'Photographers',
    defaultMessage: 'Photographers'
  },
  translator: {
    id: 'Translator',
    defaultMessage: 'Translator'
  },
  translators: {
    id: 'Translators',
    defaultMessage: 'Translators'
  }
});

const Contributor = injectIntl(
  ({ contributorType, values, intl }: ContributorProps) => {
    const keyName = (values.length > 1
      ? `${contributorType}s`
      : contributorType
    ).toLocaleLowerCase();
    return (
      <>
        <Typography variant="subtitle2" component="span">
          {intl.formatMessage(contributorMessages[keyName])}
        </Typography>
        <Typography component="span" paragraph css={noMarginForLastChild}>
          {values.map(contributor => contributor.name).join(', ')}
        </Typography>
      </>
    );
  }
);

const BookMeta = ({ book, online }: Props) => (
  <>
    {book.authors && (
      <Contributor contributorType="Author" values={book.authors} />
    )}
    {book.illustrators && (
      <Contributor contributorType="Illustrator" values={book.illustrators} />
    )}
    {book.photographers && (
      <Contributor contributorType="Photographer" values={book.photographers} />
    )}
    {book.translators && (
      <Contributor contributorType="Translator" values={book.translators} />
    )}
    <Typography variant="subtitle2" component="span">
      <FormattedMessage id="License" defaultMessage="License" />
    </Typography>
    {online ? (
      <A href={book.license.url} paragraph css={noMarginForLastChild}>
        {book.license.name}
      </A>
    ) : (
      <Typography component="span" paragraph css={noMarginForLastChild}>
        {book.license.name}
      </Typography>
    )}
    {book.additionalInformation && (
      <AdditionalInformation
        additionalInformation={book.additionalInformation}
      />
    )}
  </>
);

class AdditionalInformation extends React.Component<
  { additionalInformation: string },
  { isExpanded: boolean }
> {
  state = {
    isExpanded: false
  };

  render() {
    return (
      <div css={expansionStyles.wrapper}>
        <div
          css={expansionStyles.button}
          role="button"
          tabIndex="0"
          aria-expanded={this.state.isExpanded}
          onClick={() =>
            this.setState(state => ({ isExpanded: !state.isExpanded }))
          }
        >
          <Typography variant="subtitle2" component="span">
            <FormattedMessage
              id="Additional information"
              defaultMessage="Additional information"
            />
          </Typography>
          <IconButton
            css={[
              expansionStyles.iconButton,
              this.state.isExpanded && expansionStyles.iconButtonExpanded
            ]}
            tabIndex={-1}
            aria-hidden
            component="div"
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <Collapse in={this.state.isExpanded}>
          <Typography>{this.props.additionalInformation}</Typography>
        </Collapse>
      </div>
    );
  }
}

const noMarginForLastChild = css`
  &:last-child {
    margin-bottom: 0;
  }
`;

const expansionStyles = {
  // We want the wrapper to be the relative parent of the absolutely positioned IconButton.
  // This is because the focus outline of the button (not the iconbutton) won't have a
  // weird shape because it includes the size of the iconbutton.
  wrapper: css`
    position: relative;
  `,
  button: css`
    user-select: none;
  `,
  iconButton: css`
    position: absolute;
    top: 10px;
    right: 8px;
    transform: translateY(-50%) rotate(0deg);
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  `,
  iconButtonExpanded: css`
    transform: translateY(-50%) rotate(180deg);
  `
};

export default withOnlineStatusContext(BookMeta);
