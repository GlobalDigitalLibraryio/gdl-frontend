// @flow
import React from 'react';
import { CheckCircle } from '@material-ui/icons';

export default function OfflineIcon({
  filled,
  ...props
}: {
  filled?: boolean
}) {
  return <CheckCircle style={filled ? { color: 'green' } : null} {...props} />;
}
