import MySwiper from './my-swiper.js';

const API_KEY = {
  movies: '2719f3d8',
  translator: 'trnsl.1.1.20200504T094843Z.9786178e4c3e0c28.a33f80505acefaca289145fdda21477f083571ff',
};

const SERVER_URL = {
  movies: 'http://www.omdbapi.com/',
  translator: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
};

const searchState = {
  shownMoviesAmount: 0,
}

const DEFAULT_SEARCH = 'kill bill';
const DEFAULT_PAGE = 1;
const DEFAULT_POSTER_SRC = '../assets/img/pattern.png';
let lastSearch = null;

const MULTI_LANG_REG_EXP = /(^[А-я0-9\s]+)(?!.*[A-z])$|(^[A-z0-9\s]+)(?!.*[А-я])$/g;
const CONTAIN_RUS_REG_EXP = /[А-я]+/g;

const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('.search-input');

searchForm.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  const movieToSearch = searchInput.value && searchInput.value.length ? searchInput.value : null;
  getMovieData({ movieToSearch: movieToSearch }).
    then((moviesData) => {
      removeSwiper();
      new MySwiper(moviesData);
    });
}

function removeSwiper() {
  const previousSearchSlider = document.querySelector('.swiper-container').swiper;
  previousSearchSlider.removeAllSlides();
  searchState.shownMoviesAmount = 0;
  previousSearchSlider.destroy();
}

function getMovieData({ movieToSearch = lastSearch || DEFAULT_SEARCH, page = DEFAULT_PAGE}) {
  let isSearchTranslated = false;
  let totalResults = 0;

  function getMovieUrl(movie) {
    return `${SERVER_URL.movies}?apikey=${API_KEY.movies}&s=${movie}&type=movie&page=${page}`;
  }

  const translatorUrl = `${SERVER_URL.translator}?key=${API_KEY.translator}&text=${movieToSearch}&lang=ru-en`;

  function checkSearchLang(movieToSearch) {
    const isMultiLangSearch = MULTI_LANG_REG_EXP.test(movieToSearch);
    MULTI_LANG_REG_EXP.lastIndex = 0;

    if (!isMultiLangSearch) {
      console.log('error: multi lang');
    } else {
      const isRusLangSearch = CONTAIN_RUS_REG_EXP.test(movieToSearch);
      CONTAIN_RUS_REG_EXP.lastIndex = 0;

      if (isRusLangSearch) {
        isSearchTranslated = true;
        return 'ru';
      } else {
        isSearchTranslated = false;
        return 'eng';
      }
    }
  }

  const translateIfNecessary = function (movieToSearch) {
    const searchLang = checkSearchLang(movieToSearch);
    if (searchLang === 'ru') {
      return fetch(translatorUrl).
        then((response) => response.json()).
        then((response) => response.text[0]);
    } else if (searchLang === 'eng') {
      return new Promise(onLoad => onLoad(movieToSearch));
    }
  }

  const whenMovieDataLoad = function (movie) {
    lastSearch = movie;
    return fetch(getMovieUrl(movie)).
      then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        throw new Error(`server error: ${response.status} ${response.statusText}`);
      });
  }

  function addMovieRating(cardData) {
    const ratingUrl = `${SERVER_URL.movies}?apikey=${API_KEY.movies}&i=${cardData.id}`;
    return new Promise((onLoad, onError) => {
      fetch(ratingUrl).
        then((movieResponse) => {
          if (movieResponse.status >= 200 && movieResponse.status < 300) {
            return movieResponse.json();
          }
          throw new Error(`rating loading error: ${response.status} ${response.statusText}`);
        }).
        then((movieResponse) => {
          cardData.rating = movieResponse.imdbRating;
          onLoad(cardData);
        }).
        catch((err) => console.log(`Rating loading Error: ${err}`));
    });
  }

  function getImagePromises(cardData) {
    return new Promise((onLoad, onError) => {
      const image = new Image();
      const src = cardData.posterSrc;
      cardData.posterSrc = image;
      cardData.posterSrc.onload = () => onLoad(cardData);
      cardData.posterSrc.onerror = () => onError(cardData);
      cardData.posterSrc.src = src;
    }).
    catch((cardData) => {
      cardData.posterSrc.src = DEFAULT_POSTER_SRC;
      console.warn('постер отсутствует');
      return cardData;
    })
  }

  function convertData(sourceDataItem) {
    return {
      title: sourceDataItem.Title,
      posterSrc: sourceDataItem.Poster,
      year: sourceDataItem.Year,
      id: sourceDataItem.imdbID,
    }
  }

  return translateIfNecessary(movieToSearch).
    then((searchValue) => whenMovieDataLoad(searchValue)).
    then((data) => {
      searchState.shownMoviesAmount += data.Search.length;
      console.log(data)
      if (data.Error) {
        console.log(`ошибка при запросе: ${data.Error}`);
        throw new Error(data.Error);
      } else {
        totalResults = data.totalResults;
      }
      return data.Search.map((item) => {
        const convertedData = convertData(item);
        return getImagePromises(convertedData);
      })
    }).
    then((cardPromises) => Promise.all(cardPromises)).
    then((data) => data.map(addMovieRating)).
    then((cardPromises) => Promise.all(cardPromises)).
    then((data) => ({ data: data, totalResults: totalResults })).
    catch((err) => console.error(`final error in the chain: ${err}`));
}


export { getMovieData, searchState };