let submitBtn = document.querySelector('#button');

let cityInput = document.querySelector('#city');
let currentCity = document.querySelector('#currentCity');
let currentTemp = document.querySelector('#currentTemp');
let currentWind = document.querySelector('#currentWind');
let currentHum = document.querySelector('#currentHum');
let currentUv = document.querySelector('#currentUv');
// let date1 = document.querySelector('#date1');
// let temp1 = document.querySelector('#temp1');
// let wind1 = document.querySelector('#wind1');
// let hum1 = document.querySelector('#hum1');
// let date2 = document.querySelector('#date1');
// let temp2 = document.querySelector('#temp2');
// let wind2 = document.querySelector('#wind2');
// let hum2 = document.querySelector('#hum2');
// let date3 = document.querySelector('#date1');
// let temp3 = document.querySelector('#temp3');
// let wind3 = document.querySelector('#wind3');
// let hum3 = document.querySelector('#hum3');
// let date4 = document.querySelector('#date1');
// let temp4 = document.querySelector('#temp4');
// let wind4 = document.querySelector('#wind4');
// let hum4 = document.querySelector('#hum4');
// let date5 = document.querySelector('#date1');
// let temp5 = document.querySelector('#temp5');
// let wind5 = document.querySelector('#wind5');
// let hum5 = document.querySelector('#hum5');



let formSubmitHandler = function (event) {
    event.preventDefault();

    let city = cityInput.value.trim();

    if (city) {
    getWeatherInfo(city);
    console.log(city);   
    } 
    else {
    alert('Please enter a city name');
    }  
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
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "1",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "2",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "3",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "4",
            temp: "",
            wind: "",
            humidity: ""
        },
        {
            day: "5",
            temp: "",
            wind: "",
            humidity: ""
        }
    ];

    let uv = weatherData.current.uvi;
    console.log(currentUv);
    weatherArray[0].temp = Math.round(((weatherData.current.temp - 273.15) * (9/5)) + 32);
    weatherArray[0].wind = weatherData.current.wind_speed;
    weatherArray[0].humidity = weatherData.current.humidity;


    for (let i = 1; i < weatherArray.length; i++) {
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

    for (let i = 1; i < weatherArray.length; i++) {
        // let date = `date${i}`;
        // let temp = `temp${i}`;
        // let wind = `wind${i}`;
        // let hum = `hum${i}`;

        let updateDate = document.getElementById(`date${i}`)
        let updateTemp = document.getElementById(`temp${i}`);
        let updateWind = document.getElementById(`wind${i}`);
        let updateHum = document.getElementById(`hum${i}`);

        updateDate.textContent = moment().add(i, 'days').format('M/D/YYYY');
        updateTemp.textContent = `${weatherArray[i].temp}°F`;
        updateWind.textContent = `${weatherArray[i].wind} MPH`;
        updateHum.textContent = `${weatherArray[i].humidity} %`;       
    }
}


submitBtn.addEventListener('click', formSubmitHandler);