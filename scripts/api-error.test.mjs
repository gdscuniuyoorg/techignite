import assert from 'node:assert/strict';
import { test } from 'node:test';
import { errorMessageFromData } from '../src/lib/api-error.ts';

test('reads the top-level message from a parsed error body', () => {
  assert.equal(
    errorMessageFromData({
      success: false,
      message: 'Email, password, firstName, lastName, and role are required',
    }),
    'Email, password, firstName, lastName, and role are required',
  );
});

test('reads a nested error.message envelope', () => {
  assert.equal(
    errorMessageFromData({ success: false, error: { message: 'Team is locked' } }),
    'Team is locked',
  );
});

test('reads an error string envelope', () => {
  assert.equal(errorMessageFromData({ error: 'Something failed' }), 'Something failed');
});

test('uses a plain-text error body', () => {
  assert.equal(errorMessageFromData('  Bad request  '), 'Bad request');
});

test('returns an empty string when the body has no usable message', () => {
  assert.equal(errorMessageFromData(undefined), '');
  assert.equal(errorMessageFromData({ success: false }), '');
  assert.equal(errorMessageFromData({ message: '   ' }), '');
});
