// @flow
import * as React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Hidden, Typography, Button, Dialog, Tooltip } from '@material-ui/core';
import { Delete, CheckCircle, Clear } from '@material-ui/icons';
import { Container, Center, IconButton } from '../../elements';
import EditBookGrid from './BookGrid';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { spacing, misc } from '../../style/theme';
import type { intlShape } from 'react-intl';

type Props = {
  books: Array<any>,
  onClick: () => void,
  selectedBooks: Array<string>,
  onDelete: () => Promise<void>,
  dialog: () => void,
  open: boolean,
  selectAll: number,
  selectAllBooks: () => void,
  deselectAllBooks: () => void,
  changeActive: () => void,
  favorites: boolean,
  intl: intlShape
};

const translations = defineMessages({
  books: {
    id: 'books',
    defaultMessage: 'books'
  },
  book: {
    id: 'book',
    defaultMessage: 'book'
  },
  favorites: {
    id: 'favorites',
    defaultMessage: 'favorites?'
  },
  offlineLibrary: {
    id: 'offline library',
    defaultMessage: 'offline library?'
  }
});

const EditBooks = ({
  books,
  onClick,
  selectedBooks,
  onDelete,
  dialog,
  open,
  selectAllBooks,
  selectAll,
  deselectAllBooks,
  changeActive,
  favorites,
  intl
}: Props) => (
  <>
    <Hidden smUp>
      <EditBooksBar>
        <IconButton
          onClick={deselectAllBooks}
          css={iconButtonStyle}
          label=""
          icon={
            <Clear
              color={selectedBooks.length === 0 ? 'disabled' : 'inherit'}
            />
          }
        />
        <Typography variant="subtitle1" component="p">
          {selectedBooks.length} books chosen
        </Typography>
      </EditBooksBar>
      <EditBooksBar
        style={{
          bottom: '0%',
          justifyContent: 'space-around',
          borderTop: '1px solid lightgray'
        }}
      >
        <IconButton
          css={bottomIconButtonStyle}
          onClick={selectAllBooks}
          aria-label="select"
          icon={<CheckCircle color={selectAll === 1 ? 'primary' : 'inherit'} />}
          label={
            <FormattedMessage id="Select all" defaultMessage="Select all" />
          }
        />
        <IconButton
          css={bottomIconButtonStyle}
          onClick={dialog}
          className="test"
          icon={
            <Delete
              color={selectedBooks.length === 0 ? 'disabled' : 'inherit'}
            />
          }
          label={<FormattedMessage id="Delete" defaultMessage="Delete" />}
        />
      </EditBooksBar>
    </Hidden>
    <Hidden xsDown>
      <EditBooksBar>
        <div
          style={{
            width: 'calc(100% - 40px)',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h5" component="h5">
            Edit {favorites ? 'favorites' : 'offline library'}
          </Typography>
        </div>
        <IconButton
          onClick={deselectAllBooks}
          css={iconButtonStyle}
          label=""
          icon={
            <Tooltip
              title={
                <FormattedMessage
                  id="Deselect all"
                  defaultMessage="Deselect all"
                />
              }
            >
              <Clear
                color={selectedBooks.length === 0 ? 'disabled' : 'inherit'}
              />
            </Tooltip>
          }
        />
        <Typography variant="subtitle1" component="p">
          {selectedBooks.length} books chosen
        </Typography>

        <Right>
          <IconButton
            css={iconButtonStyle}
            aria-label="select"
            onClick={selectAllBooks}
            icon={
              <CheckCircle color={selectAll === 1 ? 'primary' : 'inherit'} />
            }
            label={
              <FormattedMessage id="Select all" defaultMessage="Select all" />
            }
          />

          <IconButton
            css={iconButtonStyle}
            aria-label="delete"
            onClick={dialog}
            icon={
              <Delete
                color={selectedBooks.length === 0 ? 'disabled' : 'inherit'}
              />
            }
            label={<FormattedMessage id="Delete" defaultMessage="Delete" />}
          />
        </Right>
      </EditBooksBar>
    </Hidden>

    <Container css={{ marginTop: '95px', marginBottom: spacing.large }}>
      <EditBookGrid
        books={books}
        selectedBooks={selectedBooks}
        active={selectAll}
        changeActive={changeActive.bind(this)}
        css={{ marginTop: '68px' }}
      />
      <Center>
        <Button
          color="primary"
          onClick={onClick}
          css={{ marginTop: spacing.large }}
          variant="contained"
          size="small"
        >
          <FormattedMessage
            id="Back to fav/offline"
            defaultMessage={'Back to {place}'}
            values={{ place: favorites ? 'favorites' : 'offline library' }}
          />
        </Button>
      </Center>
      <Dialog
        open={open}
        onClose={dialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className="content"
          css={{
            padding: '20px 30px'
          }}
        >
          <p>
            <FormattedMessage
              id="Are you sure you want to delete"
              defaultMessage={'Are you sure you want to delete'}
            />
            {` ${selectedBooks.length} `}
            {` ${
              selectedBooks.length > 1
                ? `${intl.formatMessage(translations.books)} `
                : `${intl.formatMessage(translations.book)} `
            }`}
            <FormattedMessage id="from" defaultMessage={'from'} />
            {`${
              favorites
                ? ` ${intl.formatMessage(translations.favorites)}`
                : ` ${intl.formatMessage(translations.offlineLibrary)}`
            }`}
          </p>

          <Button
            color="primary"
            onClick={dialog}
            css={{ width: '45%', marginRight: '5%' }}
          >
            <FormattedMessage id="Cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            variant="contained"
            onClick={onDelete}
            color="primary"
            css={{ width: '45%', marginLeft: '5%' }}
          >
            <FormattedMessage id="Delete" defaultMessage="Delete" />
          </Button>
        </div>
      </Dialog>
    </Container>
  </>
);

const EditBooksBar = styled('div')`
  display: flex;
  height: 60px;
  width: 100%;
  position: fixed;
  background-color: rgb(248, 248, 248);
  z-index: 1;
  max-width: ${misc.containers.large}px;
  margin-left: auto;
  margin-right: auto;
  border-bottom: 1px solid lightgrey;
  align-items: center;
  padding: 0 20px;
`;

const Right = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const iconButtonStyle = css`
  height: 60px;
  width: fit-content;
  padding: 0 12px;
  span {
    font-size: 0.8rem;
  }
`;
const bottomIconButtonStyle = css`
  height: 60px;
  width: 35%;
  border-radius: 10%;
  span {
    font-size: 0.8rem;
  }
`;

export default injectIntl(EditBooks);
