//@flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { Card, CardContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';

function getDialogContent(
  screenshotUrl: string,
  graceImgUrl: string,
  message: string
) {
  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        minHeight: 485,
        height: '100%'
      }}
    >
      <img src={screenshotUrl} style={{ width: '100%' }} />
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: 25 }}>
        <img style={{ maxHeight: 182 }} src={graceImgUrl} />
        <Card style={{ marginLeft: '15px', width: '100%' }}>
          <CardContent>{message}</CardContent>
        </Card>
      </div>
    </DialogContent>
  );
}

export default getDialogContent;
