import Search from './search.js';
import MySwiper from './my-swiper.js';

const searchInput = document.querySelector('.search-input');

export default class Controller {
  constructor() {
    this.search = new Search();
    this.swiper = null;
    this.init();
  }

  init() {
    this.search.getMoviesData()
      .then((moviesDataList) => {
        this.swiper = new MySwiper(moviesDataList);
        this.bind();
      });
    searchInput.focus();
  }

  bind() {
    this.swiper.onSlideChange = function (activeSlideIndex) {
      this.search.addNewMovies(activeSlideIndex);
    }.bind(this);

    this.search.onMoviesAdding = function(moviesData) {
      this.swiper.addSlideElements(moviesData);
    }.bind(this);

    this.search.onUserSearch = function (moviesData) {
      this.swiper.replaceAllSlides(moviesData);
    }.bind(this);
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

