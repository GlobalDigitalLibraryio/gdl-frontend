// @flow

export default function isEmptyString(str: ?string) {
  return str == null || str.trim() === '';
}
