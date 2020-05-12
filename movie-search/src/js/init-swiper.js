import Swiper from 'swiper';

export default function initSwiper() {
  return new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    allowTouchMove: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
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
      900: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      1140: {
        slidesPerView: 4,
        spaceBetween: 25,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-s'
    }
  })
}
