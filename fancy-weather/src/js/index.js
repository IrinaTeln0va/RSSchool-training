import mapboxgl from 'mapbox-gl';
import description from './description';
import weatherIcons from './weather-icons';

mapboxgl.accessToken = 'pk.eyJ1IjoiaXJpbmF0ZWxub3ZhIiwiYSI6ImNrYXBlcmFzbzA5OWMycW1zdXJoOTU5dmUifQ.YK2bVQSU4q7qlBHn0Y6KPQ';

const LOCATION_TOKEN = 'e5f9df0b3ed443768d7eb43d6114eeee';
const LOCATION_URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${LOCATION_TOKEN}`;

const WEATHER_TOKEN = '9355c3a77b323122690b4fdb758ab08f';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/onecall?';

const CONVERT_PARAM = {
  froze: 32,
  quotient: 1.8,
};

function mapInit(latitude, longitude) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [longitude, latitude],
    zoom: 6,
  });

  new mapboxgl.Marker({ color: '#0000008f' })
    .setLngLat([longitude, latitude])
    .addTo(map);

  return map;
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

  const dateStr = new Date(timeZone.current_time).toLocaleString('en-GB', {
    hour12: false,
    timeZone: timeZone.name,
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  }).replace(/,/g, '');

  const timeStr = new Date(timeZone.current_time).toLocaleString('en-GB', {
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
    .then((data) => data.json())
    .then((data) => {
      const {
        latitude,
        longitude,
        country_name: countryName,
        city,
        time_zone: timeZone,
      } = data;

      mapInit(latitude, longitude);
      renderCoordsInfo(latitude, longitude);
      renderLocation(countryName, city);
      renderDate(timeZone);
      return data;
    })
    .then((data) => {
      const url = `${WEATHER_URL}lat=${data.latitude}&lon=${data.longitude}&%20exclude=daily&appid=${WEATHER_TOKEN}&units=metric`;
      return fetch(url);
    })
    .then((data) => data.json())
    .then((data) => {
      renderCurrentTemp(data.current);
      renderForecastTemp(data.daily);
    });
}

getUserLocation();
