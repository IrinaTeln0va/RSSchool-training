import WeatherView from './weather-view';
import WeatherData from './weather-data';
import Loader from './loader';
import Voice from './voice';

const SECOND = 1000;
const DEFAULT_LANG = 'en';

export default class WeatherController {
  constructor() {
    this.constructor.showPreloader();
    this.weatherData = new WeatherData();
    this.weatherView = new WeatherView(this.weatherData.currentPageData, this.weatherData.currentSettings);
    this.voiceForecast = new Voice();
    this.init();
  }

  init() {
    this.initialData = this.getInitialData()
      .then((ifError) => {
        this.getSettingsFromStorage();
        this.updateWeatherView(ifError);
        this.bind();
        this.setTimer();
        this.constructor.hidePreloader();
      });
  }

  bind() {
    this.weatherView.onUserSearch = (searchValue) => {
      this.constructor.showPreloader();
      this.updatePageData(searchValue);
    };
    this.weatherView.onBgUpdate = () => {
      return this.loadPicture('withoutCityKeyword')
        .then((pictureElem) => {
          this.weatherData.currentPageData.pictureElem = pictureElem;
          this.weatherView.constructor.updateBgPicture(pictureElem);
        });
    };
    this.weatherView.onLangChoice = (targetLang, wordsToTranslate) => {
      const currentLanguage = this.weatherData.currentSettings.language.toLowerCase();
      const targetLanguage = targetLang.toLowerCase();

      this.weatherData.changeLang(targetLang);
      localStorage.settings = JSON.stringify(this.weatherData.currentSettings);
      this.updateViewLanguage(wordsToTranslate, currentLanguage, targetLanguage);
    };
    this.weatherView.onTempUnitsChange = (value) => {
      this.weatherData.changeTempUnits(value);
      localStorage.settings = JSON.stringify(this.weatherData.currentSettings);
    };
    this.weatherView.onVoiceClick = () => {
      this.voiceForecast.speak(this.weatherData.currentSettings.language);
    };
  }

  static showPreloader() {
    const overlay = document.querySelector('.background-overlay');
    overlay.classList.add('preload');
  }

  static hidePreloader() {
    const overlay = document.querySelector('.background-overlay');
    overlay.classList.remove('preload');
  }

  getSettingsFromStorage() {
    if (!localStorage.settings) {
      localStorage.setItem('settings', JSON.stringify(this.weatherData.currentSettings));
    } else {
      this.weatherData.currentSettings = JSON.parse(localStorage.getItem('settings'));
    }
  }

  setTimer() {
    // let timer44;

    const setTimerTimeout = () => {
      setTimeout(() => {
        this.weatherView.renderTime(this.weatherData.currentPageData.location.timeZone);
        setTimerTimeout();
      }, SECOND);
    };

    setTimerTimeout();
  }

  getInitialData() {
    return Loader.getLocationFromIP()
      .then((data) => this.getDataFromLocation(data))
      .catch((err) => {
        this.weatherView.constructor.showErrorMessage(err);
        return 'error';
      });
  }

  updatePageData(searchValue) {
    this.getNewSearchData(searchValue)
      .then((ifError) => this.updateWeatherView(ifError));
  }

  getNewSearchData(searchValue) {
    return Loader.getLocationFromSearch(searchValue)
      .then((data) => this.getDataFromLocation(data, 'onSearch'))
      .catch((err) => {
        this.weatherView.constructor.showErrorMessage(err);
        return 'error';
      })
      .finally(() => this.constructor.hidePreloader());
  }

  getDataFromLocation(data, isOnSearch) {
    this.weatherData.updateUserLocation(data, isOnSearch);
    return this.loadPicture()
      .then((pictureElem) => {
        this.weatherData.currentPageData.pictureElem = pictureElem;
        return Loader.getWeather(this.weatherData.currentPageData.location);
      })
      .then((weather) => {
        this.weatherData.updateCurrentWeather(weather.current);
        this.weatherData.updateForecastWeather(weather.daily.slice(1, 4));
      });
  }

  loadPicture(withoutCityKeyword) {
    const season = this.constructor.getSeason(this.weatherData.currentPageData.location);
    const dayPart = this.constructor.getDayPart(this.weatherData.currentPageData.location.timeZone);
    const { city } = withoutCityKeyword ? '' : this.weatherData.currentPageData.location;

    return Loader.getPicture(season, dayPart, city)
      .then((picture) => {
        if (picture.urls.error) {
          this.weatherView.constructor.showErrorMessage(picture.urls.error);
        } else {
          this.weatherData.updatePicture(picture.urls.regular);
          return Loader.loadPicture(picture.urls.regular);
        }
        return false;
      });
  }

  static getSeason(location) {
    const dateForTimezone = new Date().toLocaleString('en-US', {
      hour12: false,
      timeZone: location.timeZone.name,
    }).replace(/\b24/g, '00');
    const monthForTimezone = new Date(dateForTimezone).getMonth();
    const hemisphere = Number(location.latitude) < 0
      ? 'south'
      : 'north';

    switch (monthForTimezone) {
      case 0:
      case 1:
      case 11:
        return hemisphere === 'north' ? 'winter' : 'summer';

      case 2:
      case 3:
      case 4:
        return hemisphere === 'north' ? 'spring' : 'autumn';

      case 5:
      case 6:
      case 7:
        return hemisphere === 'north' ? 'summer' : 'winter';

      case 8:
      case 9:
      case 10:
        return hemisphere === 'north' ? 'autumn' : 'spring';

      default:
        return 'summer';
    }
  }

  static getDayPart(timeZone) {
    const dateForTimezone = new Date().toLocaleString('en-US', {
      hour12: false,
      timeZone: timeZone.name,
    }).replace(/\b24/g, '00');
    const hourForTimezone = new Date(dateForTimezone).getHours();

    if (hourForTimezone >= 0 && hourForTimezone < 6) {
      return 'night';
    } if (hourForTimezone >= 6 && hourForTimezone < 10) {
      return 'morning';
    } if (hourForTimezone >= 10 && hourForTimezone < 18) {
      return 'day';
    } if (hourForTimezone >= 18 && hourForTimezone < 24) {
      return 'evening';
    }

    return 'day';
  }

  updateWeatherView(ifError) {
    if (ifError) {
      this.updateViewLanguage();
      this.constructor.hidePreloader();
      return;
    }
    this.weatherView.updatePageOnSearch(this.weatherData.currentPageData, this.weatherData.currentSettings);
    this.updateViewLanguage();
    this.weatherView.switchPageTempUnits(this.weatherData.currentSettings.tempUnits);
    // this.constructor.hidePreloader();
  }

  updateViewLanguage(words, currentLanguage, targetLanguage) {
    const wordsToTranslate = words || this.weatherView.constructor.getWordsToTranslate();
    const currentLang = currentLanguage || DEFAULT_LANG;
    const targetLang = targetLanguage || this.weatherData.currentSettings.language.toLowerCase();

    if (currentLang === targetLang) {
      this.weatherView.renderOptions(this.weatherData.currentSettings);
      this.constructor.hidePreloader();
      return;
    }

    Loader.translate(wordsToTranslate, currentLang, targetLang)
      .then((translatedWords) => {
        const wordsList = translatedWords.split('@');
        this.weatherView.constructor.translatePage(wordsList);
        this.weatherView.renderOptions(this.weatherData.currentSettings);
      })
      .finally(() => this.constructor.hidePreloader());
  }
}
