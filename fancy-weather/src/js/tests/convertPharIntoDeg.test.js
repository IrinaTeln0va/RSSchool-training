jest.mock('../map', () => {
});

jest.mock('../speech', () => {
});

import View from '../weather-view';
const convertPharIntoDeg = View.convertPharIntoDeg;

test('should return string', () => {
  expect(convertPharIntoDeg(22)).toEqual(expect.any(String));
});

test('should convert positive numbers', () => {
  expect(convertPharIntoDeg(50)).toEqual('10');
});

test('should convert negative numbers', () => {
  expect(convertPharIntoDeg(-5)).toEqual('-21');
});
