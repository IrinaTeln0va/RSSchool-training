import Search from './search.js';
import MySwiper from './my-swiper.js';
import ListView from './list-view.js';

const searchInput = document.querySelector('.search-input');
const viewOptions = document.querySelector('.view-options');
const pageContainer = document.querySelector('main .container');

export default class Controller {
  constructor() {
    this.search = new Search();
    this.swiper = null;
    this.listView = null;
    this.init();
  }

  init() {
    this.search.getMoviesData()
      .then((moviesDataList) => {
        this.swiper = new MySwiper(moviesDataList);
        this.listView = new ListView(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList);
        this.bind();
      })
      .catch((error) => {
        this.search.showErrorMessage(error);
      });
    searchInput.focus();
  }

  bind() {
    this.swiper.onSlideChange = function (activeSlideIndex) {
      this.search.addNewMovies(activeSlideIndex);
    }.bind(this);

    this.search.onMoviesAdding = function(moviesData) {
      this.swiper.addSlideElements(moviesData);
      this.listView.addMovies(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList);
    }.bind(this);

    this.search.onUserSearch = function (moviesData) {
      this.swiper.replaceAllSlides(moviesData);
      this.listView.replaceMovies(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList);
      this.search.notifyIfTranslated();
      this.search.hideSpinner();
    }.bind(this);

    viewOptions.addEventListener('click', (evt) => {
      const target = evt.target;
      if (target.classList.contains('slider-view-btn')) {
        target.classList.add('active');
        viewOptions.querySelector('.list-view-btn').classList.remove('active');
        pageContainer.classList.remove('list-view-wrap');
        pageContainer.classList.add('slider-view-wrap');
      } else if (target.classList.contains('list-view-btn')) {
        target.classList.add('active');
        viewOptions.querySelector('.slider-view-btn').classList.remove('active');
        pageContainer.classList.remove('slider-view-wrap');
        pageContainer.classList.add('list-view-wrap');
      }
    });
  }
}


// onSlideChange() {
//   const amountSlidesToShow = this.getRestMoviesAmount();
//   if (amountSlidesToShow && this.isTimeToLoadNew()) {
//     console.log('time to load new slides');
//     this.loadNextNewSlides(amountSlidesToShow);
//   }
// }

// function removeSwiper() {
//   const previousSearchSlider = document.querySelector('.swiper-container').swiper;
//   previousSearchSlider.removeAllSlides();
//   searchState.shownMoviesAmount = 0;
//   previousSearchSlider.destroy();
// }

// getMovieData({ page: this.page }).
//   then((moviesData) => {
//     this.addSlideElements(moviesData.data);
//   });


// checkIfShouldLoadNew(currentCard) {
//   return this.state.shownMoviesAmount - currentCard < buffer;
// }

// getRestMoviesAmount() {
//   return this.totalResults - this.state.shownMoviesAmount;
// }

// getAmountMoviesToShow() {
//   return Math.min(this.getRestMoviesAmount(), MOVIES_PER_PAGE);
// }

