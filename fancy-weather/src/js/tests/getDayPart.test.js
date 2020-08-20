jest.mock('../weather-view', () => {
});

import Controller from '../weather-controller';
const getDayPart = Controller.getDayPart;

const RealDate = Date;

function mockDate(isoDate) {
  global.Date = class extends RealDate {
    constructor() {
      return new RealDate(isoDate)
    }
  }
}

afterEach(() => {
  global.Date = RealDate
})

test('should define night time', () => {
  mockDate('2017-06-13T04:41:20')
  expect(getDayPart({ name: 'Australia/Sydney' })).toMatch('night');
});

test('should define morning time', () => {
  mockDate('2017-06-13T07:41:20')
  expect(getDayPart({ name: 'Australia/Sydney' })).toMatch('morning');
});

test('should define day time', () => {
  mockDate('2017-06-13T15:41:20')
  expect(getDayPart({ name: 'Australia/Sydney' })).toMatch('day');
});

test('should define evening time', () => {
  mockDate('2017-11-25T19:34:56z')
  expect(getDayPart({ name: 'Australia/Sydney' })).toMatch('evening');
});

