// import { getMovieData, searchState } from './search.js';
import initSwiper from './init-swiper.js';

// const MOVIES_PER_PAGE = 10;
// const START_PAGE = 1;

export default class MySwiper {
  constructor(moviesToShow) {
    console.log(moviesToShow);
    this.moviesToShow = moviesToShow;
    // this.totalDataResults = searchData.totalResults;
    this.swiper = null;
    this.init();
    // this.page = START_PAGE;
    this.bind();
  }

  init() {
    this.swiper = initSwiper();
    this.addSlideElements(this.moviesToShow);
  }

  addSlideElements(moviesToShow) {
    // const slidesWrapper = document.querySelector('.swiper-wrapper');
    const slideElementsList = moviesToShow.map((item, index) => {
      return this.createSlideElement(item, index);
    });

    // if (searchState.shownMoviesAmount <= MOVIES_PER_PAGE) {
    //   this.drawSlides(slideElementsList, slidesWrapper);
    // } else {
    this.swiper.appendSlide(slideElementsList);
    // }
    // this.shownMoviesAmount += slideElementsList.length;
    // console.log(searchState.shownMoviesAmount);
  }

  replaceAllSlides(newSlidesData) {
    this.swiper.removeAllSlides();
    this.addSlideElements(newSlidesData);
    this.swiper.slideTo(0, 0, false);
  }

  // drawSlides(slidesList, wrapper) {
  //   slidesList.forEach((movieElem) => wrapper.append(movieElem));
  // }

  bind() {
    this.swiper.on('slideChange', function() {
      this.onSlideChange(this.swiper.activeIndex);
    }.bind(this));
  }

  onSlideChange() {
    // const amountSlidesToShow = this.getRestMoviesAmount();
    // if (amountSlidesToShow && this.isTimeToLoadNew()) {
    //   console.log('time to load new slides');
    //   this.loadNextNewSlides(amountSlidesToShow);
    // }
  }

  loadNextNewSlides(amountSlidesToShow) {
    // this.page += 1;
    // getMovieData({ page: this.page}).
    //   then((moviesData) => {
    //     this.addSlideElements(moviesData.data);
    //   });
  }

  // isTimeToLoadNew() {
  //   const activeSlideIndex = this.swiper.activeIndex;
  //   return searchState.shownMoviesAmount - activeSlideIndex < MOVIES_PER_PAGE;
  // }

  // getRestMoviesAmount() {
  //   return this.totalDataResults - searchState.shownMoviesAmount;
  // }

  // getAmountMoviesToShow() {
  //   return Math.min(this.getRestMoviesAmount(), MOVIES_PER_PAGE);
  // }

  createSlideElement(data, index) {
    const domElement = document.createElement('div');
    domElement.classList.add(`swiper-slide`, `slide-${index}`);
    domElement.innerHTML = `
      <h2 class="movie-title">
        <a class="movie-link" href="#">${data.title}</a>
      </h2>
      <div class="movie-poster">
      </div>
      <p class="movie-year">
        ${data.year}
      </p>
      <p class="movie-rating">
        <span class='rating'>${data.rating}</span>
        <span class="rating-img"></span>
      </p>
    </div>`;
    domElement.querySelector('.movie-poster').append(data.posterSrc);
    return domElement;
  }
}