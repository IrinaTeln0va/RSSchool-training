import initSwiper from './init-swiper.js';
import {onSearchBtnClick} from './search.js';

initSwiper();

const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', onSearchBtnClick);