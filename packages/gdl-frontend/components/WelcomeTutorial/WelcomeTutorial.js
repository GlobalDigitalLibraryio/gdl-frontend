//@flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MobileStepper from '@material-ui/core/MobileStepper';
import Slide from '@material-ui/core/Slide';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import GetDialogContent from './DialogContent';

const grace1 = '/static/img/grace1.png';
const grace2 = '/static/img/grace2.png';
const grace3 = '/static/img/grace3.png';
const selectLanguage = '/static/img/selectLanguage.png';
const saveOffline = '/static/img/saveOffline.png';
const menu = '/static/img/menu.png';
const saveOfflineM = '/static/img/saveOfflineM.png';
const menuM = '/static/img/menuM.png';

const fullscreenWidth = 768;

type State = {
  open: boolean,
  width: number,
  activeStep: number,
  direction: 'left' | 'right',
  isHidden1: string,
  isHidden2: string,
  isHidden3: string,
  left: number,
  originalOffset: number,
  velocity: number,
  timeOfLastDragEvent: number,
  touchStartX: number,
  prevTouchX: number,
  beingTouched: boolean,
  height: number,
  intervalId: string | null
};
type Props = {
  shouldOpen: boolean
};
type touchMoveEventType = {
  targetTouches: {
    clientX: number
  }
};
type TargetTouchesArray = {
  clientX: number
};
type touchStartEventType = {
  targetTouches: Array<TargetTouchesArray>
};

const Styles = {
  dialogWindow: {
    backgroundColor: '#2B8DC8',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden'
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
      isHidden3: 'none',
      left: 0,
      originalOffset: 0,
      velocity: 0,
      timeOfLastDragEvent: 0,
      touchStartX: 0,
      prevTouchX: 0,
      beingTouched: false,
      intervalId: null
    };
  }

  handleTouchStart(touchStartEvent: touchStartEventType, mobile: boolean) {
    if (this.state.intervalId !== null && mobile) {
      window.clearInterval(this.state.intervalId);
    }
    this.setState({
      originalOffset: this.state.left,
      velocity: 0,
      timeOfLastDragEvent: Date.now(),
      touchStartX: touchStartEvent.targetTouches[0].clientX,
      beingTouched: true,
      intervalId: null
    });
  }

  animateSlidingToZero() {
    let { left, velocity, beingTouched } = this.state;

    if (!beingTouched) {
      left = 0;
      velocity = 0;
      window.clearInterval(this.state.intervalId);
      this.setState({ left, velocity, intervalId: null, originalOffset: 0 });
    }
  }
  handleClose() {
    this.setState({
      open: false,
      isHidden1: 'flex',
      isHidden2: 'none'
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
  handleMove(clientX: number) {
    if (this.state.beingTouched) {
      const touchX = clientX;
      const currTime = Date.now();
      const elapsed = currTime - this.state.timeOfLastDragEvent;
      const velocity = (20 * (touchX - this.state.prevTouchX)) / elapsed;
      let deltaX = touchX - this.state.touchStartX + this.state.originalOffset;
      if (deltaX < -300) {
        this.handleNext();
        deltaX = 0;
        this.setState({ beingTouched: false });
      } else if (deltaX > 300) {
        if (this.state.activeStep > 0) {
          this.handleBack();
          deltaX = 0;
          this.setState({ beingTouched: false });
        }
      }
      this.setState({
        left: deltaX,
        velocity,
        timeOfLastDragEvent: currTime,
        prevTouchX: touchX
      });
    }
  }
  handleTouchEnd(mobile: boolean) {
    if (mobile) {
      this.setState({
        velocity: this.state.velocity,
        touchStartX: 0,
        beingTouched: false,
        intervalId: window.setInterval(this.animateSlidingToZero.bind(this), 33)
      });
    }
  }

  handleTouchMove(touchMoveEvent: touchMoveEventType, mobile: boolean) {
    if (mobile) this.handleMove(touchMoveEvent.targetTouches[0].clientX);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
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
    let mobile: boolean = this.state.width < fullscreenWidth;
    return (
      <Dialog
        fullScreen={mobile}
        open={this.state.open}
        onClose={this.handleClose.bind(this)}
      >
        <div
          style={Styles.dialogWindow}
          onTouchStart={touchStartEvent =>
            this.handleTouchStart(touchStartEvent, mobile)
          }
          onTouchMove={touchMoveEvent =>
            this.handleTouchMove(touchMoveEvent, mobile)
          }
          onTouchEnd={() => {
            this.handleTouchEnd(mobile);
          }}
        >
          <Slide
            style={{ height: '100%' }}
            direction={this.state.direction}
            in={this.state.activeStep === 0}
          >
            <div
              style={{
                display: this.state.isHidden1,
                left: this.state.left + 'px',
                position: 'relative'
              }}
            >
              <div>
                <GetDialogContent
                  screenshotUrlM={selectLanguage}
                  screenshotUrl={selectLanguage}
                  graceImgUrl={grace1}
                  message="Hi! If you want to change the language, click on the globe at the top-right corner of the screen!"
                  fullscreen={mobile}
                />
              </div>
            </div>
          </Slide>
          <Slide
            style={{ height: '100%' }}
            direction={this.state.direction}
            in={this.state.activeStep === 1}
          >
            <div
              style={{
                display: this.state.isHidden2,
                left: this.state.left + 'px',
                position: 'relative'
              }}
            >
              <GetDialogContent
                screenshotUrlM={saveOfflineM}
                screenshotUrl={saveOffline}
                graceImgUrl={grace2}
                message="You can save books for later and read them offline by clicking the Save offline icon!!."
                fullscreen={mobile}
              />
            </div>
          </Slide>
          <Slide
            style={{ height: '100%' }}
            direction={this.state.direction}
            in={this.state.activeStep === 2}
          >
            <div
              style={{
                display: this.state.isHidden3,
                left: this.state.left + 'px',
                position: 'relative'
              }}
            >
              <GetDialogContent
                screenshotUrlM={menuM}
                screenshotUrl={menu}
                graceImgUrl={grace3}
                message="The menu is in the top-left corner. From the menu you can access Categories, Favorites and more."
                fullscreen={mobile}
              />
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
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.16)'
                    }}
                    css={css`
                      color: white;
                    `}
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
    );
  }
}

export default WelcomeTutorial;
