import * as React from 'react';
import { css, cx } from 'react-emotion';

const style = css`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

type Props = {
  className?: string
};

/**
 * Flex centered column
 */
const Center = ({ className, ...props }: Props) => (
  <div className={cx(style, className)} {...props} />
);

export default Center;
