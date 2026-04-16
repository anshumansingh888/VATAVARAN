// Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherResult = document.getElementById('weatherResult');
const errorBox = document.getElementById('errorBox');

const cityName = document.getElementById('cityName');
const weatherCondition = document.getElementById('weatherCondition');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const vibeBox = document.getElementById('vibeBox');
const vibeText = document.getElementById('vibeText');

// New detail elements
const humidityEl = document.getElementById('humidity');
const humidityBar = document.getElementById('humidityBar');
const windSpeedEl = document.getElementById('windSpeed');
const windDescEl = document.getElementById('windDesc');
const imageCityPulse = document.getElementById('imageCityPulse');

searchBtn.addEventListener('click', fetchWeather);

// Allow pressing "Enter" to search
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeather();
    }
});

async function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    // Reset UI
    errorBox.classList.add('hidden');
    weatherResult.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const url = `http://localhost:8000/weather?city=${city}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        
        // Extract required data points
        const temp = data.main.temp;
        const description = data.weather[0].description;
        const mainWeather = data.weather[0].main;
        const humidity = data.main.humidity;
        // Convert wind speed from m/s to km/h initially the units=metric sets speed to m/s
        const windSpeedKmh = Math.round(data.wind.speed * 3.6); 
        const windDeg = data.wind.deg;

        updateUI(city, temp, description, mainWeather, humidity, windSpeedKmh, windDeg);

    } catch (error) {
        loading.classList.add('hidden');
        errorBox.classList.remove('hidden');
    }
}

// Convert wind direction degrees to human-readable string
function getWindDirection(degree) {
    if (degree > 337.5 || degree <= 22.5) return 'North';
    if (degree > 22.5 && degree <= 67.5) return 'North-East';
    if (degree > 67.5 && degree <= 112.5) return 'East';
    if (degree > 112.5 && degree <= 157.5) return 'South-East';
    if (degree > 157.5 && degree <= 202.5) return 'South';
    if (degree > 202.5 && degree <= 247.5) return 'South-West';
    if (degree > 247.5 && degree <= 292.5) return 'West';
    if (degree > 292.5 && degree <= 337.5) return 'North-West';
    return 'Unknown';
}

// Get proper Material Icon block based on weather type
function getWeatherIcon(mainWeather) {
    const weatherStr = mainWeather.toLowerCase();
    if (weatherStr.includes('clear')) return 'sunny';
    if (weatherStr.includes('cloud')) return 'cloudy';
    if (weatherStr.includes('rain')) return 'rainy';
    if (weatherStr.includes('drizzle')) return 'rainy';
    if (weatherStr.includes('snow')) return 'ac_unit';
    if (weatherStr.includes('thunderstorm')) return 'thunderstorm';
    if (weatherStr.includes('mist') || weatherStr.includes('fog') || weatherStr.includes('haze')) return 'foggy';
    return 'partly_cloudy_day';
}

function updateUI(city, temp, description, mainWeather, humidity, windSpeed, windDeg) {
    loading.classList.add('hidden');
    
    // Formatting current Date and Time
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    cityName.textContent = city;
    imageCityPulse.textContent = `${city} Pulse`;
    weatherCondition.textContent = `${description} • ${dayName}, ${timeStr}`;
    
    // Apply icon
    weatherIcon.textContent = getWeatherIcon(mainWeather);
    
    // Formatting numbers
    temperature.textContent = Math.round(temp);
    humidityEl.textContent = humidity;
    humidityBar.style.width = `${humidity}%`; // fill the bar
    
    windSpeedEl.textContent = windSpeed;
    windDescEl.textContent = `${getWindDirection(windDeg)} Breeze`;

    // Reset vibe classes
    vibeBox.className = 'mt-8 bg-[#ff7cf5]/10 border border-[#ff7cf5]/30 p-5 rounded-lg flex items-center gap-4 transition-colors duration-300';
    
    // Vibe check logic
    if (temp > 30) {
        vibeText.textContent = "Too hot for humans. Stay in the AC.";
        vibeBox.classList.add('vibe-hot');
    } else if (temp < 15) {
        vibeText.textContent = "Chai and sweater weather.";
        vibeBox.classList.add('vibe-cold');
    } else {
        vibeText.textContent = "The weather is actually perfect.";
        vibeBox.classList.add('vibe-perfect');
    }

    // Show result card
    weatherResult.classList.remove('hidden');
}
