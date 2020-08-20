jest.mock('../weather-view', () => {
  // return function () {
  //   return { playSoundFile: () => { } };
  // };
});

import Controller from '../weather-controller';

const getSeason = Controller.getSeason;

test('should return winter if southern hemisphere', () => {
  expect(getSeason({ timeZone: 'Australia/Sydney', latitude: -35.28346 })).toMatch('winter');
});

test('should return summer if northern hemisphere', () => {
  expect(getSeason({ timeZone: 'Europe/Moscow', latitude: 59.938732 })).toMatch('summer');
});

test('should return summer by default if no coords passed', () => {
  expect(getSeason({ timeZone: 'Europe/Moscow' })).toMatch('summer');
});

test('should return summer by default if timeZone passed as empty string', () => {
  expect(getSeason({ timeZone: '' })).toMatch('summer');
});