// @flow

import * as React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import styled from '@emotion/styled';

import CoverImage from '../CoverImage';
import media from '../../style/media';
import { coverWidths } from '../BookListSection/coverWidths';

export type Book = $ReadOnly<{
  id: string,
  bookId: number,
  title: string,
  language: {
    code: string
  },
  coverImage: ?{ url: string }
}>;

type Props = {
  book: Book,
  selectedBooks: Array<string>,
  changeActive: () => void,
  selectAll: boolean
};

type State = {
  active: boolean
};

export default class BookLink extends React.Component<Props, State> {
  state = {
    active: false
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedBooks !== this.props.selectedBooks) {
      this.props.selectAll
        ? this.setState({ active: true })
        : this.setState({ active: false });
    }
  }

  handleClick(id: string, selectedBooks: Array<string>) {
    if (!selectedBooks.some(item => id === item)) {
      selectedBooks.push(id);
      this.setState({ active: true });
    } else {
      selectedBooks.splice(selectedBooks.indexOf(id), 1);
      this.setState({ active: false });
    }
    this.props.changeActive();
  }

  render() {
    const { book, selectedBooks } = this.props;
    const bookSelected = selectedBooks.some(item => book.id === item);
    if (this.state.active && !bookSelected) {
      selectedBooks.push(book.id);
    } else if (!this.state.active && bookSelected) {
      selectedBooks.splice(selectedBooks.indexOf(book.id), 1);
    }

    return (
      <Card onClick={() => this.handleClick(book.id, selectedBooks)}>
        <CheckCircle
          className={this.state.active ? 'isSelected' : 'selectBook'}
          style={{ position: 'absolute' }}
        />
        <CoverImage
          size="small"
          className={this.state.active ? 'active' : 'notActive'}
          coverImage={book.coverImage}
          noShadow
        />
        <CardContent
          className={this.state.active ? 'active' : 'notActive'}
          css={{ padding: 10, ':last-child': { paddingBottom: 10 } }}
        >
          <Typography
            lang={book.language.code}
            title={book.title}
            noWrap
            component="a"
            align="center"
          >
            {book.title}
          </Typography>
        </CardContent>{' '}
      </Card>
    );
  }
}

const Card = styled('div')`
  .selectBook {
    color: rgb(68, 68, 68);
  }
  .isSelected {
    color: #0277bd;
  }
  .active img {
    transition: all 0.08s ease-in-out;
    padding: 10px;
    padding-bottom: 0px;
  }
  .active svg {
    color: #0277bd;
  }
  .active {
    background-color: #d7e2f5;
  }
  position: relative;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
  :hover {
    .selectBook {
      color: #8a8b91;
    }
  }
  margin-right: 15px;
  width: ${coverWidths.small}px;
  ${media.tablet`
    width: ${coverWidths.large}px;
  `};
`;
