const apiKey = '7640a8eac8fb26b805abdf93dc3c397b';  
document.addEventListener('DOMContentLoaded', function () {
    const rightContainer = document.querySelector('.rightContainer');

    function updateTimeAndBackground() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const day = now.toLocaleString('default', { weekday: 'long' });
        const date = now.toLocaleDateString();
        const timeString = `${day}, ${date} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('timeDisplay').textContent = timeString;

        let backgroundImage;

        if (hours >= 6 && hours < 12) {
            backgroundImage = "url('morning.jpg')";
        } else if (hours >= 12 && hours < 18) {
            backgroundImage = "url('afternoon.jpg')";
        } else if (hours >= 18 && hours < 20) {
            backgroundImage = "url('evening.jpg')";
        } else {
            backgroundImage = "url('night.jpg')";
        }

        document.querySelector('.leftContainer').style.backgroundImage = backgroundImage;
    }

    function setDefaultRightContainerBackground() {
        const defaultBackgroundImage = "url('images/defaul.jpeg')";
        rightContainer.style.backgroundImage = defaultBackgroundImage;
        rightContainer.style.backgroundSize = 'cover';
        rightContainer.style.backgroundPosition = 'cover';
    }

    function getWeather(city) {
        console.log(`Getting weather for: ${city}`); 
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function searchWeather() {
        const city = document.getElementById('search').value;
        console.log(`City entered: ${city}`); 
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    }

    function displayWeather(data) {
        const weatherResult = document.getElementById('weatherResult');
        
        if (data.cod === 200) {
            const weatherDescription = data.weather[0].description;
            const weatherImage = getWeatherImage(data.weather[0].main);

           
            rightContainer.style.backgroundImage = `url('${weatherImage}')`;
            rightContainer.style.backgroundSize = 'cover';
            rightContainer.style.backgroundPosition = 'center';
            
           
            weatherResult.innerHTML = `
                <p><strong>${data.name}</strong></p>
                <p>${weatherDescription}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
        } else {
            weatherResult.innerHTML = `<p>City not found</p>`;
            setDefaultRightContainerBackground();  
        }
    }

    function getWeatherImage(condition) {
        switch (condition.toLowerCase()) {
            case 'clear':
                return 'images/clear.jpg'; 
            case 'clouds':
                return 'images/cloudy.jpg'; // cloudy weather image
            case 'rain':
                return 'images/rainy.jpg'; // rainy weather image
            case 'snow':
                return 'images/snow.jpg'; // snowy weather image
            case 'thunderstorm':
                return 'images/haze.png'; // thunderstorm image
            case 'mist':
                 return 'images/haze.png';
            case 'haze': return 'images/haze.png';
            case 'fog':'images/haze.png'; // misty weather image
                
            default:
                return 'images/def.png'; // default weather image
        }
    }

    // Event listener for the search button
    document.querySelector('button[onclick="searchWeather()"]').addEventListener('click', searchWeather);

    // Event listeners for the buttons in the navbar
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', function() {
            getWeather(button.textContent);
        });
    });

    // Update time and background every second
    setInterval(updateTimeAndBackground, 1000);

    // Initial calls to set the time, background, and default background for right section
    updateTimeAndBackground();
    setDefaultRightContainerBackground();
});
