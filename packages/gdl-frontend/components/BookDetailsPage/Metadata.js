// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { IconButton, Collapse, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Trans, Plural } from '@lingui/react';
import { css, cx } from 'react-emotion';

import { ContributorTypes, type BookDetails } from '../../types';
import { withOnlineStatusContext } from '../OnlineStatusContext';
import A from '../../elements/A';

type Props = {
  book: BookDetails,
  online: boolean
};

function headingText(type, value) {
  switch (type) {
    case ContributorTypes.AUTHOR:
      return <Plural one="Author" other="Authors" value={value} />;
    case ContributorTypes.ILLUSTRATOR:
      return <Plural one="Illustrator" other="Illustrators" value={value} />;
    case ContributorTypes.TRANSLATOR:
      return <Plural one="Translator" other="Translators" value={value} />;
    case ContributorTypes.PHOTOGRAPHER:
      return <Plural one="Photographer" other="Photographers" value={value} />;
    default:
      return <Plural one="Contributor" other="Contributors" value={value} />;
  }
}

function listContributors(contributorType, contributors) {
  const contributorsOfType = contributors.filter(
    c => c.type === contributorType
  );

  if (contributorsOfType.length > 0) {
    return (
      // $FlowFixMe this is a string...
      <Fragment key={contributorType}>
        <Typography variant="subtitle2" component="span">
          {headingText(contributorType, contributorsOfType.length)}
        </Typography>
        <Typography component="span" paragraph className={noMarginForLastChild}>
          {contributorsOfType.map(contributor => contributor.name).join(', ')}
        </Typography>
      </Fragment>
    );
  }
  return null;
}

const BookMeta = ({ book, online }: Props) => {
  return (
    <>
      {Object.values(ContributorTypes).map(type =>
        listContributors(type, book.contributors)
      )}

      <Typography variant="subtitle2" component="span">
        <Trans>License</Trans>
      </Typography>
      {online ? (
        <A href={book.license.url} paragraph className={noMarginForLastChild}>
          {book.license.description}
        </A>
      ) : (
        <Typography component="span" paragraph className={noMarginForLastChild}>
          {book.license.description}
        </Typography>
      )}
      {book.additionalInformation && (
        <AdditionalInformation
          additionalInformation={book.additionalInformation}
        />
      )}
    </>
  );
};

class AdditionalInformation extends React.Component<
  { additionalInformation: string },
  { isExpanded: boolean }
> {
  state = {
    isExpanded: false
  };

  render() {
    return (
      <div className={expansionStyles.wrapper}>
        <div
          className={expansionStyles.button}
          role="button"
          tabIndex="0"
          aria-expanded={this.state.isExpanded}
          onClick={() =>
            this.setState(state => ({ isExpanded: !state.isExpanded }))
          }
        >
          <Typography variant="subtitle2" component="span">
            <Trans>Additional information</Trans>
          </Typography>
          <IconButton
            className={cx(expansionStyles.iconButton, {
              [expansionStyles.iconButtonExpanded]: this.state.isExpanded
            })}
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
