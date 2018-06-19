// @flow
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';

import { hasClaim } from '../index';

// Create our own JWT for testing purposes. We add a single claim in the scope
const mockToken = jwt.sign(
  {
    scope: 'true-claim other-claim'
  },
  'test-secret',
  { expiresIn: '1h' }
);

// Setup cookie lib to return our mock tocken
jest.mock('universal-cookie');
Cookies.mockImplementation(() => ({ get: () => mockToken }));

test('Returns true for valid claim', () => {
  expect(hasClaim('true-claim')).toBeTruthy();
});

test('Returns false for invalid claim', () => {
  expect(hasClaim('false-claim')).toBeFalsy();
});
