import { getMovieData } from './search.js';
import MySwiper from './my-swiper.js';

const searchInput = document.querySelector('.search-input');
searchInput.focus();

getMovieData({}).
  then((moviesData) => {
    new MySwiper(moviesData);
  });