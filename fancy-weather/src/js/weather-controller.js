import WeatherView from './weather-view';
import WeatherData from './weather-data';
import Loader from './loader';

export default class WeatherController {
  constructor() {
    this.weatherData = new WeatherData();
    this.weatherView = new WeatherView(this.weatherData.currentPageData);
    this.init();
  }

  init() {
    this.initialData = this.getInitialData()
      .then((ifError) => {
        this.updateWeatherView(ifError);
        this.bind();
      });
  }

  bind() {
    this.weatherView.onUserSearch = (searchValue) => {
      this.updatePageData(searchValue);
    };
  }

  getInitialData() {
    return Loader.getLocationFromIP()
      .then((data) => {
        this.weatherData.updateUserLocation(data);
        return Loader.getPicture('', '', data.city);
      })
      .then((picture) => {
        this.weatherData.updatePicture(picture.urls.regular);
        Loader.loadPicture(picture.urls.regular);
      })
      .then(() => Loader.getWeather(this.weatherData.currentPageData.location))
      .then((weather) => {
        this.weatherData.updateCurrentWeather(weather.current);
        this.weatherData.updateForecastWeather(weather.daily.slice(1, 4));
      })
      .catch((err) => {
        this.weatherView.constructor.showErrorMessage(err);
        return 'error';
      });
  }

  // initWeatherView(isError) {
  //   if (isError) {
  //     return;
  //   }
  //   this.weatherView.renderPageContent(this.weatherData.currentPageData);
  // }

  updatePageData(searchValue) {
    this.getNewSearchData(searchValue)
      .then((ifError) => this.updateWeatherView(ifError));
  }

  getNewSearchData(searchValue) {
    return Loader.getLocationFromSearch(searchValue)
      .then((data) => {
        this.weatherData.updateUserLocation(data, 'onSearch');
        return Loader.getPicture('', '', data.city);
      })
      .then((picture) => {
        this.weatherData.updatePicture(picture.urls.regular);
        Loader.loadPicture(picture.urls.regular);
      })
      .then(() => Loader.getWeather(this.weatherData.currentPageData.location))
      .then((weather) => {
        this.weatherData.updateCurrentWeather(weather.current);
        this.weatherData.updateForecastWeather(weather.daily.slice(1, 4));
      })
      .catch((err) => {
        this.weatherView.constructor.showErrorMessage(err);
        return 'error';
      });
  }

  updateWeatherView(ifError) {
    if (ifError) {
      return;
    }
    this.weatherView.updatePageOnSearch(this.weatherData.currentPageData);
  }
}
