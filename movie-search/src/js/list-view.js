export default class ListView {
  constructor(movieElementsList, movieDataList, totalResults) {
    this.totalResults = totalResults;
    this.movieElementsList = movieElementsList;
    this.movieDataList = movieDataList;
    this.domElement = document.querySelector('.cards-wrapper');
    this.loadMoreBtn = document.querySelector('.load-more-btn');
    this.backBtn = document.querySelector('.back-btn');
    this.toTopBtn = document.querySelector('.scroll-top');
    this.loadMoreSpinner = document.querySelector('#list-view-spinner');
    this.init();
  }

  init() {
    this.addMovies(this.movieElementsList, this.movieDataList, this.totalResults);
    this.bind();
  }

  addMovies(movieElementsList, movieDataList, totalResults) {
    movieElementsList.forEach((elem, index) => {
      const listCard = elem;

      listCard.classList.add('list-view-movie');
      listCard.style = '';
      listCard.append(this.constructor.createMovieDescr(movieDataList[index]));
    });
    this.domElement.append(...movieElementsList);

    this.hideSpinner();

    if (totalResults === this.domElement.children.length) {
      this.loadMoreBtn.classList.add('hide');
    } else {
      this.loadMoreBtn.classList.remove('hide');
    }
  }

  bind() {
    this.loadMoreBtn.addEventListener('click', () => {
      this.showSpinner();
      const lastIndex = this.domElement.children.length - 1;

      this.onLoadMoreClick(lastIndex);
    });

    this.backBtn.addEventListener('click', () => {
      this.onBackBtnClick();
    });

    this.toTopBtn.addEventListener('click', () => {
      window.scrollTo(window.pageXOffset, 0);
    });

    window.addEventListener('scroll', () => {
      this.toTopBtn.hidden = (window.pageYOffset < document.documentElement.clientHeight);
    });
  }

  showSpinner() {
    this.loadMoreBtn.classList.add('hide');
    this.loadMoreSpinner.classList.remove('hide');
  }

  hideSpinner() {
    this.loadMoreSpinner.classList.add('hide');
    this.loadMoreBtn.classList.remove('hide');
  }

  onLoadMoreClick() {
    throw new Error('method should be overriden', this);
  }

  onBackBtnClick() {
    throw new Error('method should be overriden', this);
  }

  static createMovieDescr(data) {
    const descrElem = document.createElement('div');

    descrElem.classList.add('movie-desct');
    const replacingText = 'information would be provided at a later date';

    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    if (isEmpty(data)) {
      descrElem.innerHTML = '';
      return descrElem;
    }

    descrElem.innerHTML = `
    <p class='plot'>${data.Plot === 'N/A' ? replacingText : data.Plot}</p>
    <input id='${data.imdbID}' class='details-input' type='checkbox'>
    <label for='${data.imdbID}' class='details-switch'></label>
    <div class='descr-bottom-wrapper'>
      <p>Release date: <span class='answer'> ${data.Released === 'N/A' ? replacingText : data.Released}</span></p>
      <div>
        <span>Genre: </span>
        <ul>
          ${data.Genre.split(',').map((item) => `<li>${item === 'N/A' ? replacingText : item}</li>`).join('')}
        </ul>
      </div>
      <p>Runtime: <span class='answer'> ${data.Runtime === 'N/A' ? replacingText : data.Runtime}</span></p>
      <p>Director: <span class='answer'> ${data.Director === 'N/A' ? replacingText : data.Director}</span></p>
      <div>
        <span>Actors: </span>
        <ul>
          ${data.Actors.split(',').map((item) => `<li>${item === 'N/A' ? replacingText : item}</li>`).join('')}
        </ul>
      </div>
      <p>Country: <span class='answer'> ${data.Country === 'N/A' ? replacingText : data.Country}</span></p>
    </div>`;
    return descrElem;
  }

  replaceMovies(movieElementsList, movieDataList, totalResults) {
    this.domElement.innerHTML = '';
    this.addMovies(movieElementsList, movieDataList, totalResults);
  }
}
