import styled from 'styled-components';

const Container = styled.div`
  position: relative;

  @media screen and (min-width: 1000px) {
    margin: 0 auto;
    max-width: 960px;
    width: 960px;
  }

  @media screen and (min-width: 1192px) {
    max-width: 1152px;
    width: 1152px;
  }

  @media screen and (min-width: 1384px) {
    max-width: 1344px;
    width: 1344px;
  }

`;

export default Container;
