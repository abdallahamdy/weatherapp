var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var cityTitleEl = document.querySelector('.city-title');
var currentWeatherContainerDivEl = document.querySelector('.current-weather-container');

const apiKey = '3702d33f4a537da156160bc675dbd8b4';

var getCityData = function (city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&units=metric&appid=" + apiKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&count=5&appid=" + apiKey;

    // fetch current weather data
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            displayCurrentWeather(data, city);
            // console.dir(data);
        })
    })

    // fetch future weather data
    fetch(forecastURL).then(function(forecastResp) {
        forecastResp.json().then(function(forecastData) {
            console.dir("Forecasted Weather------");
            console.dir(forecastData);
            displayWeatherForecast(forecastData);
        })
    })

}

var displayCurrentWeather = function(weatherData) {

    var cityName = weatherData.name;
    var currCalendarDate = moment().subtract(10, 'days').calendar();
    
    var currWeatherIcon = weatherData.weather[0].icon;
    var iconURL = 'https://openweathermap.org/img/wn/' + currWeatherIcon + '@2x.png';
    
    // create icon as a new element
    var weatherIconEl = $("<img>").addClass("current-weather-icon");
    weatherIconEl.attr('src', iconURL);

    // update header with city name, date & icon
    cityTitleEl.textContent = weatherData.name + " (" + currCalendarDate + ")";
    
    // display current temperature
    var currTempEl = $("<h6>").addClass('currTemp');
    currTempEl.text('Temp: ' + weatherData.main.temp + " °C");

    // display current wind speed
    var currWindEl = $("<h6>").addClass('currWind');
    currWindEl.text('Wind: ' + weatherData.wind.speed + " KPH");
    
    // display current humidty
    var currHumidityEl = $("<h6>").addClass('currHumidity');
    currHumidityEl.text('Humidity: ' + weatherData.main.humidity + " %");

    // display current UV
    // var currUVEl = $("<h6>").addClass('currUV');
    // currUVEl.text('UV Index: ' + weatherData + " %");

    // append icon to city title
    cityTitleEl.appendChild(weatherIconEl[0]);
    $('.current-weather-container').append(currTempEl);
    $('.current-weather-container').append(currWindEl);
    $('.current-weather-container').append(currHumidityEl);
}

var displayWeatherForecast = function(forecastData) {

    $('.forecast-title').empty();
    $('.forecast-container').empty();

    var forecastTitleEl = $('<h4>').text('5-Day Forecast:');
    $('.forecast-title').append(forecastTitleEl);

    for (var i = 0; i < forecastData.list.length; i+=8) {
        
        var date = forecastData.list[i].dt_txt.match(/^(\S+)\s(.*)/).slice(0)[1];
        var icon = forecastData.list[i].weather[0].icon;
        var iconURL = 'https://openweathermap.org/img/wn/' + icon + '.png';

        var colDiv = $('<div>').addClass('col');
        var cardDiv = $('<div>').addClass('card');
        var cardBodyDiv = $('<div>').addClass('card-body');
        var hEl = $('<h5>').addClass('card-title').text(date);
        var iconEl = $("<img>").addClass("fore-icon");
        iconEl.attr('src', iconURL);
        var tempEl = $('<p>').addClass('card-text').text("Temp: " + forecastData.list[i].main.temp + " °C");
        var windEl = $('<p>').addClass('card-text').text("Wind: " + forecastData.list[i].wind.speed + " KPH");
        var humidityEl = $('<p>').addClass('card-text').text("Humidity " + forecastData.list[i].main.humidity + " %");

        cardBodyDiv.append(hEl);
        cardBodyDiv.append(iconEl);
        cardBodyDiv.append(tempEl);
        cardBodyDiv.append(windEl);
        cardBodyDiv.append(humidityEl);
        cardDiv.append(cardBodyDiv);
        colDiv.append(cardDiv);
        $('.forecast-container').append(colDiv);

    }
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        $('.city-title').empty();
        $('.current-weather-container').empty();
        $('.forecast-container').empty();

        // add city name to history card
        $('.form-card').append($('<h6>').addClass('history-entry').text(city));

        getCityData(city);
        cityInputEl.value = "";
    } else {
        alert("Incorrect entry.");
    }
};

cityFormEl.addEventListener("submit", formSubmitHandler);