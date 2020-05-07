import { getMovieData, searchState } from './search.js';
import initSwiper from './init-swiper.js';

const MOVIES_PER_PAGE = 10;
const START_PAGE = 1;

export default class MySwiper {
  constructor(searchData) {
    console.log(searchData);
    this.searchData = searchData.data;
    this.totalDataResults = searchData.totalResults;
    this.swiper = this.init();
    this.page = START_PAGE;
    this.bind();
    console.log(this.swiper.slides);
  }

  init() {
    this.addSlideElements(this.searchData);
    return initSwiper();
  }

  addSlideElements(data) {
    this.searchData = data;
    const slidesWrapper = document.querySelector('.swiper-wrapper');
    const slideElementsList = new Array(this.searchData.length).fill().map((item, index) => {
      return this.createSlideElement(data[index], index);
    });

    if (searchState.shownMoviesAmount <= MOVIES_PER_PAGE) {
      this.drawSlides(slideElementsList, slidesWrapper);
    } else {
      this.swiper.appendSlide(slideElementsList);
    }
    // this.shownMoviesAmount += slideElementsList.length;
    console.log(searchState.shownMoviesAmount);
  }

  drawSlides(slidesList, wrapper) {
    slidesList.forEach((movieElem) => wrapper.append(movieElem));
  }

  bind() {
    this.swiper.on('slideChange', this.onSlideChange.bind(this));
  }

  onSlideChange() {
    const amountSlidesToShow = this.getRestMoviesAmount();
    if (amountSlidesToShow && this.isTimeToLoadNew()) {
      console.log('time to load new slides');
      this.loadNextNewSlides(amountSlidesToShow);
    }
  }

  loadNextNewSlides(amountSlidesToShow) {
    this.page += 1;
    getMovieData({ page: this.page}).
      then((moviesData) => {
        this.addSlideElements(moviesData.data);
      });
  }

  isTimeToLoadNew() {
    const activeSlideIndex = this.swiper.activeIndex;
    return searchState.shownMoviesAmount - activeSlideIndex < MOVIES_PER_PAGE;
  }

  getRestMoviesAmount() {
    return this.totalDataResults - searchState.shownMoviesAmount;
  }

  getAmountMoviesToShow() {
    return Math.min(this.getRestMoviesAmount(), MOVIES_PER_PAGE);
  }

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