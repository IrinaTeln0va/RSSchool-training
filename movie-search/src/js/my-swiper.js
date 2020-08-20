import initSwiper from './init-swiper';

const ratingSetting = {
  starWidth: 15,
  totalStars: 10,
};

export default class MySwiper {
  constructor(moviesToShow) {
    this.moviesToShow = moviesToShow;
    this.cardElementsList = [];
    this.swiper = null;
    this.init();
    this.bind();
  }

  init() {
    this.swiper = initSwiper();
    this.addSlideElements(this.moviesToShow);
  }

  addSlideElements(moviesToShow) {
    const slideElementsList = this.createCardsList(moviesToShow);

    this.cardElementsList = slideElementsList;
    this.appendSlides(slideElementsList);
  }

  createCardsList(moviesToShow) {
    return moviesToShow.map((item, index) => this.createSlideElement(item, index));
  }

  appendSlides(slideElementsList) {
    this.swiper.appendSlide(slideElementsList);
  }

  replaceAllSlides(newSlidesData) {
    this.swiper.removeAllSlides();
    this.addSlideElements(newSlidesData);
    this.swiper.slideTo(0, 0, false);
  }

  bind() {
    this.swiper.on('slideChange', () => {
      this.onSlideChange(this.swiper.activeIndex);
    });

    this.swiper.on('reachEnd', () => {
      this.onSlidesEnd();
    });

    document.querySelector('.swiper-wrapper').addEventListener('click', this.onDetailedBtnClick.bind(this));
  }

  onSlidesEnd() {
    throw new Error('method should be overriden', this);
  }

  static hideSliderLoader() {
    const nextSlideArrow = document.querySelector('.swiper-button-next');

    nextSlideArrow.classList.add('hide');
  }

  static showSliderLoader() {
    const nextSlideArrow = document.querySelector('.swiper-button-next');

    nextSlideArrow.classList.remove('hide');
  }

  onDetailedBtnClick(evt) {
    if (!evt.target.closest('.to-detailed')) {
      return;
    }

    const sliderElement = document.querySelector('.swiper-wrapper');
    const movieIndex = [...sliderElement.children].indexOf(evt.target.closest('.swiper-slide'));

    this.onDetailsBtn(movieIndex);
  }

  onDetailsBtn() {
    throw new Error('method should be overriden', this);
  }

  onSlideChange() {
    throw new Error('method should be overriden', this);
  }

  static handleRating(rating) {
    let cardRating = rating;

    if (cardRating === 'N/A') {
      cardRating = 0;
    }

    function calcRating() {
      return cardRating * ratingSetting.starWidth;
    }
    return `
      <span class='rating'>${cardRating}</span>
      <span class='rating-wrapper'>
        <span class='rating-img base'></span>
        <span class='rating-img' style='width: ${calcRating(cardRating)}px'></span>
      </span>`;
  }

  createSlideElement(data, index) {
    const domElement = document.createElement('div');

    domElement.classList.add('swiper-slide', `slide-${index}`);
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
        ${this.constructor.handleRating(data.rating)}
      </p>`;
    domElement.querySelector('.movie-poster').append(data.posterSrc);
    return domElement;
  }
}
