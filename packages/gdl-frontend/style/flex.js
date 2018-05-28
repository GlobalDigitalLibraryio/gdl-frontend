import { css } from 'react-emotion';

const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const flexColumnCentered = css`
  ${flexCenter};
  flex-direction: column;
`;

export { flexCenter, flexColumnCentered };
