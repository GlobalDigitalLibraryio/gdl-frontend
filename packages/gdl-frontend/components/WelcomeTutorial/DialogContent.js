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
    return (
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%'
        }}
      >
        <div
          style={
            this.props.fullscreen ? { display: 'flex' } : { height: '270px' }
          }
        >
          <img
            src={
              this.props.fullscreen
                ? this.props.screenshotUrlM
                : this.props.screenshotUrl
            }
            alt="screenshot from the page"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
          <img
            style={{ maxHeight: 170 }}
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
                style={
                  this.props.fullscreen
                    ? {
                        fontSize: '14px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'table-cell'
                      }
                    : {
                        fontSize: '16px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'table-cell'
                      }
                }
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
