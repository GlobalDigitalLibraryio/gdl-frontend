import * as React from 'react';
import { css } from '@emotion/core';

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
const Center = (props: Props) => <div css={style} {...props} />;

export default Center;
