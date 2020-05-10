import Service from './service.js';
import renderKeyboard from './keyboard.js';

renderKeyboard();

const DEFAULT_SEARCH = 'terminator';
const DEFAULT_PAGE = 1;
const buffer = 10;

// const MULTI_LANG_REG_EXP = /(^[А-я0-9\s]+)(?!.*[A-z])$|(^[A-z0-9\s]+)(?!.*[А-я])$/g;
const CONTAIN_RUS_REG_EXP = /[А-я]+/g;

const formElement = document.querySelector('.search-form');
const searchElement = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const keyboardBtn = document.querySelector('.keyboard-btn');
const clearSearchBtn = document.querySelector('.clear-search-btn');
const errorElement = document.querySelector('.error-message');
const spinnerElement = document.querySelector('#floatingBarsG');
const keyboardElement = document.querySelector('.keyboard');

export default class Search {
  constructor() {
    this.state = {
      shownMoviesAmount: 0,
      currentPage: DEFAULT_PAGE,
      isRequestPending: false,
      isSearchTranslated: false,
      searchTranslate: null,
    };
    this.currentSearch = DEFAULT_SEARCH;
    this.totalResults = 0;
    this.extraInfoMovieList = [];
    this.bind();
  }

  bind() {
    formElement.addEventListener('submit', this.onSearchFormSubmit.bind(this));
    keyboardElement.querySelector('.enter-key').addEventListener('click', this.onSearchFormSubmit.bind(this));
    clearSearchBtn.addEventListener('click', () => {
      searchElement.value = '';
      searchElement.focus();
    });
    searchElement.addEventListener('blur', () => {
      if (searchElement.value && searchElement.value.length > 0) {
        searchElement.classList.add('filled');
      } else {
        searchElement.classList.remove('filled');
      }
    });
    keyboardBtn.addEventListener('click', () => {
      if (keyboardElement.classList.contains('active')) {
        keyboardElement.classList.remove('active');
        return;
      }
      this.showKeyboard();
    });
  }
  
  onSearchFormSubmit(evt) {
    evt.preventDefault();
    const movieToSearch = searchElement.value && searchElement.value.length ? searchElement.value : null;
    if (!movieToSearch) {
      this.showErrorMessage(`Please enter your query in the search input`);
      searchElement.focus();
      return;
    };
    this.currentSearch = movieToSearch;
    this.resetSearchState();
    this.showSpinner();
    this.getMoviesData(movieToSearch)
      .then((moviesData) => {
        this.onUserSearch(moviesData);
      })
      .catch((err) => {
        this.hideSpinner();
        this.showErrorMessage(err);
      })
  }

  showSpinner() {
    searchBtn.classList.add('hide');
    spinnerElement.classList.add('active');
  }

  hideSpinner() {
    spinnerElement.classList.remove('active');
    searchBtn.classList.remove('hide');
  }

  resetSearchState() {
    this.state.currentPage = DEFAULT_PAGE;
    this.totalResults = 0;
    this.state.shownMoviesAmount = 0;
  }

  onUserSearch(moviesData) {
  }

  showErrorMessage(error) {
    errorElement.querySelector('.error-text').innerText = `${error}`;
    errorElement.classList.add('active');
    document.body.addEventListener('mouseup', function hideMessage(evt) {
      if (evt.target.closest('.error-message') && !evt.target.closest('.error-btn')) {
        return;
      }
      errorElement.classList.remove('active');
      document.body.removeEventListener('mouseup', hideMessage);
      if (!evt.target.closest('.swiper-container') && !evt.target.closest('.list-container')) {
        searchElement.focus();
      }
    });

    searchElement.addEventListener('input', function hideErrorOnInput() {
      errorElement.classList.remove('active');
      searchElement.removeEventListener('input', hideErrorOnInput);
    });
    searchElement.focus();
  }

  showKeyboard() {
    keyboardElement.classList.add('active');
    document.body.addEventListener('mouseup', function hideKeyboard(evt) {
      if (evt.target.closest('.keyboard') 
      || evt.target.closest('.clear-search-btn')
      || evt.target.closest('.search-input')
      || evt.target.closest('.error-message')) {
        return;
      }
      if (!evt.target.closest('.keyboard-btn')) {
        keyboardElement.classList.remove('active');
      }
      document.body.removeEventListener('mouseup', hideKeyboard);
      if (!evt.target.closest('.swiper-container')) {
        keyboardElement.focus();
      }
    });
    document.body.addEventListener('keydown', function hidekeyboardOnType() {
      keyboardElement.classList.remove('active');
      document.body.removeEventListener('keydown', hidekeyboardOnType);
    });
    keyboardElement.focus();
  }

