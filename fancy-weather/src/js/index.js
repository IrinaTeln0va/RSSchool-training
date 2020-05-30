import mapboxgl from 'mapbox-gl';
import description from './description';
import weatherIcons from './weather-icons';

mapboxgl.accessToken = 'pk.eyJ1IjoiaXJpbmF0ZWxub3ZhIiwiYSI6ImNrYXBlcmFzbzA5OWMycW1zdXJoOTU5dmUifQ.YK2bVQSU4q7qlBHn0Y6KPQ';

const LOCATION_TOKEN = 'e5f9df0b3ed443768d7eb43d6114eeee';
const LOCATION_URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${LOCATION_TOKEN}`;

const WEATHER_TOKEN = '9355c3a77b323122690b4fdb758ab08f';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/onecall?';

const PIC_TOKEN = 'Rxwk5vPoJ_1mugZ58l7t-sA-xjgzDmANhFiUQaeUjHU';
const PIC_URL = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=winter,day,city&client_id=${PIC_TOKEN}`;

const GEOLOCATION_TOKEN = 'b5f099c6ab134b3a82cd095dd7c2e8d3';
const GEOLOCATION_URL = `https://api.opencagedata.com/geocode/v1/json?q=taganrog&key=${GEOLOCATION_TOKEN}&language=en&pretty=1`;

const CONVERT_PARAM = {
  froze: 32,
  quotient: 1.8,
};

let map;
let mapMarker;

function mapInit(latitude, longitude) {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [longitude, latitude],
    zoom: 6,
  });

  mapMarker = new mapboxgl.Marker({ color: '#0000008f' })
    .setLngLat([longitude, latitude])
    .addTo(map);

  return map;
}

function moveMapCenter(latitude, longitude) {
  map.jumpTo({ center: [longitude, latitude] });
  mapMarker.setLngLat([longitude, latitude]);
}

function formatCoord(coord) {
  const [deg, minute] = coord.split('.');
  return `${deg}°${minute}'`;
}

function renderCoordsInfo(latitude, longitude) {
  const latitudeElem = document.querySelector('.latitude-value');
  const longitudeElem = document.querySelector('.longitude-value');

  const latitudeValue = formatCoord(Number(latitude).toFixed(2));
  const longitudeValue = formatCoord(Number(longitude).toFixed(2));

  latitudeElem.innerText = latitudeValue;
  longitudeElem.innerText = longitudeValue;
}

function renderLocation(city, country) {
  const locationElem = document.querySelector('.location-name');
  locationElem.innerHTML = `${city}, ${country}`;
}

function renderDate(timeZone) {
  const dateElem = document.querySelector('.date-item.date');
  const timeElem = document.querySelector('.date-item.time');

  const dateStr = new Date().toLocaleString('en-GB', {
    hour12: false,
    timeZone: timeZone.name,
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  }).replace(/,/g, '');

  const timeStr = new Date().toLocaleString('en-GB', {
    hour12: false,
    timeZone: timeZone.name,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  dateElem.innerText = dateStr;
  timeElem.innerText = timeStr;
}

function convertPharIntoDeg(tempInDeg) {
  return (tempInDeg - CONVERT_PARAM.froze) / CONVERT_PARAM.quotient;
}

function renderCurrentTemp(temp) {
  const dayTempElem = document.querySelector('.weather-performance');
  const tempValueElem = dayTempElem.querySelector('.value');
  const weatherStateElem = dayTempElem.querySelector('.weather-state');
  const weatherFeelingElem = dayTempElem.querySelector('.weather-feeling .value');
  const weatherWindElem = dayTempElem.querySelector('.weather-wind .value');
  const weatherHumidityElem = dayTempElem.querySelector('.weather-humidity .value');
  const weatherPictureElem = dayTempElem.querySelector('.current-weather-image');

  tempValueElem.innerText = temp.temp.toFixed();
  weatherStateElem.innerText = temp.weather[0].description;
  weatherFeelingElem.innerText = temp.feels_like.toFixed();
  weatherWindElem.innerText = temp.wind_speed;
  weatherHumidityElem.innerText = temp.humidity;
  weatherPictureElem.innerHTML = weatherIcons[temp.weather[0].id];
}

function getAverageTemp(dailyTemp) {
  const minTemp = dailyTemp.temp.min;
  const maxTemp = dailyTemp.temp.max;
  const average = (maxTemp + minTemp) / 2;
  return average.toFixed();
}

function renderForecastTemp(dailyTemp) {
  const forecastElemList = document.querySelectorAll('.forecast-value');
  const forecastIconsList = document.querySelectorAll('.day-temperature-icon');

  forecastElemList.forEach((elem, index) => {
    const valueElem = elem;
    valueElem.innerText = getAverageTemp(dailyTemp[index + 1]);
  });

  forecastIconsList.forEach((elem, index) => {
    const valueElem = elem;
    const iconId = dailyTemp[index + 1].weather[0].id;
    valueElem.innerHTML = weatherIcons[iconId];
  });
}

function getUserLocation() {
  return fetch(LOCATION_URL)
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
      const pageData = {
        latitude: data.latitude,
        longitude: data.longitude,
        countryName: data.country_name,
        city: data.city,
        timeZone: data.time_zone,
      };

      mapInit(pageData.latitude, pageData.longitude);
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
    .catch(() => {
      throw new Error('Openweathermap not responding');
    })
    .then((data) => {
      renderCurrentTemp(data.current);
      renderForecastTemp(data.daily);
    })
    .catch((err) => console.log(err));
}

getUserLocation();

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');

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

searchForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const searchValue = searchInput.value;
  onUserSearch(searchValue);
});
