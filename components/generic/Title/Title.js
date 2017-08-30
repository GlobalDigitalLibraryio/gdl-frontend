import PropTypes from 'prop-types';
import styled from 'styled-components';

const Title = styled.h3`
  word-break: break-word;
  color: #363636;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1.125;
  text-align: ${props => (props.textCentered ? 'center' : 'left')};

  &:not(:last-child) {
    margin-bottom: 1.5em;
  }

  & span,
  & em {
    font-weight: 300;
  }

  & strong {
    color: inherit;
    font-weight: 500;
  }
`;

Title.propTypes = {
  textCentered: PropTypes.bool
};

Title.defaultProps = {
  textCentered: false
};

const H1 = Title.withComponent('h1').extend`
  font-size: 3rem;
`;

const H2 = Title.withComponent('h2').extend`
  font-size: 2.5rem;
`;

// Default
const H3 = Title;

const H4 = Title.withComponent('h4').extend`
  font-size: 1.5rem;
`;

const H5 = Title.withComponent('h5').extend`
  font-size: 1.25rem;
`;

const H6 = Title.withComponent('h6').extend`
  font-size: 1rem;
`;

// When the semantics of h tags aren't correct, but you would still like the styling
const P1 = H1.withComponent('p');
const P2 = H2.withComponent('p');
const P3 = H3.withComponent('p');
const P4 = H4.withComponent('p');
const P5 = H5.withComponent('p');
const P6 = H6.withComponent('p');

export { H1, H2, H3 as default, H4, H5, H6, P1, P2, P3, P4, P5, P6 };
