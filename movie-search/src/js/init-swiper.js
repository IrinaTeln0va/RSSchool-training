import Swiper from 'swiper';

export default function initSwiper() {
  const mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 30,
    allowTouchMove: true,
    updateOnWindowResize: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 25,
      },
      540: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      960: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      1020: {
        slidesPerView: 4,
        spaceBetween: 25,
      },
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: false,
    },
  })
}