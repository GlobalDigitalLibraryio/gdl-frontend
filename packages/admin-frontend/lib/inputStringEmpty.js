// @flow

export function inputStringEmpty(inputString: ?string) {
  return (
    inputString === undefined ||
    inputString === null ||
    inputString.trim() === ''
  );
}
