import Loader from '../loader';

describe('getting weather', () => {
  it('success response', (done) => {
    const mockWeather = [{
      current: {
        clouds: 90,
        dew_point: 12.78,
        dt: 1591587521,
        feels_like: 17.35,
        humidity: 72,
        pressure: 1012,
        sunrise: 1591576796,
        sunset: 1591643749,
        temp: 17.89,
        uvi: 5.64,
        visibility: 10000,
      }
    }];

    const mockResponse = {
      status: 200,
      json: () => mockWeather,
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getWeather({latitude: 10.00, longitude: 10.00}).then((res) => {
      expect(res).toEqual(mockWeather);
      done();
    });
  });

  it('failed response 401', (done) => {
    const mockResponse = {
      status: 401,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getWeather({ latitude: 10.00, longitude: 10.00 }).catch((err) => {
      expect(err.message).toBe('Error: Status 401. Try another API key');
      done();
    });
  });

  it('other failed response', (done) => {
    const mockResponse = {
      status: 400,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getWeather({ latitude: 10.00, longitude: 10.00 }).catch((err) => {
      expect(err.message).toBe('Error: Server error: 400 some text');
      done();
    });
  });
});