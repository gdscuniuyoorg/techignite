import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hasEmailBody } from '../src/lib/email-body.ts';

test('accepts a body with visible text', () => {
  assert.equal(hasEmailBody('<p>Hello</p>', 'Hello'), true);
});

test('accepts an image-only body with no extracted text', () => {
  assert.equal(hasEmailBody('<p><img src="https://example.com/a.png" alt=""></p>', ''), true);
});

test('accepts other non-text media', () => {
  assert.equal(hasEmailBody('<hr>', ''), true);
  assert.equal(hasEmailBody('<table><tr><td>x</td></tr></table>', ''), true);
});

test('rejects an empty or whitespace-only body', () => {
  assert.equal(hasEmailBody('<p></p>', ''), false);
  assert.equal(hasEmailBody('<p>   </p>', '   '), false);
  assert.equal(hasEmailBody('', ''), false);
});
