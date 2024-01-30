

const apiKey = "71c2a3b799ac24bb2465239144c234cc";
const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=' + apiKey;

$(document).ready(function () {
  $('#search-form').submit(function (event) {
    event.preventDefault();
    const city = $('#search-input').val().trim();
    if (city !== '') {
      getWeatherData(city);
    }
  });
});




function getWeatherData(city) {
  
  const queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

  $.ajax({
    url: queryUrl,

  }).then(function (response) {

    displayWeather(response);
  });
}

function displayWeather(data) {

  const todaySection = $('#today');
  todaySection.empty();

  const cityName = data.name;
  const date = dayjs().format('MMMM D, YYYY');
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  const temperature = (data.main.temp - 273.15).toFixed(2);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const currentWeatherHtml = `
    <h2>${cityName} - ${date}</h2>
    <img src="${iconUrl}" alt="Weather Icon">
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  todaySection.html(currentWeatherHtml);

  
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  const Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  $.ajax({
    url: Url,
  }).then(function (Response) {
    const Section = $('#forecast');
    Section.empty();

    for (let i = 0; i < Response.list.length; i += 8) {
      const Data = Response.list[i];
      const Date = dayjs(Data.dt_txt).format('MMMM D, YYYY');
      const IconUrl = `https://openweathermap.org/img/wn/${Data.weather[0].icon}.png`;
      const Temperature = (Data.main.temp - 273.15).toFixed(2); 
      const Humidity = Data.main.humidity;

      const Html = `
        <div class="col-md-2">
          <h5>${Date}</h5>
          <img src="${IconUrl}" alt="Weather Icon">
          <p>Temp: ${Temperature} °C</p>
          <p>Humidity: ${Humidity}%</p>
        </div>
      `;

      Section.append(Html);
    }
  });
}


const storageKey = 'weatherSearchHistory';
let searchHistory = JSON.parse(localStorage.getItem(storageKey)) || [];


function ToLocalStorage(city) {

  if (searchHistory.includes(city)) {

    searchHistory.unshift(city);

    localStorage.setItem(storageKey, JSON.stringify(searchHistory));
  }
}