  notifyIfTranslated() {
    if (this.state.isSearchTranslated) {
      this.showErrorMessage(`Showing results for ${this.state.searchTranslate}`);
    }
  }

  getMoviesData(movieToSearch = this.currentSearch, page = this.state.currentPage) {
    this.state.isRequestPending = true;
    return this.translateIfNecessary(movieToSearch).
      then((movieToSearch) => {
        this.state.searchTranslate = movieToSearch;
        return Service.getMoviesList(movieToSearch, page);
      })
      .then((moviesData) => {
        if (moviesData.Error) {
          if (moviesData.Error === 'Movie not found!') {
            throw new Error(`No results for '${movieToSearch}'`);
          } else {
            throw new Error(moviesData.Error);
          }
        } else {
          this.totalResults = moviesData.totalResults;

          return moviesData.Search.map((movie) => {
            const convertedData = this.convertData(movie);
            return Service.getImagePromise(convertedData);
          })
        }
      })
      .then((cardPromises) => Promise.all(cardPromises))
      .then((data) => data.map(Service.getMovieRating))
      .then((cardPromises) => Promise.all(cardPromises))
      // .then((data) => data)
      .then((fullMovieData) => {
        // let { movieData, movieResponse} = data;
        this.state.shownMoviesAmount += fullMovieData.length;
        this.state.isRequestPending = false;
        this.saveMovieFullData(fullMovieData.map(({ movieResponse }) => movieResponse));
        return fullMovieData.map(({ movieData }) => movieData);
      })
  }

  saveMovieFullData(moviesList) {
    this.extraInfoMovieList = moviesList;
  }

  translateIfNecessary (movieToSearch) {
    const searchLang = this.checkSearchLang(movieToSearch);
    if (searchLang === 'ru') {
      this.state.isSearchTranslated = true;
      return Service.translate(movieToSearch);
    } else if (searchLang === 'eng') {
      this.state.isSearchTranslated = false;
      return new Promise(resolve => resolve(movieToSearch));
    }
  }

  checkSearchLang(movieToSearch) {
    // const isMultiLangSearch = MULTI_LANG_REG_EXP.test(movieToSearch);
    // MULTI_LANG_REG_EXP.lastIndex = 0;
  
    const containRusLetters = CONTAIN_RUS_REG_EXP.test(movieToSearch);
    CONTAIN_RUS_REG_EXP.lastIndex = 0;

    if (containRusLetters) {
      this.isSearchTranslated = true;
      return 'ru';
    } else {
      this.isSearchTranslated = false;
      return 'eng';
    }
  }
  
  convertData(sourceDataItem) {
    return {
      title: sourceDataItem.Title,
      posterSrc: sourceDataItem.Poster,
      year: sourceDataItem.Year,
      id: sourceDataItem.imdbID,
    }
  }

  addNewMovies(currentIndex) {
    if (this.checkIfShouldAddSlides(currentIndex)
    && this.hasOtherMovies()
    && !this.state.isRequestPending) {
      this.state.currentPage += 1;
      this.getMoviesData()
        .then((moviesData) => {
          this.onMoviesAdding(moviesData);
        })
    }
  }

  onMoviesAdding(moviesData) {
  }

  checkIfShouldAddSlides(currentIndex) {
    return this.state.shownMoviesAmount - currentIndex <= buffer;
  }

  hasOtherMovies() {
    return this.totalResults - this.state.shownMoviesAmount;
  }
  // getAmountMoviesToShow() {
  //   return Math.min(this.getRestMoviesAmount(), MOVIES_PER_PAGE);
  // }
}
// getAmountMoviesToShow() {
//   return Math.min(this.getRestMoviesAmount(), MOVIES_PER_PAGE);
// }

// shouldLoadNew() {
//   const activeSlideIndex = this.swiper.activeIndex;
//   return searchState.shownMoviesAmount - activeSlideIndex < MOVIES_PER_PAGE;
// }



