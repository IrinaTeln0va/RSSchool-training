import Service from './service.js';

const DEFAULT_SEARCH = 'kill bill';
const DEFAULT_PAGE = 1;
const MOVIES_PER_PAGE = 10;
const buffer = 10;

const MULTI_LANG_REG_EXP = /(^[А-я0-9\s]+)(?!.*[A-z])$|(^[A-z0-9\s]+)(?!.*[А-я])$/g;
const CONTAIN_RUS_REG_EXP = /[А-я]+/g;

const formElement = document.querySelector('.search-form');
const searchElement = document.querySelector('.search-input');

export default class Search {
  constructor() {
    this.state = {
      shownMoviesAmount: 0,
      currentPage: DEFAULT_PAGE,
      isRequestPending: false,
      isSearchTranslated: false,
    };
    this.currentSearch = DEFAULT_SEARCH;
    this.totalResults = 0;
    this.bind();
  }

  bind() {
    formElement.addEventListener('submit', this.onSearchFormSubmit.bind(this));
  }
  
  onSearchFormSubmit(evt) {
    evt.preventDefault();
    const movieToSearch = searchElement.value && searchElement.value.length ? searchElement.value : null;
    this.currentSearch = movieToSearch;
    this.resetSearchState();
    this.getMoviesData(movieToSearch)
      .then((moviesData) => {
        this.onUserSearch(moviesData);
      })
  }

  resetSearchState() {
    this.state.currentPage = DEFAULT_PAGE;
    this.totalResults = 0;
    this.state.shownMoviesAmount = 0;
  }

  onUserSearch(moviesData) {
  }

  getMoviesData(movieToSearch = this.currentSearch, page = this.state.currentPage) {
    this.state.isRequestPending = true;
    return this.translateIfNecessary(movieToSearch).
      then((movieToSearch) => Service.getMoviesList(movieToSearch, page))
      .then((moviesData) => {
        if (moviesData.Error) {
          console.log(`ошибка при запросе: ${moviesData.Error}`);
          throw new Error(moviesData.Error);
        } else {
          // this.state.shownMoviesAmount += moviesData.Search.length;
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
      .catch((err) => console.error(`final error in the chain: ${err}`))
      .then((moviesData) => {
        this.state.shownMoviesAmount += moviesData.length;
        this.state.isRequestPending = false;
        return moviesData;
      });
  }

  translateIfNecessary (movieToSearch) {
    const searchLang = this.checkSearchLang(movieToSearch);
    if (searchLang === 'ru') {
      this.state.isSearchTranslated = true;
      return Service.translate(movieToSearch);
      // return fetch(translatorUrl).
      //   then((response) => response.json()).
      //   then((response) => response.text[0]);
    } else if (searchLang === 'eng') {
      return new Promise(resolve => resolve(movieToSearch));
    }
  }

  checkSearchLang(movieToSearch) {
    const isMultiLangSearch = MULTI_LANG_REG_EXP.test(movieToSearch);
    MULTI_LANG_REG_EXP.lastIndex = 0;
  
    if (!isMultiLangSearch) {
      console.log('error: multi lang');
    } else {
      const isRusLangSearch = CONTAIN_RUS_REG_EXP.test(movieToSearch);
      CONTAIN_RUS_REG_EXP.lastIndex = 0;
  
      if (isRusLangSearch) {
        this.isSearchTranslated = true;
        return 'ru';
      } else {
        this.isSearchTranslated = false;
        return 'eng';
      }
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