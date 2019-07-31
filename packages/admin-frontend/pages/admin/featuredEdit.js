//@flow
import React from 'react';
import { Button, Dialog, TextField, FormHelperText } from '@material-ui/core';
import { Form, Field, FormSpy } from 'react-final-form';
import isEmptyString from '../../lib/isEmptyString';
import UploadFileDialog from '../../components/UploadFileDialog';
import Row from '../../components/Row';
import FeaturedImage from '../../components/FeaturedImage';
import type { FeaturedContent } from '../../types';

type Props = {
  i: number,
  button: any,
  featuredContentList: Array<FeaturedContent>,
  selectedLanguage: string,
  defaultReturned: boolean,
  handleSaveButtonClick: (boolean, FeaturedContent) => void,
  handleFileChosen: (SyntheticInputEvent<EventTarget>) => void,
  handleOnCancel: () => void,
  file: ?File,
  handleOnUpload: (string, (string, any) => void) => void
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

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };
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
    const {
      button,
      featuredContentList,
      selectedLanguage,
      i,
      defaultReturned,
      file
    } = this.props;
    return (
      <>
        <div onClick={this.handleClickOpen}>{button}</div>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          fullWidth={true}
        >
          <div style={{ padding: 25 }}>
            <>
              <Form
                initialValues={featuredContentList[i] || {}}
                onSubmit={this.handleSaveButtonClick(defaultReturned)}
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
                          disabled={selectedLanguage === ''}
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
                          disabled={selectedLanguage === ''}
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
                            disabled={selectedLanguage === ''}
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
                                disabled={selectedLanguage === ''}
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
                        disabled={selectedLanguage === ''}
                        type="file"
                        accept="image/*"
                        value=""
                        onChange={event => this.props.handleFileChosen(event)}
                      />

                      {file && (
                        <UploadFileDialog
                          language={selectedLanguage}
                          selectedFile={file}
                          objectURL={URL.createObjectURL(file)}
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
                      {featuredContentList.length > i ? 'Save changes' : 'Save'}
                    </Button>
                    <Button
                      color="secondary"
                      disabled={pristine}
                      onClick={form.reset}
                    >
                      {featuredContentList.length > i
                        ? 'Discard changes'
                        : 'Discard'}
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
