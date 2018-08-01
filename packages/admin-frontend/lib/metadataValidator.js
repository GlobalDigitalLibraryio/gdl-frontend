export function handleValidate(values) {
    console.log(values)
  const errors = {};

  if (values.title.title === undefined || values.title.trim() === '') {
    errors.title = 'You have to enter a title';
  }

  if (values.alttext === undefined || values.alttext.trim() === '') {
    errors.alttext = 'You have to enter a alttext';
  }

  if (values.origin === undefined || values.origin.trim() === '') {
    errors.origin = 'You have to specify origin';
  }

  if (values.license === undefined || values.license === '') {
    errors.license = 'You have to choose a license';
  }

  if (values.caption === undefined || values.caption.trim() === '') {
    errors.caption = 'You have to specify a caption';
  }

  return errors;
}
