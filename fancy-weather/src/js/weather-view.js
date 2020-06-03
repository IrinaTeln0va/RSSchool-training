// import mapboxgl from 'mapbox-gl';
import Map from './map';

const CONVERT_PARAM = {
  froze: 32,
  quotient: 1.8,
};

const langsList = ['EN', 'RU', 'BE'];

export default class WeatherView {
  constructor(data, settings) {
    this.formatSettings = settings;
    this.mapElem = new Map(data.location.latitude, data.location.longitude);
    this.hideMenu = this.hideMenu.bind(this);
    this.init(data);
  }

  init(data) {
    this.pageElements = this.constructor.findPageElements();
    this.renderPageContent(data, this.formatSettings);
    this.bind();
  }

  bind() {
    const searchForm = document.querySelector('.search-form');
    const updateBgBtn = document.querySelector('.update-bg-btn');
    this.langDropdown = document.querySelector('.lang-switcher');
    const tempUnitsSwitcher = document.querySelector('.units-switcher');

    searchForm.addEventListener('submit', this.formSubmitHandler.bind(this));
    updateBgBtn.addEventListener('click', this.updateBgBtnHandler.bind(this));
    this.langDropdown.addEventListener('click', this.langDropdownHandler.bind(this));
    tempUnitsSwitcher.addEventListener('mouseup', this.tempUnitsChangeHandler.bind(this));
  }

  formSubmitHandler(evt) {
    evt.preventDefault();

    const searchInput = document.querySelector('.search-input');
    const searchValue = searchInput.value;

    this.onUserSearch(searchValue);
  }

  updateBgBtnHandler() {
    this.onBgUpdate();
  }

  tempUnitsChangeHandler(evt) {
    if (
      evt.target.closest('.units-label')
      && this.constructor.isTargetInputChecked(evt.target)
    ) {
      return;
    }

    const value = this.constructor.getValueFromCheckedInput();

    this.onTempUnitsChange(value);
    this.switchPageTempUnits(value);
  }

  switchPageTempUnits(value) {
    const currentTemp = document.querySelector('.current-weather .value');
    const currentTempUnits = document.querySelector('.current-weather-unit');
    this.changeUnitsValue(currentTemp, currentTempUnits, value);

    const feltTemp = document.querySelector('.weather-feeling .value');
    const feltTempUnits = document.querySelector('.feeling-weather-unit');
    this.changeUnitsValue(feltTemp, feltTempUnits, value);

    const forecastTempList = document.querySelectorAll('.forecast-value');
    [...forecastTempList].forEach((item) => {
      const unit = item.nextElementSibling;
      this.changeUnitsValue(item, unit, value);
    });
  }

  static isTargetInputChecked(label) {
    const labelName = label.getAttribute('for');
    const targetInput = document.querySelector(`#${labelName}`);
    return targetInput.checked;
  }

  changeUnitsValue(valueElem, unitsElem, value) {
    const currentElem = valueElem;
    const currentUnitsElem = unitsElem;

    currentElem.innerText = value === 'deg'
      ? this.constructor.convertPharIntoDeg(currentElem.innerText)
      : this.constructor.convertDegIntoPhar(currentElem.innerText);

    currentUnitsElem.innerText = value === 'deg'
      ? currentUnitsElem.innerText = '°C'
      : currentUnitsElem.innerText = '°F';
  }

  static getValueFromCheckedInput() {
    const degInput = document.querySelector('#options-units-degrees');
    return degInput.checked === true ? 'phar' : 'deg';
  }

  langDropdownHandler(evt) {
    if (evt.target.classList.contains('lang-menu')
    && evt.target.closest('.active')) {
      this.langDropdown.classList.remove('active');
      return;
    }

    this.langDropdown.classList.add('active');

    document.body.addEventListener('mouseup', this.hideMenu);
  }

