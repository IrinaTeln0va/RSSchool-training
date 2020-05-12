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
        this.listView = new ListView(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList, this.search.totalResults);
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

    this.listView.onLoadMoreClick = function (activeSlideIndex) {
      this.search.addNewMovies(activeSlideIndex);
    }.bind(this);

    this.listView.onBackBtnClick = function (activeSlideIndex) {
      const event = new Event("click", { bubbles: true });
      viewOptions.querySelector('.slider-view-btn').dispatchEvent(event);
    }.bind(this);

    this.search.onMoviesAdding = function (moviesData, totalResults) {
      this.swiper.addSlideElements(moviesData);
      this.listView.addMovies(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList, totalResults);
    }.bind(this);

    this.search.onUserSearch = function (moviesData) {
      this.swiper.replaceAllSlides(moviesData);
      this.listView.replaceMovies(this.swiper.cardElementsList.map((elem) => elem.cloneNode(true)), this.search.extraInfoMovieList, this.search.totalResults);
      this.search.notifyIfTranslated();
      this.search.hideSpinner();
    }.bind(this);

    this.swiper.onDetailsBtn = function(movieIndex) {
      const event = new Event("click", { bubbles: true });
      viewOptions.querySelector('.list-view-btn').dispatchEvent(event);
      const clickedCard = this.listView.domElement.children[movieIndex];
      clickedCard.scrollIntoView();
      clickedCard.querySelector('.details-input').checked = true;
    }.bind(this);

    viewOptions.addEventListener('click', (evt) => {
      const target = evt.target;
      const isSliderBtn = target.classList.contains('slider-view-btn');
      const isListBtn = target.classList.contains('list-view-btn');

      if (!isSliderBtn && !isListBtn) {
        return;
      }

      function highlightActiveLink(target) {
        [...viewOptions.querySelectorAll('.view-btn')].forEach((elem) => elem.classList.remove('active'));
        target.classList.add('active');
      }

      highlightActiveLink(target);

      if (isSliderBtn) {
        pageContainer.classList.remove('list-view-wrap');
        pageContainer.classList.add('slider-view-wrap');
      } else {
        pageContainer.classList.remove('slider-view-wrap');
        pageContainer.classList.add('list-view-wrap');
      }
    });
  }
}