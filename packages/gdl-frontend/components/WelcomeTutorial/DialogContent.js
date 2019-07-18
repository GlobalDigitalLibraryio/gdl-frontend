//@flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { Card, CardContent } from '@material-ui/core';

function getDialogContent(
  screenshotUrlM: string,
  screenshotUrl: string,
  graceImgUrl: string,
  message: string,
  fullscreen: boolean
) {
  let isFullscreenStyle;
  let isFullscreenScreenshot;
  if (fullscreen) {
    isFullscreenStyle = { display: 'flex' };
    isFullscreenScreenshot = screenshotUrlM;
  } else {
    isFullscreenStyle = { height: '270px' };
    isFullscreenScreenshot = screenshotUrl;
  }
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
      <div style={isFullscreenStyle}>
        <img
          src={isFullscreenScreenshot}
          alt="screenshot from the page"
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
        <img style={{ maxHeight: 182 }} src={graceImgUrl} alt="Grace" />
        <Card style={{ marginLeft: '15px', width: '100%' }}>
          <CardContent
            style={{ display: 'table', height: '100%', width: '100%' }}
          >
            <p
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
                display: 'table-cell'
              }}
            >
              {message}
            </p>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
}

export default getDialogContent;
