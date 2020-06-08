import Loader from '../loader';

describe('getting location from ip', () => {
  it('success response', (done) => {
    const mockLocation = [{
      currency: {
        name: 'US Dollar',
        code: 'USD',
        symbol: '$',
      },
      time_zone: {
        name: 'America / New_York',
        offset: '-4',
        current_time: '2020 - 06 - 08 00: 13: 48.858-0400',
        current_time_unix: '1591589628.858',
        is_dst: 'Yes',
        dst_savings: 1,
      }
    }];

    const mockResponse = {
      status: 200,
      json: () => mockLocation,
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getLocationFromIP({ latitude: 10.00, longitude: 10.00 }).then((res) => {
      expect(res).toEqual(mockLocation);
      done();
    });
  });

  it('failed response 401', (done) => {
    const mockResponse = {
      status: 401,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getLocationFromIP({ latitude: 10.00, longitude: 10.00 }).catch((err) => {
      expect(err.message).toBe('Status 401. Try another API key');
      done();
    });
  });

  it('other failed response', (done) => {
    const mockResponse = {
      status: 400,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getLocationFromIP({ latitude: 10.00, longitude: 10.00 }).catch((err) => {
      expect(err.message).toBe('Server error: 400 some text');
      done();
    });
  });
});