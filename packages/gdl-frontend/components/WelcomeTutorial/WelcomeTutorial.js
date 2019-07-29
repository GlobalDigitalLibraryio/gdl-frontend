//@flow
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  MobileStepper,
  Slide,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import { Help as HelpIcon } from '@material-ui/icons';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import GetDialogContent from './DialogContent';
import { TABLET_BREAKPOINT } from '../../style/theme/misc';

const grace1 = '/static/img/grace1.png';
const grace2 = '/static/img/grace2.png';
const grace3 = '/static/img/grace3.png';
const selectLanguage = '/static/img/selectLanguage.png';
const saveOffline = '/static/img/saveOffline.png';
const menu = '/static/img/menu.png';
const saveOfflineM = '/static/img/saveOfflineM.png'; //for mobile
const menuM = '/static/img/menuM.png'; //for mobile

type State = {
  open: boolean,
  width: number,
  height: number,
  activeStep: number,
  direction: 'left' | 'right',
  left: number,
  originalOffset: number,
  velocity: number,
  timeOfLastDragEvent: number,
  touchStartX: number,
  prevTouchX: number,
  beingTouched: boolean,
  intervalId: string | null
};
type Props = {
  shouldOpen: boolean,
  listButton: boolean,
  swipeable: ?any
};
type TargetTouches = {
  clientX: number
};
type touchMoveEventType = {
  targetTouches: TargetTouches
};
type touchStartEventType = {
  targetTouches: Array<TargetTouches>
};

const styles = {
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
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    width: '100%'
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
      open: false
    });
    if (this.props.swipeable) {
      this.props.swipeable();
    }
  }

  handleNext = () => {
    this.state.activeStep === 2
      ? this.handleClose()
      : this.setState({
          activeStep: this.state.activeStep + 1,
          direction: 'left'
        });
  };

  handleMove(touchMoveEvent: touchMoveEventType, mobile: boolean) {
    const clientX = touchMoveEvent.targetTouches[0].clientX;
    if (this.state.beingTouched && mobile) {
      const currTime = Date.now();
      const elapsed = currTime - this.state.timeOfLastDragEvent;
      const velocity = (20 * (clientX - this.state.prevTouchX)) / elapsed;
      let deltaX = clientX - this.state.touchStartX + this.state.originalOffset;
      if (deltaX < -200) {
        this.handleNext();
        deltaX = 0;
        this.setState({ beingTouched: false });
      } else if (deltaX > 200) {
        if (this.state.activeStep > 0) this.handleBack();
        deltaX = 0;
        this.setState({ beingTouched: false });
      }
      this.setState({
        left: deltaX,
        velocity,
        timeOfLastDragEvent: currTime,
        prevTouchX: clientX
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

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
      activeStep: 0
    });
  };

  handleBack = () => {
    if (this.state.activeStep !== 0) {
      this.setState({
        direction: 'right',
        activeStep: this.state.activeStep - 1
      });
    }
  };
  getListButton() {
    if (this.props.listButton) {
      return (
        <ListItem
          button
          component="a"
          data-cy="global-menu-favorite-button"
          onClick={this.handleClickOpen}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText>tutorial</ListItemText>
        </ListItem>
      );
    }
  }

  render() {
    const isTablet: boolean = this.state.width < TABLET_BREAKPOINT;
    return (
      <>
        {this.getListButton()}

        <Dialog fullScreen={isTablet} open={this.state.open}>
          <div
            style={styles.dialogWindow}
            onTouchStart={touchStartEvent =>
              this.handleTouchStart(touchStartEvent, isTablet)
            }
            onTouchMove={touchMoveEvent =>
              this.handleMove(touchMoveEvent, isTablet)
            }
            onTouchEnd={() => {
              this.handleTouchEnd(isTablet);
            }}
          >
            <Slide
              style={{ height: '100%' }}
              direction={this.state.direction}
              in={this.state.activeStep === 0}
            >
              <div
                style={{
                  display: this.state.activeStep === 0 ? 'flex' : 'none',
                  left: this.state.left,
                  position: 'relative'
                }}
              >
                <GetDialogContent
                  screenshotUrlM={selectLanguage}
                  screenshotUrl={selectLanguage}
                  graceImgUrl={grace1}
                  message="Hi! If you want to change the language, click on the globe at the top-right corner of the screen!"
                  fullscreen={isTablet}
                />
              </div>
            </Slide>
            <Slide
              style={{ height: '100%' }}
              direction={this.state.direction}
              in={this.state.activeStep === 1}
            >
              <div
                style={{
                  display: this.state.activeStep === 1 ? 'flex' : 'none',
                  left: this.state.left,
                  position: 'relative'
                }}
              >
                <GetDialogContent
                  screenshotUrlM={menuM}
                  screenshotUrl={menu}
                  graceImgUrl={grace3}
                  message="The menu is in the top-left corner. From the menu you can access Categories, Favorites and more."
                  fullscreen={isTablet}
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
                  display: this.state.activeStep === 2 ? 'flex' : 'none',
                  left: this.state.left,
                  position: 'relative'
                }}
              >
                <GetDialogContent
                  screenshotUrlM={saveOfflineM}
                  screenshotUrl={saveOffline}
                  graceImgUrl={grace2}
                  message="You can save books for later and read them offline by clicking the Save offline icon!!."
                  fullscreen={isTablet}
                />
              </div>
            </Slide>
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
                    onClick={this.handleNext}
                    autoFocus
                    style={styles.nextButton}
                  >
                    {this.state.activeStep === 2 ? 'Finish' : 'Next'}
                  </Button>
                }
                backButton={
                  <Button
                    size="large"
                    onClick={this.handleBack}
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
                padding: '0px 16px 16px 16px'
              }}
            >
              <Button
                size="small"
                onClick={this.handleClose.bind(this)}
                color="primary"
                style={styles.skipButton}
              >
                Skip
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}

export default WelcomeTutorial;
