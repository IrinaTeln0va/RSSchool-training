import Search from './search';
import MySwiper from './my-swiper';
import ListView from './list-view';

const searchInput = document.querySelector('.search-input');
const viewOptions = document.querySelector('.view-options');
const pageContainer = document.querySelector('main .container');

export default class Controller {
  constructor() {
    this.search = new Search();
    this.swiper = null;
    this.listView = null;
  }

  init() {
    this.search.getMoviesData()
      .then((moviesDataList) => {
        this.swiper = new MySwiper(moviesDataList);
        const cardsElementsList = this.swiper.cardElementsList.map((elem) => elem.cloneNode(true));
        const fullDataList = this.search.extraInfoMovieList;

        this.listView = new ListView(cardsElementsList, fullDataList, this.search.totalResults);
        this.bind();
      })
      .catch((error) => {
        this.search.constructor.showErrorMessage(error);
      });
    searchInput.focus();
  }

  bind() {
    this.swiper.onSlideChange = (activeSlideIndex) => {
      this.search.addNewMovies(activeSlideIndex);
    };

    this.listView.onLoadMoreClick = (activeSlideIndex) => {
      this.search.addNewMovies(activeSlideIndex);
    };

    this.listView.onBackBtnClick = function onBack() {
      const event = new Event('click', { bubbles: true });

      viewOptions.querySelector('.slider-view-btn').dispatchEvent(event);
    };

    this.search.onMoviesAdding = (moviesData, totalResults) => {
      this.swiper.addSlideElements(moviesData);
      const cardElementsList = this.swiper.cardElementsList.map((elem) => elem.cloneNode(true));

      this.listView.addMovies(cardElementsList, this.search.extraInfoMovieList, totalResults);
    };

    this.search.onUserSearch = (moviesData) => {
      this.swiper.replaceAllSlides(moviesData);
      const cardElementsList = this.swiper.cardElementsList.map((elem) => elem.cloneNode(true));
      const fullDataList = this.search.extraInfoMovieList;

      this.listView.replaceMovies(cardElementsList, fullDataList, this.search.totalResults);
      this.search.notifyIfTranslated();
      this.search.constructor.hideSpinner();
    };

    this.swiper.onDetailsBtn = (movieIndex) => {
      const event = new Event('click', { bubbles: true });

      viewOptions.querySelector('.list-view-btn').dispatchEvent(event);
      const clickedCard = this.listView.domElement.children[movieIndex];

      clickedCard.scrollIntoView();
      clickedCard.querySelector('.details-input').checked = true;
    };

    viewOptions.addEventListener('click', (evt) => {
      const { target } = evt;
      const isSliderBtn = target.classList.contains('slider-view-btn');
      const isListBtn = target.classList.contains('list-view-btn');

      if (!isSliderBtn && !isListBtn) {
        return;
      }

      function highlightActiveLink() {
        [...viewOptions.querySelectorAll('.view-btn')].forEach((elem) => elem.classList.remove('active'));
        target.classList.add('active');
      }

      highlightActiveLink();

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
