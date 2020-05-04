import { getMovieData } from './search.js';
import mySwiper from './my-swiper.js';

const searchInput = document.querySelector('.search-input');
searchInput.focus();

let swiperComponent;

getMovieData().
  then((moviesData) => {
    swiperComponent = new mySwiper(moviesData);
  });

