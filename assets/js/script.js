let submitBtn = document.querySelector('#button');
let $history = $('.list-group');

let cityInput = document.querySelector('#city');
let currentCity = document.querySelector('#currentCity');
let currentTemp = document.querySelector('#currentTemp');
let currentWind = document.querySelector('#currentWind');
let currentHum = document.querySelector('#currentHum');
let currentUv = document.querySelector('#currentUv');
let currentIcon = document.querySelector('#currentIcon');

let cityNames = [];

init();

function init(){

    let storedCities = JSON.parse(localStorage.getItem("cities"));

    if(storedCities !== null) {
        cityNames = storedCities;
        renderHistory(storedCities);       
    }
    
}

let renderHistory = function() {

    if (cityNames.lenght !== 0) {

        for (let i = 0; i < cityNames.length; i++) {

            let newButton = $('<li>');
            newButton.addClass('button list-group-item mt-3 border rounded-3 bg-secondary');
            newButton.attr('id', 'button');
            newButton.textContent = cityNames[i];
            $history.append(newButton);
        }  
    }
}

let addToHistory = newCity => {
    
    if ($('li').length = 9) {
        $history.children().eq(9).remove();
    }
    
    let newButton = $('<li>');
    newButton.addClass('button list-group-item mt-3 border rounded-3 bg-secondary');
    newButton.attr('id', 'button');
    newButton.text(newCity);
    $history.prepend(newButton);
}

let formSubmitHandler = function (event) {
    event.preventDefault();

    let city = cityInput.value.trim();
    cityNames.push(city);

    if (city) {
    
        getWeatherInfo(city);
        console.log(city);   
    } 
    else {

        alert('Please enter a city name');
    } 
    
    addToHistory(city);
}

let getWeatherInfo = function (location) {
    let lat;
    let long;
    let apiKey = "2c8a59c12a0f5d478caa56dfd4887203";     
    let queryUrl1 = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;
    
    fetch(queryUrl1)
        .then(response => {
            if (response.ok) {
                response.json()
                .then( data => {
                    lat = data.city.coord.lat;
                    long = data.city.coord.lon;
                    let queryUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&appid=${apiKey}`
                    return fetch(queryUrl2);
                })
                .then(response => {
                    if (response.ok) {
                        response.json()
                        .then(data => {
                            console.log(data);
                            renderWeather(data);
                        })
                    }
                })                
            }
        })
        .catch(error => {
            alert('Unable to connect to OpenWeather');
        });
}

let renderWeather = function (weatherData) {

    let weatherArray = [
        {
            day: "0",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "1",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "2",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "3",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "4",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "5",
            icon: "",
            temp: "",
            wind: "",
            humidity: ""
        }
    ];

    let uv = weatherData.current.uvi;
    weatherArray[0].icon = weatherData.current.weather["0"].icon;
    weatherArray[0].temp = Math.round(((weatherData.current.temp - 273.15) * (9/5)) + 32);
    weatherArray[0].wind = weatherData.current.wind_speed;
    weatherArray[0].humidity = weatherData.current.humidity;


    for (let i = 1; i < weatherArray.length; i++) {
        weatherArray[i].icon = weatherData.daily[i].weather["0"].icon;
        weatherArray[i].temp = Math.round(((weatherData.daily[i].temp.day - 273.15) * (9/5)) + 32);
        weatherArray[i].wind = weatherData.daily[i].wind_speed;
        weatherArray[i].humidity = weatherData.daily[i].humidity;      
    }

    console.log(weatherArray, uv);

    currentCity.textContent = `${cityInput.value.trim()} (${moment().format('M/D/YYYY')})`;
    currentTemp.textContent = `${weatherArray[0].temp}°F`;
    currentWind.textContent = `${weatherArray[0].wind} MPH`;
    currentHum.textContent = `${weatherArray[0].humidity} %`;
    currentUv.textContent = uv;
    currentIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherArray[0].icon}@2x.png" alt="current weather icon">`;

    if (uv <= 2) {
        currentUv.setAttribute('id', "low");
    }
    else if (uv <= 5) {
        currentUv.setAttribute('id', "med");
    }
    else if (uv <= 7) {
        currentUv.setAttribute('id', "high");
    }
    else {
        currentUv.setAttribute('id', "v-high");
    }

    for (let i = 1; i < weatherArray.length; i++) {

        let updateDate = document.getElementById(`date${i}`);
        let udpateIcon = document.getElementById(`icon${i}`);
        let updateTemp = document.getElementById(`temp${i}`);
        let updateWind = document.getElementById(`wind${i}`);
        let updateHum = document.getElementById(`hum${i}`);

        updateDate.textContent = moment().add(i, 'days').format('M/D/YYYY');
        udpateIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherArray[i].icon}@2x.png" alt="current weather icon">`;
        updateTemp.textContent = `${weatherArray[i].temp}°F`;
        updateWind.textContent = `${weatherArray[i].wind} MPH`;
        updateHum.textContent = `${weatherArray[i].humidity} %`;       
    }
}

submitBtn.addEventListener('click', formSubmitHandler);
