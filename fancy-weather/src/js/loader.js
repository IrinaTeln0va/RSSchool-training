const LOCATION_TOKEN = 'e5f9df0b3ed443768d7eb43d6114eeee';
const LOCATION_URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${LOCATION_TOKEN}`;

const WEATHER_TOKEN = '9355c3a77b323122690b4fdb758ab08f';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/onecall?';

const PIC_TOKEN = 'Rxwk5vPoJ_1mugZ58l7t-sA-xjgzDmANhFiUQaeUjHU';
const PIC_URL = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=winter,day,city&client_id=${PIC_TOKEN}`;

const GEOLOCATION_TOKEN = 'b5f099c6ab134b3a82cd095dd7c2e8d3';
const GEOLOCATION_URL = `https://api.opencagedata.com/geocode/v1/json?q=taganrog&key=${GEOLOCATION_TOKEN}&language=en&pretty=1`;

function checkResponseStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  if (response.status === 403 || response.status === 401) {
    throw new Error('Status 401. Try another API key');
  }

  throw new Error(`Server error: ${response.status} ${response.statusText}`);
}

function checkPictureStatus(response) {
  const errorMessage = 'Standard picture is shown';

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  if (response.status === 403 || response.status === 401) {
    throw new Error('API key limit for picture exceeded. Standard picture is shown');
  }

  throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorMessage}`);
}

export default class Loader {
  static getLocationFromIP() {
    return fetch(LOCATION_URL)
      .then((response) => checkResponseStatus(response));
  }

  static getPicture(season, dayPart, city) {
    return fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${season},${dayPart}${city ? `,${city}` : ''}&client_id=${PIC_TOKEN}`)
      .then((response) => {
        console.info(`Keywords for picture searching: ${season}, ${dayPart}${city ? `, ${city}` : ''}`);
        return checkPictureStatus(response);
      })
      .catch((err) => {
        return {
          urls: {
            regular: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            error: err,
          },
        };
      });
  }

  static loadPicture(pictureURL) {
    return new Promise((resolve) => {
      const backgroundElem = document.querySelector('.body-background img');

      backgroundElem.src = pictureURL;
      backgroundElem.addEventListener('load', () => {
        resolve();
      }, { once: true });
    });
  }

  static getWeather(location) {
    const { latitude, longitude } = location;
    const url = `${WEATHER_URL}lat=${latitude}&lon=${longitude}&%20exclude=daily&appid=${WEATHER_TOKEN}&units=metric`;

    return fetch(url)
      .then((response) => checkResponseStatus(response))
      .catch ((err) => {
        if (err && String(err) !== 'TypeError: Failed to fetch') {
          throw new Error(err);
        } else {
          throw new Error('Openweathermap not responding. Try again later');
        }
      });
  }

  static getLocationFromSearch(city) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${GEOLOCATION_TOKEN}&language=en&pretty=1`;

    return fetch(url)
      .then((response) => checkResponseStatus(response))
      .then((data) => {
        const results = data.results[0];
        if (data.total_results === 0) {
          throw new Error('Sorry, no results for your search');
        }
        return results;
      });
  }
}

// function getUserLocation() {
//   // return fetch(LOCATION_URL)
//   //   .then((response) => {
//   //     if (response.status >= 200 && response.status < 300) {
//   //       return response.json();
//   //     }

//   //     if (response.status === 401) {
//   //       throw new Error('Status 401. Try another API key');
//   //     }

//   //     throw new Error(`Server error: ${response.status} ${response.statusText}`);
//   //   })
//     .then((data) => {
//       const pageData = {
//         latitude: data.latitude,
//         longitude: data.longitude,
//         countryName: data.country_name,
//         city: data.city,
//         timeZone: data.time_zone,
//       };

//       mapInit(pageData.latitude, pageData.longitude);
//       renderCoordsInfo(pageData.latitude, pageData.longitude);
//       renderLocation(pageData.countryName, pageData.city);
//       renderDate(pageData.timeZone);
//       return pageData;
//     })
//     .then((data) => {
//       // return fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=winter,day,${data.city}&client_id=${PIC_TOKEN}`)
//       //   .then((response) => {
//       //     if (response.status >= 200 && response.status < 300) {
//       //       return response.json();
//       //     }

//       //     if (response.status === 401) {
//       //       throw new Error('Status 401. Try another API key');
//       //     }

//       //     throw new Error(`Server error: ${response.status} ${response.statusText}`);
//       //   })
//       //   .then((picture) => {
//       //     data.picture = picture.urls.regular;
//       //     return data;
//       //   });
//     })
//     .then((data) => {
//       // return new Promise((resolve, reject) => {
//       //   const backgroundElem = document.querySelector('.body-background img');

//       //   backgroundElem.src = data.picture;
//       //   backgroundElem.addEventListener('load', () => {
//       //     resolve(data);
//       //   }, { once: true });
//       // });
//     })
//     .then((data) => {
//     //   const url = `${WEATHER_URL}lat=${data.latitude}&lon=${data.longitude}&%20exclude=daily&appid=${WEATHER_TOKEN}&units=metric`;

//     //   return fetch(url);
//     // })
//     // .then((response) => {
//     //   if (response.status >= 200 && response.status < 300) {
//     //     return response.json();
//     //   }

//     //   if (response.status === 401) {
//     //     throw new Error('Status 401. Try another API key');
//     //   }

//     //   throw new Error(`Server error: ${response.status} ${response.statusText}`);
//     // })
//     // .catch(() => {
//     //   throw new Error('Openweathermap not responding');
//     // })
//     .then((data) => {
//       renderCurrentTemp(data.current);
//       renderForecastTemp(data.daily);
//     })
//     .catch((err) => console.log(err));
// }