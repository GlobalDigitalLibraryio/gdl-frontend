import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../components/Cardd';
import ImageContainer from '../../components/ImageContainer';
import Columns, { Column } from '../Columns';

const HoverCard = Card.extend`
  min-height: 300px;
  transition: border 100ms ease-in-out;
  &:hover {
    margin-top: -5px;
  }
  flex-grow: 1;
`;

// <div dangerouslySetInnerHTML={{ __html: item.snippet }} />

const Result = ({ item }) => (
  <HoverCard>
    <Card.Image>
      <ImageContainer>
        {item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0 && <img src={item.pagemap.cse_image[0].src} alt="" />}
      </ImageContainer>
    </Card.Image>
    <Card.Content>
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <p>{item.title}</p>
      </a>
      <small>{item.displayLink}</small>
    </Card.Content>
  </HoverCard>
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
  <Columns multiline>
    {items.map(item => <Column size="4" tablet="4" desktop="3" key={item.cacheId}><Result key={item.cacheId} item={item} /></Column>)}
  </Columns>
);

export default Results;
