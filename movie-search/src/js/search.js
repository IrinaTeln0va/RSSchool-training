import Service from './service';
import renderKeyboard from './keyboard';

renderKeyboard();

const DEFAULT_SEARCH = 'terminator';
const DEFAULT_PAGE = 1;
const buffer = 10;
const CONTAIN_RUS_REG_EXP = /[А-я]+/g;
const Language = {
  ru: 'ru',
  eng: 'eng',
};

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

      this.constructor.showKeyboard();
    });
  }

  onSearchFormSubmit(evt) {
    evt.preventDefault();
    const movieToSearch = searchElement.value
    && searchElement.value.length
      ? searchElement.value
      : null;

    if (!movieToSearch) {
      this.constructor.showErrorMessage('Please enter your query in the search input');
      searchElement.focus();
      return;
    }

    this.currentSearch = movieToSearch;
    this.resetSearchState();
    this.constructor.showSpinner();
    this.getMoviesData(movieToSearch)
      .then((moviesData) => {
        this.onUserSearch(moviesData);
      })
      .catch((err) => {
        this.constructor.hideSpinner();
        this.constructor.showErrorMessage(err);
      });
  }

  static showSpinner() {
    searchBtn.classList.add('hide');
    spinnerElement.classList.add('active');
  }

  static hideSpinner() {
    spinnerElement.classList.remove('active');
    searchBtn.classList.remove('hide');
  }

  resetSearchState() {
    this.state.currentPage = DEFAULT_PAGE;
    this.totalResults = 0;
    this.state.shownMoviesAmount = 0;
  }

  onUserSearch() {
    throw new Error('method should be overriden', this);
  }

  static showErrorMessage(error) {
    errorElement.querySelector('.error-text').innerText = `${error}`;
    errorElement.classList.add('active');
    document.body.addEventListener('mouseup', function hideMessage({ target }) {
      if (
        target.closest('.error-message')
        && !target.closest('.error-btn')
      ) {
        return;
      }

      errorElement.classList.remove('active');
      document.body.removeEventListener('mouseup', hideMessage);

      if (
        !target.closest('.swiper-container')
        && !target.closest('.list-container')
      ) {
        searchElement.focus();
      }
    });

    searchElement.addEventListener('input', function hideErrorOnInput() {
      errorElement.classList.remove('active');
      searchElement.removeEventListener('input', hideErrorOnInput);
    });
    searchElement.focus();
  }

  static showKeyboard() {
    keyboardElement.classList.add('active');
    document.body.addEventListener('mouseup', function hideKeyboard(evt) {
      if (
        evt.target.closest('.keyboard')
        || evt.target.closest('.clear-search-btn')
        || evt.target.closest('.search-input')
        || evt.target.closest('.error-message')
      ) {
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
      this.constructor.showErrorMessage(`Showing results for ${this.state.searchTranslate}`);
    }
  }

  getMoviesData(movieToSearch = this.currentSearch, page = this.state.currentPage) {
    this.state.isRequestPending = true;
    return this.translateIfNecessary(movieToSearch)
      .then((moviesData) => {
        this.state.searchTranslate = moviesData;
        return Service.getMoviesList(moviesData, page);
      })
      .then((moviesData) => {
        if (
          (moviesData.Error && moviesData.Error === 'Movie not found!')
          || (moviesData.Error && moviesData.Error === 'Too many results.')
        ) {
          throw new Error(`No results for '${movieToSearch}'`);
        } else if (moviesData.Error) {
          throw new Error(moviesData.Error);
        } else {
          this.totalResults = +moviesData.totalResults;

          return moviesData.Search.map((movie) => {
            const convertedData = this.constructor.convertData(movie);

            return Service.getImagePromise(convertedData);
          });
        }
      })
      .then((cardPromises) => Promise.all(cardPromises))
      .then((data) => data.map(Service.getMovieRating))
      .then((cardPromises) => Promise.all(cardPromises))
      .then((fullMovieData) => {
        this.state.shownMoviesAmount += fullMovieData.length;
        this.state.isRequestPending = false;
        this.saveMovieFullData(fullMovieData.map(({ movieResponse }) => movieResponse));
        return fullMovieData.map(({ movieData }) => movieData);
      });
  }

  saveMovieFullData(moviesList) {
    this.extraInfoMovieList = moviesList;
  }

  translateIfNecessary(movieToSearch) {
    const searchLang = this.checkSearchLang(movieToSearch);

    if (searchLang === Language.ru) {
      this.state.isSearchTranslated = true;
      return Service.translate(movieToSearch);
    }

    if (searchLang === Language.eng) {
      this.state.isSearchTranslated = false;
      return new Promise((resolve) => resolve(movieToSearch));
    }

    return false;
  }

  checkSearchLang(movieToSearch) {
    const containRusLetters = CONTAIN_RUS_REG_EXP.test(movieToSearch);

    CONTAIN_RUS_REG_EXP.lastIndex = 0;

    if (containRusLetters) {
      this.isSearchTranslated = true;
      return Language.ru;
    }

    this.isSearchTranslated = false;
    return Language.eng;
  }

  static convertData(sourceDataItem) {
    return {
      title: sourceDataItem.Title,
      posterSrc: sourceDataItem.Poster,
      year: sourceDataItem.Year,
      id: sourceDataItem.imdbID,
    };
  }

  addNewMovies(currentIndex) {
    if (
      this.checkIfShouldAddSlides(currentIndex)
      && this.hasOtherMovies()
      && !this.state.isRequestPending
    ) {
      this.state.currentPage += 1;
      this.getMoviesData()
        .then((moviesData) => {
          this.onMoviesAdding(moviesData, this.totalResults);
        });
    }
  }

  onMoviesAdding() {
    throw new Error('method should be overriden', this);
  }

  checkIfShouldAddSlides(currentIndex) {
    return this.state.shownMoviesAmount - currentIndex <= buffer;
  }

  hasOtherMovies() {
    return this.totalResults - this.state.shownMoviesAmount;
  }
}
