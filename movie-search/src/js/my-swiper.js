// import { getMovieData, searchState } from './search.js';
import initSwiper from './init-swiper.js';

const ratingSetting = {
  starWidth: 15,
  totalStars: 10
}

export default class MySwiper {
  constructor(moviesToShow) {
    console.log(moviesToShow);
    this.moviesToShow = moviesToShow;
    this.cardElementsList = [];
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
    // const slideElementsList = moviesToShow.map((item, index) => {
    //   return this.createSlideElement(item, index);
    // });
    const slideElementsList = this.createCardsList(moviesToShow);

    // if (searchState.shownMoviesAmount <= MOVIES_PER_PAGE) {
    //   this.drawSlides(slideElementsList, slidesWrapper);
    // } else {
    this.cardElementsList = slideElementsList;
    this.appendSlides(slideElementsList);
    // }
    // this.shownMoviesAmount += slideElementsList.length;
    // console.log(searchState.shownMoviesAmount);
  }

  createCardsList(moviesToShow) {
    return moviesToShow.map((item, index) => {
      return this.createSlideElement(item, index);
    });
  }

  appendSlides(slideElementsList) {
    this.swiper.appendSlide(slideElementsList);
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

    document.querySelector('.swiper-wrapper').addEventListener('click', this.onDetailedBtnClick.bind(this));
  }

  onDetailedBtnClick(evt) {
    if (!evt.target.closest('.to-detailed')) {
      return;
    }
    const sliderElement = document.querySelector('.swiper-wrapper');
    const movieIndex = [...sliderElement.children].indexOf(evt.target.closest('.swiper-slide'));
    this.onDetailsBtn(movieIndex);
  }

  onDetailsBtn(movieIndex) {
  }

  onSlideChange() {
  }

  handleRating(rating) {
    if (rating == 'N/A') {
      rating = 0;
    }
    function calcRating(rating) {
      return rating * ratingSetting.starWidth;
    }
    return `
      <span class='rating'>${rating}</span>
      <span class='rating-wrapper'>
        <span class='rating-img base'></span>
        <span class='rating-img' style='width: ${calcRating(rating)}px'></span>
      </span>`
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
      <h2 class='movie-title'>
        <a class='movie-link' target='_blank' href='https://www.imdb.com/title/${data.id}/videogallery/'>${data.title}</a>
      </h2>
      <div class='movie-poster'>
      </div>
      <div class='detail-info-wrap'>
        <p class="movie-year">
          ${data.year}
        </p>
        <button type='button' class='to-detailed'>Details</button>
      </div>
      <p class='movie-rating'>
        ${this.handleRating(data.rating)}
      </p>`;
    domElement.querySelector('.movie-poster').append(data.posterSrc);
    return domElement;
  }
}