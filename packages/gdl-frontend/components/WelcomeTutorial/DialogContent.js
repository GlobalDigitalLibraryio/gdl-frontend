//@flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { Card, CardContent } from '@material-ui/core';

type Props = {
  screenshotUrlM: string,
  screenshotUrl: string,
  graceImgUrl: string,
  message: string,
  fullscreen: boolean
};

class GetDialogContent extends React.Component<Props> {
  render() {
    let isFullscreenStyle;
    let isFullscreenScreenshot;
    if (this.props.fullscreen) {
      isFullscreenStyle = { display: 'flex' };
      isFullscreenScreenshot = this.props.screenshotUrlM;
    } else {
      isFullscreenStyle = { height: '270px' };
      isFullscreenScreenshot = this.props.screenshotUrl;
    }

    return (
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
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
          <img
            style={{ maxHeight: 182 }}
            src={this.props.graceImgUrl}
            alt="Grace"
          />
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
                {this.props.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    );
  }
}

export default GetDialogContent;
