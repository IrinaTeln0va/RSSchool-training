import WeatherData from '../weather-data';
const getAverageTemp = WeatherData.getAverageTemp;

test('should return parameter if parameters equal', () => {
  expect(getAverageTemp({ temp: { min: 10, max: 10 } })).toEqual('10');
});

test('should evaluate average', () => {
  expect(getAverageTemp({ temp: { min: 10, max: 20 } })).toEqual('15');
});

test('should evaluate correctly if negative values passed', () => {
  expect(getAverageTemp({ temp: { min: 10, max: 20 } })).toEqual('15');
});