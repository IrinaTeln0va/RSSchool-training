import initSwiper from './init-swiper.js';

const MOVIES_PER_PAGE = 10;

export default class mySwiper {
  constructor(searchData) {
    this.searchData = searchData;
    this.swiperElement = document.querySelector('.swiper-container');
    this.swiper = this.init();
  }

  init() {
    this.drawSlides(this.searchData);
    initSwiper();
  }

  drawSlides(data) {
    this.searchData = data;
    const slidesWrapper = this.swiperElement.querySelector('.swiper-wrapper');
    this.slideElementsList = new Array(MOVIES_PER_PAGE).fill().map((item, index) => {
      return this.createSlideElement(data[index], index);
    });
    this.slideElementsList.forEach((movieElem) => slidesWrapper.append(movieElem));
  }

  createSlideElement(data, index) {
    const domElement = document.createElement('div');
    domElement.classList.add(`swiper-slide`, `slide-${index}`);
    domElement.innerHTML = `
      <h2 class="movie-title">
        <a class="movie-link" href="#">${data.title}</a>>
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