  hideMenu(evt) {
    if (evt.target.classList.contains('lang-option')) {
      const lang = evt.target.innerText;
      this.constructor.switchLang(lang);
      this.onLangChoice(lang);
    }

    if (!evt.target.classList.contains('lang-menu')) {
      this.langDropdown.classList.remove('active');
    }

    document.body.removeEventListener('mousedown', this.hideMenu);
  }

  static switchLang(lang) {
    const langOptionsList = document.querySelector('.lang-option-list');
    const langDropdown = document.querySelector('.lang-switcher');

    function getItemMurkup(langItem) {
      return `<li><a class="lang-option" href="#">${langItem}</a></li>`;
    }

    langDropdown.querySelector('.lang-menu').innerText = lang;
    langOptionsList.innerHTML = `
      ${langsList.filter((elem) => elem !== lang).map((langItem) => getItemMurkup(langItem)).join('')}`;
  }

  updatePageOnSearch(data, settings) {
    this.moveMapCenter(data.location.latitude, data.location.longitude);
    this.renderPageContent(data, settings);
  }

  moveMapCenter(latitude, longitude) {
    this.mapElem.map.jumpTo({ center: [longitude, latitude] });
    this.mapElem.mapMarker.setLngLat([longitude, latitude]);
  }

  static showErrorMessage(error) {
    const errorElement = document.querySelector('.error-message');
    const searchInput = document.querySelector('.search-input');

    errorElement.querySelector('.error-text').innerText = `${error}`;
    errorElement.classList.add('active');
    document.body.addEventListener('mouseup', function hideMessage(evt) {
      if (evt.target.closest('.error-message') && !evt.target.closest('.error-btn')) {
        return;
      }

      errorElement.classList.remove('active');
      document.body.removeEventListener('mouseup', hideMessage);

      if (!evt.target.closest('.swiper-container') && !evt.target.closest('.list-container')) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', function hideErrorOnInput() {
      errorElement.classList.remove('active');
      searchInput.removeEventListener('input', hideErrorOnInput);
    });
    searchInput.focus();
  }

  onUserSearch() {
    throw new Error('method should be overriden', this);
  }

  onBgUpdate() {
    throw new Error('method should be overriden', this);
  }

  onLangChoice() {
    throw new Error('method should be overriden', this);
  }

  onTempUnitsChange() {
    throw new Error('method should be overriden', this);
  }

  static findPageElements() {
    const dayTempElem = document.querySelector('.weather-performance');

    return {
      tempValueElem: dayTempElem.querySelector('.value'),
      weatherStateElem: dayTempElem.querySelector('.weather-state'),
      weatherFeelingElem: dayTempElem.querySelector('.weather-feeling .value'),
      weatherWindElem: dayTempElem.querySelector('.weather-wind .value'),
      weatherHumidityElem: dayTempElem.querySelector('.weather-humidity .value'),
      weatherPictureElem: dayTempElem.querySelector('.current-weather-image'),
      latitudeElem: document.querySelector('.latitude-value'),
      longitudeElem: document.querySelector('.longitude-value'),
      locationElem: document.querySelector('.location-name'),
      dateElem: document.querySelector('.date-item.date'),
      timeElem: document.querySelector('.date-item.time'),
      forecastElemList: document.querySelectorAll('.forecast-value'),
      forecastIconsList: document.querySelectorAll('.day-temperature-icon'),
    };
  }

  renderPageContent(data, settings) {
    this.renderOptions(settings);
    this.constructor.updateBgPicture(data.pictureElem);
    this.renderCoordsInfo(data.location.latitude, data.location.longitude);
    this.renderLocation(data.location.city, data.location.countryName);
    this.renderDate(data.location.timeZone);
    this.renderCurrentTemp(data.weather.current);
    this.renderForecastTemp(data.weather.forecast);
    if (settings.tempUnits === 'phar') {
      this.switchPageTempUnits('phar');
    }
  }

