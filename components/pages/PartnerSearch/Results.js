/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ImageContainer, Card, Column, Columns } from '../../generic';
import media from '../../generic/helpers/media';

const ResultCard = Card.extend`
  min-height: 200px;
  flex-grow: 1;
  ${media.mobile`
    min-height: 150px;
  `};
`;

const ResultCardContent = Card.Content.extend`
  ${media.mobile`
    padding: 0.75rem;
  `}
`;

const TitleLink = styled.a`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  margin-bottom: 1em;
`;

const Result = ({ item }) => (
  <ResultCard>
    <Card.Image>
      <ImageContainer>
        {item.pagemap &&
        item.pagemap.cse_image &&
        item.pagemap.cse_image.length > 0 && (
          <img src={item.pagemap.cse_image[0].src} alt="" />
        )}
      </ImageContainer>
    </Card.Image>
    <ResultCardContent>
      <TitleLink href={item.link} target="_blank" rel="noopener noreferrer">
        {item.title}
      </TitleLink>
      <small>
        {item.displayLink.substring(0, item.displayLink.indexOf('.'))}
      </small>
    </ResultCardContent>
  </ResultCard>
);

Result.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    displayLink: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    pagemap: PropTypes.shape({
      cse_image: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
        }),
      ),
    }),
  }).isRequired,
};

const Results = ({ items }) => (
  <Columns multiline responsive="mobile">
    {items.map(item => (
      <Column size="4" mobile="6" tablet="4" desktop="3" key={item.cacheId}>
        <Result key={item.cacheId} item={item} />
      </Column>
    ))}
  </Columns>
);

Results.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      cacheId: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Results;
