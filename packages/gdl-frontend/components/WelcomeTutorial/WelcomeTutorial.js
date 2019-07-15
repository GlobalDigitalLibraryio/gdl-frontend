//@flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Card, CardContent } from '@material-ui/core';
import MobileStepper from '@material-ui/core/MobileStepper';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

type State = {
  open: boolean,
  width: number,
  height: number,
  activeStep: number
};
type Props = {
  shouldOpen: boolean
};

const Styles = {
  dialogWindow: {
    backgroundColor: '#2B8DC8',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  nextButton: {
    color: 'white',
    backgroundColor: '#8FE346'
  },
  skipButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.16)'
  },
  dotActive: { backgroundColor: 'white' }
};

class WelcomeTutorial extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: this.props.shouldOpen,
      width: 0,
      height: 0,
      activeStep: 0
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.updateWindowDimensions.bind(this)
    );
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleClickOpen() {
    this.setState({
      open: true,
      activeStep: 0
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleNext() {
    this.setState({
      activeStep: this.state.activeStep + 1
    });
  }
  handleBack() {
    this.setState({
      activeStep: this.state.activeStep - 1
    });
  }

  render() {
    return (
      <div>
        <IconButton
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen.bind(this)}
        >
          <HelpOutlineIcon />
        </IconButton>

        <Dialog
          fullScreen={this.state.width < 500}
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="responsive-dialog-title"
        >
          <div style={Styles.dialogWindow}>
            <DialogContent>
              <div style={{}}>
                <img
                  src="https://files.slack.com/files-pri/T0STRACJV-FL869E849/group.png"
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <img src="https://files.slack.com/files-pri/T0STRACJV-FLGM4GPE2/grace.png" />

                  <Card style={{ marginLeft: '15px' }}>
                    <CardContent>
                      Hi! <br /> <br />
                      If you want to change the language, click on the globe in
                      the at the top-right corner of the screen!
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <MobileStepper
                variant="dots"
                steps={3}
                position="static"
                activeStep={this.state.activeStep}
                style={Styles.dotActive}
                nextButton={
                  <Button
                    size="large"
                    onClick={this.handleNext.bind(this)}
                    disabled={this.state.activeStep === 2}
                    autoFocus
                    style={Styles.nextButton}
                  >
                    Next
                  </Button>
                }
                backButton={
                  <Button
                    size="large"
                    onClick={this.handleBack.bind(this)}
                    disabled={this.state.activeStep === 0}
                    style={Styles.skipButton}
                  >
                    Back
                  </Button>
                }
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  backgroundColor: '#2B8DC8'
                }}
              />
            </DialogActions>
            <Button
              size="small"
              onClick={this.handleClose.bind(this)}
              color="primary"
              style={Styles.skipButton}
            >
              Skip
            </Button>
            <br />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(Styles)(WelcomeTutorial);
