// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled from 'styled-components';
import tag from 'tag-hoc';
import { fontSize } from 'styled-system';

const Base = tag([])('div');

/**
 * Smaller uppercased headers
 */
const Heading = styled(Base)`
  ${fontSize} text-transform: uppercase;
  font-weight: 600;
`;

Heading.defaultProps = {
  fontSize: 12,
};

export default Heading;
