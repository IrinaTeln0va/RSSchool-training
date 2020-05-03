const API_KEY = '2719f3d8';
const SERVER_URL = 'http://www.omdbapi.com/';
const DEFAULT_SEARCH = 'dream';

// const searchBtn = document.querySelector('.search-btn');

// searchBtn.addEventListener('click', onSearchBtnClick);

function onSearchBtnClick() {
  getMovieData();
}

function getMovieData(movieToSearch = DEFAULT_SEARCH) {
  console.log('sss');
  const url = `${SERVER_URL}?apikey=${API_KEY}&s=${movieToSearch}`;
  const whenMovieDataLoad = fetch(url);

  whenMovieDataLoad.
    then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`server error: ${response.status} ${response.statusText}`);
    }).
    then((data) => data.Search.map(getCardData)).
    then((data) => data.map(getImagePromise)).
    then((cardPromises) => Promise.all(cardPromises)).
    then((data) => data.map(addMovieRating)).
    then((cardPromises) => Promise.all(cardPromises)).
    then((data) => console.log(data)).
    catch((err) => console.error(err));
}

function addMovieRating(cardData) {
  const ratingUrl = `${SERVER_URL}?apikey=${API_KEY}&i=${cardData.id}`;
  return new Promise((onLoad, onError) => {
    fetch(ratingUrl).
      then((ratingResponse) => {
        return ratingResponse.json();
      }).
      then((movieData) => {
        cardData.rating = movieData.imdbRating;
        onLoad(cardData);
      }).
      catch((err) => console.log(`Rating loading Error: ${err}`));
  });
}

function getImagePromise(cardData) {
  return new Promise((onLoad, onError) => {
    const image = new Image();
    const src = cardData.posterSrc;
    cardData.posterSrc = image;
    cardData.posterSrc.onload = () => onLoad(cardData);
    cardData.posterSrc.onerror = () => onError('Error image loading');
    cardData.posterSrc.src = src;
  })
}

function getCardData(sourceDataItem) {
  return {
    title: sourceDataItem.Title,
    posterSrc: sourceDataItem.Poster,
    year: sourceDataItem.Year,
    id: sourceDataItem.imdbID,
  }
}


export { onSearchBtnClick };