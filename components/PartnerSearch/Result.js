import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../components/Cardd';
import ImageContainer from '../../components/ImageContainer';

const HoverCard = Card.extend`
  min-height: 400px;
  transition: border 100ms ease-in-out;
  &:hover {
    margin-top: -5px;
  }
`;

const Result = ({ item }) => (
  <a href={item.link} target="_blank" rel="noopener noreferrer">
    <HoverCard>
      <Card.Image>
        <ImageContainer>
          {item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0 && <img src={item.pagemap.cse_image[0].src} alt="" />}
        </ImageContainer>
      </Card.Image>
      <Card.Content>
        <span>{item.title}</span>
        <div dangerouslySetInnerHTML={{ __html: item.snippet }} />
        <small>{item.displayLink}</small>
      </Card.Content>
    </HoverCard>
  </a>
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

export default Result;