  renderOptions(settings) {
    this.constructor.switchLang(settings.language);
    // if (this.constructor.getValueFromCheckedInput !== settings.tempUnits) {
      const unitsInputs = document.querySelectorAll('.units-switcher input');
      for (let i = 0; i < unitsInputs.length; i += 1) {
        if (unitsInputs[i].dataset.val === settings.tempUnits) {
          unitsInputs[i].checked = true;
          return;
        }
      }
    // }
  }

  static updateBgPicture(pictureElem) {
    const backgroundElem = document.querySelector('.body-background img');

    if (pictureElem) {
      backgroundElem.replaceWith(pictureElem);
    }
  }

  renderCoordsInfo(latitude, longitude) {
    const latitudeValue = this.constructor.formatCoord(Number(latitude).toFixed(2));
    const longitudeValue = this.constructor.formatCoord(Number(longitude).toFixed(2));

    this.pageElements.latitudeElem.innerText = latitudeValue;
    this.pageElements.longitudeElem.innerText = longitudeValue;
  }

  renderLocation(city, country) {
    const { locationElem } = this.pageElements;
    locationElem.innerHTML = `${city}, ${country}`;
  }

  renderDate(timeZone) {
    const { dateElem, timeElem } = this.pageElements;

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

  renderCurrentTemp(currentTempState) {
    // this.pageElements.tempValueElem.innerText = currentTempState.temp.toFixed();
    // this.pageElements.weatherStateElem.innerText = currentTempState.weather[0].description;
    // this.pageElements.weatherFeelingElem.innerText = currentTempState.feels_like.toFixed();
    // this.pageElements.weatherWindElem.innerText = currentTempState.wind_speed;
    // this.pageElements.weatherHumidityElem.innerText = currentTempState.humidity;
    // this.pageElements.weatherPictureElem.innerText = currentTempState.icon;
    // this.pageElements.weatherPictureElem.innerText = weatherIcons[temp.weather[0].id];

    this.pageElements.tempValueElem.innerText = Number(currentTempState.temp).toFixed();
    this.pageElements.weatherStateElem.innerText = currentTempState.descr;
    this.pageElements.weatherFeelingElem.innerText = Number(currentTempState.feltTemp).toFixed();
    this.pageElements.weatherWindElem.innerText = Number(currentTempState.wind);
    this.pageElements.weatherHumidityElem.innerText = Number(currentTempState.humidity);
    this.pageElements.weatherPictureElem.innerHTML = currentTempState.icon;
  }

  renderForecastTemp(dailyTemp) {
    const { forecastElemList, forecastIconsList } = this.pageElements;

    forecastElemList.forEach((elem, index) => {
      const valueElem = elem;
      valueElem.innerText = dailyTemp[index].temp;
    });

    forecastIconsList.forEach((elem, index) => {
      const valueElem = elem;
      valueElem.innerHTML = dailyTemp[index].icon;

      // const iconId = dailyTemp[index].weather[0].id;
      // valueElem.innerHTML = weatherIcons[iconId];
    });
  }

  static formatCoord(coord) {
    const [deg, minute] = coord.split('.');
    return `${deg}°${minute}'`;
  }

  static convertPharIntoDeg(tempInPhar) {
    const value = (tempInPhar - CONVERT_PARAM.froze) / CONVERT_PARAM.quotient;
    return value.toFixed(0);
  }

  static convertDegIntoPhar(tempInDeg) {
    const value = tempInDeg * CONVERT_PARAM.quotient + CONVERT_PARAM.froze;
    return value.toFixed(0);
  }
}

// let map;
// let mapMarker;

// function mapInit(latitude, longitude) {
//   map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v9',
//     center: [longitude, latitude],
//     zoom: 6,
//   });

//   mapMarker = new mapboxgl.Marker({ color: '#0000008f' })
//     .setLngLat([longitude, latitude])
//     .addTo(map);

//   return map;
// }

// function moveMapCenter(latitude, longitude) {
//   map.jumpTo({ center: [longitude, latitude] });
//   mapMarker.setLngLat([longitude, latitude]);
// }

// function formatCoord(coord) {
//   const [deg, minute] = coord.split('.');
//   return `${deg}°${minute}'`;
// }

// function renderCoordsInfo(latitude, longitude) {
//   const latitudeElem = document.querySelector('.latitude-value');
//   const longitudeElem = document.querySelector('.longitude-value');

//   const latitudeValue = formatCoord(Number(latitude).toFixed(2));
//   const longitudeValue = formatCoord(Number(longitude).toFixed(2));

//   latitudeElem.innerText = latitudeValue;
//   longitudeElem.innerText = longitudeValue;
// }

// function renderLocation(city, country) {
//   const locationElem = document.querySelector('.location-name');
//   locationElem.innerHTML = `${city}, ${country}`;
// }

// function renderDate(timeZone) {
//   const dateElem = document.querySelector('.date-item.date');
//   const timeElem = document.querySelector('.date-item.time');

//   const dateStr = new Date().toLocaleString('en-GB', {
//     hour12: false,
//     timeZone: timeZone.name,
//     weekday: 'short',
//     month: 'long',
//     day: 'numeric',
//   }).replace(/,/g, '');

//   const timeStr = new Date().toLocaleString('en-GB', {
//     hour12: false,
//     timeZone: timeZone.name,
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//   });

//   dateElem.innerText = dateStr;
//   timeElem.innerText = timeStr;
// }

// function convertPharIntoDeg(tempInDeg) {
//   return (tempInDeg - CONVERT_PARAM.froze) / CONVERT_PARAM.quotient;
// }

// function renderCurrentTemp(temp) {
//   const dayTempElem = document.querySelector('.weather-performance');
//   const tempValueElem = dayTempElem.querySelector('.value');
//   const weatherStateElem = dayTempElem.querySelector('.weather-state');
//   const weatherFeelingElem = dayTempElem.querySelector('.weather-feeling .value');
//   const weatherWindElem = dayTempElem.querySelector('.weather-wind .value');
//   const weatherHumidityElem = dayTempElem.querySelector('.weather-humidity .value');
//   const weatherPictureElem = dayTempElem.querySelector('.current-weather-image');

//   tempValueElem.innerText = temp.temp.toFixed();
//   weatherStateElem.innerText = temp.weather[0].description;
//   weatherFeelingElem.innerText = temp.feels_like.toFixed();
//   weatherWindElem.innerText = temp.wind_speed;
//   weatherHumidityElem.innerText = temp.humidity;
//   weatherPictureElem.innerHTML = weatherIcons[temp.weather[0].id];
// }

// function getAverageTemp(dailyTemp) {
//   const minTemp = dailyTemp.temp.min;
//   const maxTemp = dailyTemp.temp.max;
//   const average = (maxTemp + minTemp) / 2;
//   return average.toFixed();
// }

// function renderForecastTemp(dailyTemp) {
//   const forecastElemList = document.querySelectorAll('.forecast-value');
//   const forecastIconsList = document.querySelectorAll('.day-temperature-icon');

//   forecastElemList.forEach((elem, index) => {
//     const valueElem = elem;
//     valueElem.innerText = getAverageTemp(dailyTemp[index + 1]);
//   });

//   forecastIconsList.forEach((elem, index) => {
//     const valueElem = elem;
//     const iconId = dailyTemp[index + 1].weather[0].id;
//     valueElem.innerHTML = weatherIcons[iconId];
//   });
// }

// const searchForm = document.querySelector('.search-form');
// const searchInput = document.querySelector('.search-input');

// searchForm.addEventListener('submit', (evt) => {
//   evt.preventDefault();
//   const searchValue = searchInput.value;
//   onUserSearch(searchValue);
// });