import * as React from 'react';
import { Button, Typography } from '@material-ui/core';
import Container from '../../components/Container';
import { loginSocialMedia } from 'gdl-auth';

const googleColor = '#db3236';
const facebookColor = '#3b5998';

export default class SignIn extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Typography
          align="center"
          variant="headline"
          component="h1"
          gutterBottom
        >
          Sign in to continue
        </Typography>

        <Button
          variant="outlined"
          onClick={() => loginSocialMedia('google-oauth2')}
          css={{ color: googleColor }}
        >
          Sign in using Google
        </Button>

        <Button
          variant="outlined"
          onClick={() => loginSocialMedia('facebook')}
          css={{ color: facebookColor }}
        >
          Sign in using Facebook
        </Button>

        <Typography align="center" paragraph>
          By signing in to this service I am hereby accepting the principles in
          the GDL privacy policy , and I am giving my consent to GDL’s use of my
          personal information.
        </Typography>
      </Container>
    );
  }
}
