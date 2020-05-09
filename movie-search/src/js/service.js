const API_KEY = {
  movies: '2719f3d8',
  translator: 'trnsl.1.1.20200504T094843Z.9786178e4c3e0c28.a33f80505acefaca289145fdda21477f083571ff',
};

const SERVER_URL = {
  movies: 'https://www.omdbapi.com/',
  translator: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
};

const DEFAULT_POSTER_SRC = '../assets/img/default-poster.png';

export default class Service {

  static translate(movieTitle) {
    const url = `${SERVER_URL.translator}?key=${API_KEY.translator}&text=${movieTitle}&lang=ru-en`;

    return fetch(url)
      .then((response) => response.json())
      .then((response) => response.text[0]);
  }

  static getMoviesList(movieTitle, page) {
    const url = `${SERVER_URL.movies}?apikey=${API_KEY.movies}&s=${movieTitle}&type=movie&page=${page}`;

    return fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        if (response.status == 401) {
          throw new Error('Status 401. Try another API key');
        }
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      });
  }

  static getMovieRating(movieData) {
    const url = `${SERVER_URL.movies}?apikey=${API_KEY.movies}&i=${movieData.id}`;

    return new Promise((onLoad, onError) => {
      fetch(url).
        then((movieResponse) => {
          if (movieResponse.status >= 200 && movieResponse.status < 300) {
            return movieResponse.json();
          }
          throw new Error(`rating loading error: ${response.status} ${response.statusText}`);
        }).
        then((movieResponse) => {
          movieData.rating = movieResponse.imdbRating;
          onLoad(movieData);
        }).
        catch((err) => console.log(`Rating loading Error: ${err}`));
    });
  }

  static getImagePromise(movieData) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const src = movieData.posterSrc;
      movieData.posterSrc = image;
      movieData.posterSrc.onload = () => resolve(movieData);
      movieData.posterSrc.onerror = () => reject(movieData);
      movieData.posterSrc.src = src;
    }).
      catch((movieData) => {
        movieData.posterSrc.src = DEFAULT_POSTER_SRC;
        console.warn('постер отсутствует');
        return movieData;
      })
  }
}