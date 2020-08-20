jest.mock('../map', () => {
});

jest.mock('../speech', () => {
});

import View from '../weather-view';
const convertDegIntoPhar = View.convertDegIntoPhar;

test('should return string', () => {
  expect(convertDegIntoPhar(22)).toEqual(expect.any(String));
});

test('should convert positive numbers', () => {
  expect(convertDegIntoPhar(-5)).toEqual('23');
});

test('should convert negative numbers', () => {
  expect(convertDegIntoPhar(5)).toEqual('41');
});