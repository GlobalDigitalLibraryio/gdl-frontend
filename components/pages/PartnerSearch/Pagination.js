import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Pagination as Pag } from '../../generic';

const PaginationLink = ({ url, start, active, ...props }) => (
  <Link href={{ pathname: url.pathname, query: { ...url.query, start } }}>
    <Pag.Item active={active} {...props} />
  </Link>
);

PaginationLink.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.shape({
      q: PropTypes.string,
      start: PropTypes.number,
    }).isRequired,
  }).isRequired,
  start: PropTypes.number.isRequired,
  active: PropTypes.bool,
};

PaginationLink.defaultProps = {
  active: false,
};

/* eslint-disable react/prefer-stateless-function, react/forbid-prop-types */

export default class Pagination extends React.PureComponent {
  render() {
    const { page, url, lastPage } = this.props;
    return (
      <Pag>
        {page !== 1 && <PaginationLink aria-label="Previous" url={url} start={(page - 1) * 10}>&lt;</PaginationLink>}

        {page > 2 && [<PaginationLink url={url} key="first" start={0}>1</PaginationLink>, <Pagination.Item key="ellipsis" ellipsis />]}

        {page !== 1 &&
          <PaginationLink url={url} start={(page - 1) * 10}>
            {page - 1}
          </PaginationLink>}

        <PaginationLink active url={url} start={page * 10}>
          {page}
        </PaginationLink>

        {lastPage !== page &&
          <PaginationLink url={url} start={(page + 1) * 10}>
            {page + 1}
          </PaginationLink>}

        {lastPage !== page && <PaginationLink ara-label="Next" url={url} start={(page + 1) * 10}>&gt;</PaginationLink>}
      </Pag>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  url: PropTypes.object.isRequired,
};
