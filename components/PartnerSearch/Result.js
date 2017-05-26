import React from 'react';
import PropTypes from 'prop-types';

const Result = ({ item }) => (
  <div>
    <a href={item.link} target="_blank" rel="noopener noreferrer">
      {item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0 && <img src={item.pagemap.cse_image[0].src} alt="" />}
      <span>{item.title}</span>
      <div dangerouslySetInnerHTML={{ __html: item.snippet }} />
    </a>
  </div>
);

Result.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
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
