//@flow
import React from 'react';
import { Card, CardContent, DialogContent } from '@material-ui/core';

type Props = {
  screenshotUrlM: string,
  screenshotUrl: string,
  graceImgUrl: string,
  message: string,
  fullscreen: boolean
};

class GetDialogContent extends React.Component<Props> {
  render() {
    return (
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <div
          style={
            this.props.fullscreen
              ? {
                  display: 'flex',
                  height: '50%',
                  width: '-webkit-fill-available',
                  justifyContent: 'center'
                }
              : { height: '270px' }
          }
        >
          <img
            src={
              this.props.fullscreen
                ? this.props.screenshotUrlM
                : this.props.screenshotUrl
            }
            alt="screenshot from the page"
            style={
              this.props.fullscreen
                ? {
                    objectFit: 'contain',
                    height: '100%',
                    maxWidth: '100%'
                  }
                : { width: '100%' }
            }
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 20,
            height: '50%'
          }}
        >
          <img
            style={{ maxHeight: 170, objectFit: 'scale-down' }}
            src={this.props.graceImgUrl}
            alt="Grace"
          />
          <Card style={{ marginLeft: '15px', width: '100%' }}>
            <CardContent
              style={{
                display: 'table',
                height: '100%',
                width: '100%',
                padding: 0
              }}
            >
              <p
                style={{
                  fontSize: `${this.props.fullscreen ? '14' : '16'}px`,
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  display: 'table-cell',
                  padding: '0 10px'
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
