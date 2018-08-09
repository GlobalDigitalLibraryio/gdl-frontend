// @flow

export function inputFieldEmpty(inputString: ?string) {
  return (
    inputString === undefined ||
    inputString === null ||
    inputString.trim() === ''
  );
}
