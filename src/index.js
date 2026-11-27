import "./styles.css";
// to import images use 
// import odinImage from "./odin.png";

let cityName;
let url;

const formRef = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn")
const checkBoxToggelForUnits = document.querySelector(".fahrenheit-or-celsius-toggle");
const errorMessageSpan = document.querySelector(".error-message");
const nameOfThePlaceInputField = document.querySelector(".name-of-the-place");
const body = document.querySelector("body")
const iconsDescription = ["snow", "rain", "fog", "wind", "cloudy", "partly-cloudy-day", "partly-cloudy-night", "clear-day", "clear-night"]

nameOfThePlaceInputField.addEventListener("input", function () {
    if (nameOfThePlaceInputField.validity.valueMissing) {
        errorMessageSpan.textContent = "The 'Name of the Place' field is required";
    }
    else {
        errorMessageSpan.textContent = "";
    }
})

async function fetchVisualCrossingWeatherAPI(url) {
    try {
        let fetchedData = await fetch(url)
        if (fetchedData.ok) {
            let jsonData = await fetchedData.json();
            console.log(jsonData);
            console.log('jsonData returned!');
            return jsonData;
        } else {
            console.log(`HTTP Response Code: ${fetchedData.status}`)
            throw new Error("Weather Data was not fetched successfully")
        }
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            // Unexpected token < in JSON
            console.log('There was a SyntaxError', error);
        } else {
            console.log('There was an error', error);
            errorMessageSpan.textContent = "Entered place was not found, please check spelling or enter correct name"
        }
    }


}

function fetchDataFromForm() {
    const formData = new FormData(formRef)
    let formDataValueIterator = formData.values();

    for (const value of formDataValueIterator) {
        return value;
    }

}

async function displayWeatherOnConsole(url) {
    try {
        const weatherData = await fetchVisualCrossingWeatherAPI(url)
        console.log(`Max Temperature: ${weatherData.days[0].tempmax}`)
        console.log(`Min Temperature: ${weatherData.days[0].tempmin}`)
        console.log(`Current Temperature: ${weatherData.currentConditions.temp}`)
    }
    catch (error) {
        console.log("Failed to fetch req!")
    }

}

function getURL(cityName, unit) {
    url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/?unitGroup=${unit}&iconSet=icons1&include=current`;
    return url

}

const textContainer = document.createElement("div")
textContainer.classList.add("text-container")
body.appendChild(textContainer);

async function displayWeatherOnScreen(url) {
    try {
        const weatherData = await fetchVisualCrossingWeatherAPI(url)

        //     iconsDescription.forEach(icon => {
        //         if (weatherData.currentConditions.icon === icon)
        //    })


        const placeName = document.createElement("p")
        placeName.textContent = `Resolved Address: ${weatherData.resolvedAddress
            }`
        textContainer.appendChild(placeName)

        const maxTemp = document.createElement("p");
        maxTemp.textContent = `Max Temperature: ${weatherData.days[0].tempmax}`
        textContainer.appendChild(maxTemp)

        const minTemp = document.createElement("p")
        minTemp.textContent = `Min Temperature: ${weatherData.days[0].tempmin}`
        textContainer.appendChild(minTemp)

        const currentTemp = document.createElement("p")
        currentTemp.textContent = `Current Temperature: ${weatherData.currentConditions.temp}`
        textContainer.appendChild(currentTemp)

        const iconImg = document.createElement("img")
        // dynamic importing of images
        const value = await import(`/src/images/${weatherData.currentConditions.icon}.svg`)
        iconImg.src = value.default
        textContainer.appendChild(iconImg)

    }
    catch (error) {
        console.log("Failed to fetch req!")
    }
}

submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const textContainer = document.querySelector(".text-container")
    textContainer.textContent = "";
    if (!formRef.checkValidity()) {
        nameOfThePlaceInputField.reportValidity();
        nameOfThePlaceInputField.setCustomValidity("'Name of the Place' field is required!")
        return
    }

    cityName = fetchDataFromForm();
    if (checkBoxToggelForUnits.checked) {
        console.log(cityName)
        url = getURL(cityName, "us")
        displayWeatherOnConsole(url);
        displayWeatherOnScreen(url);
    }
    else {

        url = getURL(cityName, "metric");
        // fetchVisualCrossingWeatherAPI(url);
        displayWeatherOnConsole(url);
        displayWeatherOnScreen(url);
    }
    formRef.reset();
})


// checkBoxToggelForUnits.addEventListener("click", function (event) {
//     // by default the results will display in 'celsius', therefore,
//     // the deault id is also in 'celsius'
//     // here id represents the results units 
//     if (toggleBtn.id === 'celsius') {
//         // results in fahrenheit & change id to 'fahrenheit'
//         console.log(cityName)
//         url = getURL(cityName, "us")
//         displayWeatherOnConsole(url);
//         toggleBtn.id = 'fahrenheit'
//         // toggleBtn.textContent = "Get results in Celsius"
//     }
//     else {
//         //results in celsius & change id to 'celsius'
//         console.log(cityName);
//         url = getURL(cityName, "metric")
//         displayWeatherOnConsole(url);
//         toggleBtn.id = 'celsius'
//         // toggleBtn.textContent = "Get results in Fahrenheit"
//     }

// })



