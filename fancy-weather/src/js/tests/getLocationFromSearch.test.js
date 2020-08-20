import Loader from '../loader';

describe('getting location', () => {
  it('success response', (done) => {
    const mockLocation = {
      results: [
        {
          "components": {
            "ISO_3166-1_alpha-2": "RU",
            "ISO_3166-1_alpha-3": "RUS",
            "_category": "place",
            "_type": "city",
            "city": "Санкт-Петербург",
            "continent": "Europe",
            "country": "Россия",
            "country_code": "ru",
            "postcode": "190000",
            "state": "Санкт-Петербург",
            "state_district": "Центральный район"
          },
          "confidence": 3,
          "formatted": "Санкт-Петербург, Центральный район, Россия",
          "geometry": {
            "lat": 59.938732,
            "lng": 30.316229
          }
        }
      ]
    }


    const mockResponse = {
      status: 200,
      json: () => mockLocation,
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getLocationFromSearch('saint-petersburg').then((res) => {
      expect(res).toEqual(mockLocation.results[0]);
      done();
    });
  });

  it('failed response 401', (done) => {
    const mockResponse = {
      status: 401,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Loader.getLocationFromSearch('saint-petersburg').catch((err) => {
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

    Loader.getLocationFromSearch('saint-petersburg').catch((err) => {
      expect(err.message).toBe('Server error: 400 some text');
      done();
    });
  });
});