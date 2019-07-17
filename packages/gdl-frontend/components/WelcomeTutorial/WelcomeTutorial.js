//@flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MobileStepper from '@material-ui/core/MobileStepper';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Slide from '@material-ui/core/Slide';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import getDialogContent from './DialogContent';

const grace1 = '/static/img/grace1.png';
const grace2 = '/static/img/grace2.png';
const grace3 = '/static/img/grace3.png';
const selectLanguage = '/static/img/selectLanguage.png';
const saveOffline = '/static/img/saveOffline.png';
const readBook = '/static/img/readBook.png';

type State = {
  open: boolean,
  width: number,
  height: number,
  activeStep: number,
  direction: 'left' | 'right',
  isHidden1: string,
  isHidden2: string,
  isHidden3: string
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
  dialogContent: {
    backgroundColor: '#2B8DC8',
    height: '100%',
    width: '100%'
  },
  nextButton: {
    color: 'white',
    backgroundColor: '#8FE346'
  },
  skipButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.16)'
  }
};

class WelcomeTutorial extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: this.props.shouldOpen,
      width: 0,
      height: 0,
      activeStep: 0,
      direction: 'left',
      isHidden1: 'flex',
      isHidden2: 'none',
      isHidden3: 'none'
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
      open: false,
      isHidden1: 'flex',
      isHidden2: 'none',
      isHidden3: 'none'
    });
  }

  handleNext() {
    if (this.state.activeStep === 2) {
      this.handleClose();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
        direction: 'left'
      });
      if (this.state.activeStep === 0) {
        this.setState({
          isHidden1: 'none',
          isHidden2: 'flex',
          isHidden3: 'none'
        });
      }
      if (this.state.activeStep === 1) {
        this.setState({
          isHidden1: 'none',
          isHidden2: 'none',
          isHidden3: 'flex'
        });
      }
    }
  }
  handleBack() {
    this.setState({
      direction: 'right',
      activeStep: this.state.activeStep - 1
    });
    if (this.state.activeStep === 1) {
      this.setState({
        isHidden1: 'flex',
        isHidden2: 'none',
        isHidden3: 'none'
      });
    }
    if (this.state.activeStep === 2) {
      this.setState({
        isHidden1: 'none',
        isHidden2: 'flex',
        isHidden3: 'none'
      });
    }
  }

  render() {
    let mobile: boolean = this.state.width < 500;
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
          fullScreen={mobile}
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
        >
          <div style={Styles.dialogWindow}>
            <Slide
              style={{ height: '100%' }}
              direction={this.state.direction}
              in={this.state.activeStep === 0}
            >
              <div style={{ display: this.state.isHidden1 }}>
                {getDialogContent(
                  selectLanguage,
                  grace1,
                  `Hi! If you want to change the language, click on the globe at the top-right corner of the screen!`,
                  mobile
                )}
              </div>
            </Slide>
            <Slide
              style={{ height: '100%' }}
              direction={this.state.direction}
              in={this.state.activeStep === 1}
            >
              <div style={{ display: this.state.isHidden2 }}>
                {getDialogContent(
                  saveOffline,
                  grace2,
                  'You can save books for later and read them offline by clicking the Save offline icon.',
                  mobile
                )}
              </div>
            </Slide>
            <Slide
              style={{ height: '100%' }}
              direction={this.state.direction}
              in={this.state.activeStep === 2}
            >
              <div style={{ display: this.state.isHidden3 }}>
                {getDialogContent(
                  readBook,
                  grace3,
                  'To read a book, click on the blue READ BOOK-button. Enjoy! ',
                  mobile
                )}
              </div>
            </Slide>
            <div>
              <DialogActions>
                <MobileStepper
                  variant="dots"
                  steps={3}
                  position="static"
                  activeStep={this.state.activeStep}
                  classes={{ dotActive: 'activeDot' }}
                  css={css`
                    width: 100%;
                    justify-content: space-between;
                    background-color: #2b8dc8;
                    .activeDot {
                      background-color: white;
                    }
                  `}
                  nextButton={
                    <Button
                      size="large"
                      onClick={this.handleNext.bind(this)}
                      autoFocus
                      style={Styles.nextButton}
                    >
                      {this.state.activeStep === 2 ? 'Finish' : 'Next'}
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
                />
              </DialogActions>
              <div
                style={{
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingBottom: '16px'
                }}
              >
                <Button
                  size="small"
                  onClick={this.handleClose.bind(this)}
                  color="primary"
                  style={Styles.skipButton}
                  css={css`
                    width: 100%;
                  `}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default WelcomeTutorial;
