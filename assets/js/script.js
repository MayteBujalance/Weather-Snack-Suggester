const apiKey = 'a333e189960c73d6b8c5c5316dd99887'; // free key from openweathermap.org

// Sample snack suggestions based on temperature to loop on
const snackSuggestions = {
  cold: [
    "Hot chocolate and marshmallows",
    "Warm apple pie",
    "Spicy soup and bread",
    "Hot tea and cookies"
  ],
  cool: [
    "Banana bread and herbal tea",
    "Roasted nuts and coffee",
    "Granola bars and warm milk",
    "Muffins and chai latte"
  ],
  warm: [
    "Fruit smoothie and crackers",
    "Yogurt parfait",
    "Veggie wrap",
    "Lemonade and hummus"
  ],
  hot: [
    "Ice cream and lemonade",
    "Cold fruit salad",
    "Frozen yogurt",
    "Iced tea and watermelon"
  ]
};

// This function is called when the user clicks the "Get Weather" button
function getWeather() {
  const city = document.getElementById('cityInput').value;
  fetchWeatherData(city);
}

function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(handleResponse)
    .catch(error => console.error('Error fetching weather:', error));
}

// This function changes the background color based on the temperature
function changeBackground(temp) {
  const body = document.body;
  const bgVideo = document.getElementById('bgVideo');
  const bgVideoSource = document.getElementById('bgVideoSource');

  let videoFile = "defaultBackground.mp4"; // Default video file
  if (temp < 10) {
    videoFile = "coldLandscapeBackground.mp4";
    body.style.background = 'linear-gradient(to right, #1e3c72, #2a5298)';
  } else if (temp < 20) {
    videoFile = "coolLandscapeBackground.mp4";
    body.style.background = 'linear-gradient(to right, #2980b9, #6dd5fa)';
  } else if (temp < 30) {
    videoFile = "warmLandscapeBackground.mp4";
    body.style.background = 'linear-gradient(to right, #fbc2eb, #a6c1ee)';
  } else {
    videoFile = "hotLandscapeBackground.mp4";
    body.style.background = 'linear-gradient(to right, #f857a6, #ff5858)';
  }

  // Set the video source
  if (bgVideoSource) {
    bgVideoSource.src = `assets/videos/${videoFile}`;
    bgVideo.load();
  }
}

function handleResponse(response) {
    // When you make a fecth request, the response comes as row JSON (a string). So it has to be converted to a JSON object.
    // so parsed.
  return response.json().then(function(data) {
    console.log(data); 
    // checks if the HTTP response status is exactly 200 (success), ensuring your code only runs when the request was successful.
    if (data.cod === 200) {
      displayWeather(data);
      changeBackground(data.main.temp); // <-- it calls the changeBackground function. It has to be called after the temp has been fetched.
      suggestSnack(data.main.temp);
    } else {
      showCityNotFound();
    }
  });
}

// This function displays the weather data on the page
function displayWeather(data) {
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const weather = data.weather[0].main;
  const city = data.name;
  const country = data.sys.country;
  document.getElementById('weatherResult').innerText =
    `It's ${temp}°C but it feels like ${feelsLike} with ${weather} in ${city}, ${country}. Enjoy your day!`;
}

// This function suggests a snack based on the temperature
function suggestSnack(temp) {
  let snacksArray;
  if (temp < 10) {
    snacksArray = snackSuggestions.cold;
  } else if (temp < 20) {
    snacksArray = snackSuggestions.cool;
  } else if (temp < 30) {
    snacksArray = snackSuggestions.warm;
  } else {
    snacksArray = snackSuggestions.hot;
  }

// Pick and show a random snack in one line
  document.getElementById('snackSuggestion').innerText =
    `Staying healthy is important. We suggest you have: ${snacksArray[Math.floor(Math.random() * snacksArray.length)]}`;

//   Longer code that rdoes the same as the above. I am learning.
//   const randomIndex = Math.floor(Math.random() * snacksArray.length);
//   const snack = snacksArray[randomIndex];
//   document.getElementById('snackSuggestion').innerText = `Suggested snack: ${snack}`;
}

function showCityNotFound() {
  document.getElementById('weatherResult').innerText = "City not found.";
  document.getElementById('snackSuggestion').innerText = "";
}

// event listener for the button click
document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

// event listener for the Enter key
document.getElementById('cityInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});

// Dark mode toggle
const darkModeBtn = document.getElementById('toggleDarkMode');
const toggleIcon = document.getElementById('toggle-icon');
const bgVideo = document.getElementById('bgVideo');

let darkMode = false;

darkModeBtn.addEventListener('click', function() {
  darkMode = !darkMode;
  
  if (darkMode) {
    document.body.classList.add('dark-mode');
    bgVideo.style.display = 'none'; // Hide the video
    // change to sun icon
    toggleIcon.classList.remove("fa-regular", "fa-moon");
    toggleIcon.classList.add("fa-solid", "fa-sun", "sun-bright");

  } else {
    document.body.classList.remove('dark-mode');
    bgVideo.style.display = ''; // Show the video
    toggleIcon.classList.remove("fa-solid", "fa-sun", "sun-bright");
    toggleIcon.classList.add("fa-regular", "fa-moon");
  }
});
