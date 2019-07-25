//@flow
import React from 'react';
import { Button, Dialog, TextField, FormHelperText } from '@material-ui/core';
import { Form, Field, FormSpy } from 'react-final-form';
import isEmptyString from '../../lib/isEmptyString';
import UploadFileDialog from '../../components/UploadFileDialog';
import Row from '../../components/Row';
import FeaturedImage from '../../components/FeaturedImage';
import type { FeaturedContent } from '../../types';
import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../../lib/fetch';

type Props = {
  i: number,
  button: any,
  featuredContentList: Array<any>,
  selectedLanguage: string,
  defaultReturned: boolean,
  handleSaveButtonClick: any,
  handleFileChosen: any,
  handleOnCancel: any,
  file: any,
  handleOnUpload: any
};
type State = {
  open: boolean
};
function handleValidate(values) {
  const errors = {};

  if (isEmptyString(values.title)) {
    errors.title = 'Required';
  }

  if (isEmptyString(values.description)) {
    errors.description = 'Required';
  }

  const regex = /http(s)?:\/\/.*/;
  if (isEmptyString(values.link) || !values.link.match(regex)) {
    errors.link = 'Must be a valid URL e.g "https://digitallibrary.io"';
  }

  if (isEmptyString(values.imageUrl) || !values.imageUrl.match(regex)) {
    errors.imageUrl =
      'Must be a valid URL image url e.g "https://images.digitallibrary.io/imageId.png';
  }

  return errors;
}

export default class FeaturedEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  }
  handleClose() {
    this.setState({
      open: false
    });
  }

  handleSaveButtonClick = (defaultReturned: boolean) => (
    content: FeaturedContent
  ) => {
    this.props.handleSaveButtonClick(defaultReturned, content);
    this.setState({ open: false });
  };
  render() {
    return (
      <>
        <div onClick={this.handleClickOpen.bind(this)}>{this.props.button}</div>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          fullWidth={true}
        >
          <div style={{ padding: 25 }}>
            <>
              <Form
                initialValues={
                  this.props.featuredContentList[this.props.i] || {}
                }
                onSubmit={this.handleSaveButtonClick(
                  this.props.defaultReturned
                )}
                validate={handleValidate}
                render={({ handleSubmit, pristine, invalid, form }) => (
                  <form>
                    <Field
                      name="title"
                      render={({ input, meta }) => (
                        <TextField
                          fullWidth
                          error={meta.error && meta.touched}
                          margin="normal"
                          disabled={this.props.selectedLanguage === ''}
                          label="Title"
                          {...input}
                        />
                      )}
                    />
                    <Field
                      name="description"
                      render={({ input, meta }) => (
                        <TextField
                          fullWidth
                          margin="normal"
                          error={meta.error && meta.touched}
                          disabled={this.props.selectedLanguage === ''}
                          label="Description"
                          {...input}
                          multiline
                        />
                      )}
                    />
                    <Field
                      name="link"
                      render={({ input, meta }) => (
                        <>
                          <TextField
                            fullWidth
                            type="url"
                            error={meta.error && meta.touched}
                            margin="normal"
                            disabled={this.props.selectedLanguage === ''}
                            label="Link"
                            {...input}
                          />
                          {meta.error && meta.touched && (
                            <FormHelperText error>{meta.error}</FormHelperText>
                          )}
                        </>
                      )}
                    />

                    <Row
                      alignItems="center"
                      gridTemplateColumns="auto min-content min-content"
                    >
                      <div>
                        <Field
                          name="imageUrl"
                          render={({ input, meta }) => (
                            <>
                              <TextField
                                fullWidth
                                margin="normal"
                                error={meta.error && meta.touched}
                                type="url"
                                disabled={this.props.selectedLanguage === ''}
                                label="Image Url"
                                {...input}
                              />
                              {meta.error && meta.touched && (
                                <FormHelperText error>
                                  {meta.error}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </div>

                      <span>or</span>

                      <input
                        disabled={this.props.selectedLanguage === ''}
                        type="file"
                        accept="image/*"
                        value=""
                        onChange={event => this.props.handleFileChosen(event)}
                      />

                      {this.props.file && (
                        <UploadFileDialog
                          language={this.props.selectedLanguage}
                          selectedFile={this.props.file}
                          objectURL={URL.createObjectURL(this.props.file)}
                          onCancel={this.props.handleOnCancel}
                          onUpload={url =>
                            this.props.handleOnUpload(url, form.change)
                          }
                        />
                      )}
                    </Row>

                    <FormSpy
                      // $FlowFixMe
                      render={({ values }) =>
                        // $FlowFixMe
                        values.imageUrl ? (
                          <FeaturedImage imageUrl={values.imageUrl} />
                        ) : null
                      }
                    />

                    <Button
                      color="primary"
                      disabled={invalid || pristine}
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Save changes
                    </Button>
                    <Button
                      color="secondary"
                      disabled={pristine}
                      onClick={form.reset}
                    >
                      Discard changes
                    </Button>
                  </form>
                )}
              />
            </>
          </div>
        </Dialog>
      </>
    );
  }
}