// function getMovieData({ movieToSearch = lastSearch || DEFAULT_SEARCH, page = DEFAULT_PAGE}) {
  // let isSearchTranslated = false;
  // let totalResults = 0;

  // function getMovieUrl(movie) {
  //   return `${SERVER_URL.movies}?apikey=${API_KEY.movies}&s=${movie}&type=movie&page=${page}`;
  // }

  // const translatorUrl = `${SERVER_URL.translator}?key=${API_KEY.translator}&text=${movieToSearch}&lang=ru-en`;

  // function checkSearchLang(movieToSearch) {
  //   const isMultiLangSearch = MULTI_LANG_REG_EXP.test(movieToSearch);
  //   MULTI_LANG_REG_EXP.lastIndex = 0;

  //   if (!isMultiLangSearch) {
  //     console.log('error: multi lang');
  //   } else {
  //     const isRusLangSearch = CONTAIN_RUS_REG_EXP.test(movieToSearch);
  //     CONTAIN_RUS_REG_EXP.lastIndex = 0;

  //     if (isRusLangSearch) {
  //       isSearchTranslated = true;
  //       return 'ru';
  //     } else {
  //       isSearchTranslated = false;
  //       return 'eng';
  //     }
  //   }
  // }

  // const translateIfNecessary = function (movieToSearch) {
  //   const searchLang = checkSearchLang(movieToSearch);
  //   if (searchLang === 'ru') {
  //     // return fetch(translatorUrl).
  //     //   then((response) => response.json()).
  //     //   then((response) => response.text[0]);
  //   } else if (searchLang === 'eng') {
  //     return new Promise(onLoad => onLoad(movieToSearch));
  //   }
  // }

  // const whenMovieDataLoad = function (movie) {
  //   lastSearch = movie;
    // return fetch(getMovieUrl(movie)).
    //   then((response) => {
    //     if (response.status >= 200 && response.status < 300) {
    //       return response.json();
    //     }
    //     throw new Error(`server error: ${response.status} ${response.statusText}`);
    //   });
  // }

  // function addMovieRating(cardData) {
  //   const ratingUrl = `${SERVER_URL.movies}?apikey=${API_KEY.movies}&i=${cardData.id}`;
  //   return new Promise((onLoad, onError) => {
  //     fetch(ratingUrl).
  //       then((movieResponse) => {
  //         if (movieResponse.status >= 200 && movieResponse.status < 300) {
  //           return movieResponse.json();
  //         }
  //         throw new Error(`rating loading error: ${response.status} ${response.statusText}`);
  //       }).
  //       then((movieResponse) => {
  //         cardData.rating = movieResponse.imdbRating;
  //         onLoad(cardData);
  //       }).
  //       catch((err) => console.log(`Rating loading Error: ${err}`));
  //   });
  // }

  // function getImagePromises(cardData) {
  //   return new Promise((onLoad, onError) => {
  //     const image = new Image();
  //     const src = cardData.posterSrc;
  //     cardData.posterSrc = image;
  //     cardData.posterSrc.onload = () => onLoad(cardData);
  //     cardData.posterSrc.onerror = () => onError(cardData);
  //     cardData.posterSrc.src = src;
  //   }).
  //   catch((cardData) => {
  //     cardData.posterSrc.src = DEFAULT_POSTER_SRC;
  //     console.warn('постер отсутствует');
  //     return cardData;
  //   })
  // }

  // function convertData(sourceDataItem) {
  //   return {
  //     title: sourceDataItem.Title,
  //     posterSrc: sourceDataItem.Poster,
  //     year: sourceDataItem.Year,
  //     id: sourceDataItem.imdbID,
  //   }
  // }

//   return translateIfNecessary(movieToSearch).
//     then((searchValue) => whenMovieDataLoad(searchValue)).
//     then((data) => {
//       searchState.shownMoviesAmount += data.Search.length;
//       console.log(data)
//       if (data.Error) {
//         console.log(`ошибка при запросе: ${data.Error}`);
//         throw new Error(data.Error);
//       } else {
//         totalResults = data.totalResults;
//       }
//       return data.Search.map((item) => {
//         const convertedData = convertData(item);
//         return getImagePromises(convertedData);
//       })
//     }).
//     then((cardPromises) => Promise.all(cardPromises)).
//     then((data) => data.map(addMovieRating)).
//     then((cardPromises) => Promise.all(cardPromises)).
//     then((data) => ({ data: data, totalResults: totalResults })).
//     catch((err) => console.error(`final error in the chain: ${err}`));
// }


// export { getMovieData, searchState };