import Service from '../service';

describe('Service - getMoviesList', () => {
  it('success response', (done) => {
    const mockMovie = [{
      Title: 'The Terminator: Closer to the Real Thing',
      Year: '2005',
      imdbID: 'tt5473104',
      Type: 'movie',
      Poster: 'N/A',
    }];
    const mockResponse = {
      status: 200,
      json: () => mockMovie,
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Service.getMoviesList().then((res) => {
      expect(res).toEqual(mockMovie);
      done();
    });
  });

  it('failed response 401', (done) => {
    const mockResponse = {
      status: 401,
      statusText: 'some text',
    };

    global.fetch = () => Promise.resolve(mockResponse);

    Service.getMoviesList().catch((err) => {
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

    Service.getMoviesList().catch((err) => {
      expect(err.message).toBe('Server error: 400 some text');
      done();
    });
  });
});
