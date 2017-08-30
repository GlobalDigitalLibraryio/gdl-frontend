import styled from 'styled-components';
import PropTypes from 'prop-types';

const ImageContainer = styled.figure`
  display: block;
  position: relative;
  img {
    display: block;
    height: auto;
    width: 100%;

    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
  padding-top: 66.6666%;
`;

ImageContainer.propTypes = {
  ratio: PropTypes.oneOf(['3by2'])
};

export default ImageContainer;
