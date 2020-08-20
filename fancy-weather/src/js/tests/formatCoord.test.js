jest.mock('../map', () => {
});

jest.mock('../speech', () => {
});

import View from '../weather-view';
const formatCoord = View.formatCoord;

test('should format degrees', () => {
  expect(formatCoord('59.94')).toMatch(/°/);
});

test('should format minutes', () => {
  expect(formatCoord('59.94')).toMatch('\'');
});

test('should format string', () => {
  expect(formatCoord('59.94')).toEqual('59°94\'');
});
