export default class ListView {
  constructor(movieElementsList, movieDataList) {
    this.movieElementsList = movieElementsList;
    this.movieDataList = movieDataList;
    this.domElement = document.querySelector('.list-container');
    this.init();
  }

  init() {
    this.addMovies(this.movieElementsList, this.movieDataList);
  }

  addMovies(movieElementsList, movieDataList) {
    movieElementsList.forEach((elem, index) => {
      elem.classList.add('list-view-movie');
      elem.style = '';
      elem.append(this.createMovieDescr(movieDataList[index]));
    })
    this.domElement.append(...movieElementsList);
  }

  createMovieDescr(data) {
    const descrElem = document.createElement('div');
    descrElem.classList.add('movie-desct');
    const replacingText = 'information would be provided at a later date'
    descrElem.innerHTML = `
    <p class='plot'>${data.Plot === 'N/A' ? replacingText : data.Plot}</p>
    <input id='${data.imdbID}' class='details-input' type='checkbox'>
    <label for='${data.imdbID}' class='details-switch'></label>
    <div class='descr-bottom-wrapper'>
      <p>Release date: <span class='answer'> ${data.Released === 'N/A' ? replacingText : data.Released}</span></p>
      <div>
        <span>Genre: </span>
        <ul>
          ${data.Genre.split(',').map((item) => `<li>${item === 'N/A' ? replacingText : item}</li>`).join(``)}
        </ul>
      </div>
      <p>Runtime: <span class='answer'> ${data.Runtime === 'N/A' ? replacingText : data.Runtime}</span></p>
      <p>Director: <span class='answer'> ${data.Director === 'N/A' ? replacingText : data.Director}</span></p>
      <div>
        <span>Actors: </span>
        <ul>
          ${data.Actors.split(',').map((item) => `<li>${item === 'N/A' ? replacingText : item}</li>`).join(``)}
        </ul>
      </div>
      <p>Country: <span class='answer'> ${data.Country === 'N/A' ? replacingText : data.Country}</span></p>
    </div>`;
    return descrElem;
  }

  replaceMovies(movieElementsList, movieDataList) {
    this.domElement.innerHTML = '';
    this.addMovies(movieElementsList, movieDataList);
  }
}