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

        if (response.status === 401) {
          throw new Error('Status 401. Try another API key');
        }

        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      });
  }

  static getMovieRating(data) {
    const movieData = data;
    const url = `${SERVER_URL.movies}?apikey=${API_KEY.movies}&i=${movieData.id}&plot='full'`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((movieResponse) => {
          if (movieResponse.status >= 200 && movieResponse.status < 300) {
            return movieResponse.json();
          }

          throw new Error(`rating loading error: ${movieResponse.status} ${movieResponse.statusText}`);
        })
        .then((movieResponse) => {
          if (movieResponse.Error) {
            movieData.rating = 0;
            throw new Error('no detailed data');
          } else {
            movieData.rating = movieResponse.imdbRating;
            resolve({ movieData, movieResponse });
          }
        })
        .catch((err) => {
          resolve({ movieData, movieResponse: {} });
        });
    });
  }

  static getImagePromise(data) {
    const movieData = data;

    return new Promise((resolve, reject) => {
      const image = new Image();
      let src = movieData.posterSrc;

      if (src === 'N/A') {
        src = DEFAULT_POSTER_SRC;
      }

      movieData.posterSrc = image;
      movieData.posterSrc.onload = () => resolve(movieData);
      movieData.posterSrc.onerror = () => reject(movieData);
      movieData.posterSrc.src = src;
    })
      .catch((errorData) => {
        const withoutPosterData = errorData;

        withoutPosterData.posterSrc.src = DEFAULT_POSTER_SRC;
        return withoutPosterData;
      });
  }
}
