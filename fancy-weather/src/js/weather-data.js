import description from './description';
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

  // updatePage(data) {
  //   this.currentPageData = data;
  // }

  updateUserLocation(location, onSearch) {
    this.currentPageData.location = onSearch
      ? this.constructor.convertSearchData(location)
      : this.constructor.convertLocationData(location);
  }

  updatePicture(pictureURL) {
    this.currentPageData.pictureURL = pictureURL;
  }

  // updateWeather(current, forecast) {
  //   this.updateCurrentWeather(current);
  //   this.updateForecastWeather(forecast);
  // }

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
    // const forecastList = this.currentPageData.weather.forecast;

    // forecastList.forEach((elem) => {
    //   const forecastItem = elem;
    //   const iconId = elem.weather[0].id;

    //   forecastItem.icon = weatherIcons[iconId];
    //   forecastItem.temp = this.constructor.getAverageTemp(forecastItem);
    // });
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
      city: apiLocationData.city,
      countryName: apiLocationData.country_name,
      latitude: apiLocationData.latitude,
      longitude: apiLocationData.longitude,
      timeZone: apiLocationData.time_zone,
    };
  }

  static convertSearchData(apiLocationData) {
    const pageData = {
      latitude: apiLocationData.geometry.lat,
      longitude: apiLocationData.geometry.lng,
      countryName: apiLocationData.components.country,
      city: apiLocationData.components.city
        || apiLocationData.components.town
        || apiLocationData.components.county
        || apiLocationData.components.village
        || apiLocationData.components.state,
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
      language: 'ru',
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
            weekDay: 'Tuesday',
            temp: 10,
            icon: weatherIcons['200'],
          },
          {
            weekDay: 'Tuesday',
            temp: 12,
            icon: weatherIcons['700'],
          },
        ],
      },
    };
  }
}




// getUserLocation();

function onUserSearch(city) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${GEOLOCATION_TOKEN}&language=en&pretty=1`;

  fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }

      if (response.status === 401) {
        throw new Error('Status 401. Try another API key');
      }

      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    })
    .then((data) => {
      const results = data.results[0];
      if (data.total_results === 0) {
        throw new Error('Sorry, no results for your search');
      }
      const pageData = {
        latitude: results.geometry.lat,
        longitude: results.geometry.lng,
        countryName: results.components.country,
        city: results.components.city
          || results.components.town
          || results.components.county
          || results.components.village,
        timeZone: results.annotations.timezone,
      };

      moveMapCenter(pageData.latitude, pageData.longitude);
      renderCoordsInfo(pageData.latitude, pageData.longitude);
      renderLocation(pageData.countryName, pageData.city);
      renderDate(pageData.timeZone);
      return pageData;
    })
    .then((data) => {
      return fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=winter,day,${data.city}&client_id=${PIC_TOKEN}`)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          }

          if (response.status === 401) {
            throw new Error('Status 401. Try another API key');
          }

          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        })
        .then((picture) => {
          data.picture = picture.urls.regular;
          return data;
        });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        const backgroundElem = document.querySelector('.body-background img');

        backgroundElem.src = data.picture;
        backgroundElem.addEventListener('load', () => {
          resolve(data);
        }, { once: true });
      });
    })
    .then((data) => {
      const url = `${WEATHER_URL}lat=${data.latitude}&lon=${data.longitude}&%20exclude=daily&appid=${WEATHER_TOKEN}&units=metric`;

      return fetch(url);
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }

      if (response.status === 401) {
        throw new Error('Status 401. Try another API key');
      }

      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    })
    .catch((err) => {
      console.log(err);
      // throw new Error('Openweathermap not responding');
    })
    .then((data) => {
      renderCurrentTemp(data.current);
      renderForecastTemp(data.daily);
    })
    .catch((err) => console.log(err));
}