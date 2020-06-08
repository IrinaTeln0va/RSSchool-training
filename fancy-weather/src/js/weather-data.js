import weatherIcons from './weather-icons';

export default class WeatherData {
  constructor() {
    this.currentSettings = null;
    this.currentPageData = null;

    this.init();
  }

  init() {
    this.currentSettings = this.constructor.getDefaultSettings();
    this.currentPageData = this.constructor.getDefaultPageData();
  }

  updateUserLocation(location, onSearch) {
    this.currentPageData.location = onSearch
      ? this.constructor.convertSearchData(location)
      : this.constructor.convertLocationData(location);
  }

  updatePicture(pictureURL) {
    this.currentPageData.pictureURL = pictureURL;
  }

  updateCurrentWeather(current) {
    this.currentPageData.weather.current = this.constructor.convertWeatherData(current);
    this.currentPageData.weather.current.icon = weatherIcons[current.weather[0].id];
  }

  updateForecastWeather(forecast) {
    this.currentPageData.weather.forecast = forecast.map((elem) => {
      const forecastItem = elem;
      const iconId = elem.weather[0].id;

      forecastItem.icon = weatherIcons[iconId];
      forecastItem.temp = this.constructor.getAverageTemp(forecastItem);
      return forecastItem;
    });
  }

  changeLang(lang) {
    this.currentSettings.language = lang;
  }

  changeTempUnits(value) {
    this.currentSettings.tempUnits = value;
  }

  static convertWeatherData(apiWeatherData) {
    return {
      descr: apiWeatherData.weather[0].description,
      feltTemp: apiWeatherData.feels_like.toFixed(),
      humidity: apiWeatherData.humidity,
      temp: apiWeatherData.temp.toFixed(),
      wind: apiWeatherData.wind_speed,
    };
  }

  static convertLocationData(apiLocationData) {
    return {
      city: apiLocationData.city || '',
      countryName: apiLocationData.country_name || '',
      latitude: apiLocationData.latitude,
      longitude: apiLocationData.longitude,
      timeZone: apiLocationData.time_zone,
    };
  }

  static convertSearchData(apiLocationData) {
    const pageData = {
      latitude: apiLocationData.geometry.lat,
      longitude: apiLocationData.geometry.lng,
      countryName: apiLocationData.components.country || '',
      city: apiLocationData.components.city
        || apiLocationData.components.town
        || apiLocationData.components.county
        || apiLocationData.components.village
        || apiLocationData.components.state
        || '',
      timeZone: apiLocationData.annotations.timezone,
    };

    return pageData;
  }

  static getAverageTemp(dailyTemp) {
    const minTemp = dailyTemp.temp.min;
    const maxTemp = dailyTemp.temp.max;
    const average = (maxTemp + minTemp) / 2;

    return average.toFixed();
  }

  static getDefaultSettings() {
    return {
      language: 'EN',
      tempUnits: 'deg',
    };
  }

  static getDefaultPageData() {
    return {
      location: {
        latitude: 53.902334,
        longitude: 27.5618791,
        countryName: 'Belarus',
        city: 'Minsk',
        timeZone: {
          name: 'Europe/Minsk',
        },
      },
      pictureURL: '../assets/img/example-bg.png',
      weather: {
        current: {
          temp: 10,
          descr: 'overcast',
          feltTemp: 7,
          wind: 2,
          humidity: 83,
          icon: weatherIcons['803'],
        },
        forecast: [
          {
            weekDay: 'Tuesday',
            temp: 7,
            icon: weatherIcons['300'],
          },
          {
            weekDay: 'Wednesday',
            temp: 10,
            icon: weatherIcons['200'],
          },
          {
            weekDay: 'Thursday',
            temp: 12,
            icon: weatherIcons['700'],
          },
        ],
      },
    };
  }
}
