import styled from '@emotion/styled';
import media from '../style/media';
import { SIDE_DRAWER_WIDTH } from '../style/constants';

const SideMenuMargin = styled('div')`
  margin-left: 0;
  ${media.largerTablet`
    margin-left: ${SIDE_DRAWER_WIDTH}px;
    flex: 1 0 auto;
  `}
`;

export default SideMenuMargin;
