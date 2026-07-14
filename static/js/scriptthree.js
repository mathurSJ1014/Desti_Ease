// Add wave animation to each letter of the heading
document.querySelector('h1.animated-heading').addEventListener('mouseenter', function() {
    const heading = this;
    const letters = heading.textContent.split(''); // Split heading into letters
    heading.innerHTML = '';  // Clear existing text

    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        heading.appendChild(span);

        // Add animation delay for each letter
        span.style.animation = `wave 0.5s ease forwards ${index * 0.05}s`;
    });
});

// Reset text to original on mouse leave
document.querySelector('h1.animated-heading').addEventListener('mouseleave', function() {
    const heading = this;
    heading.innerHTML = 'Anticipated City Recommendations';  // Reset the text to original
});

// Auto-hide header on scroll
let lastScrollTop = 0; // To keep track of scroll position
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scroll down: Hide header
        header.style.top = '-80px'; // Adjust based on header height
    } else {
        // Scroll up: Show header
        header.style.top = '0'; // Reset the header to the top
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scroll position
});

// Slider functionality for temperature, humidity, and traffic
const tempSlider = document.getElementById('temperature');
const humiditySlider = document.getElementById('humidity');
const trafficSlider = document.getElementById('traffic');

// Display the value next to each slider for real-time feedback
const tempLabel = document.getElementById('temp-value');
const humidityLabel = document.getElementById('humidity-value');
const trafficLabel = document.getElementById('traffic-value');

// Update the label with the initial slider value
tempLabel.textContent = tempSlider.value;
humidityLabel.textContent = humiditySlider.value;
trafficLabel.textContent = trafficSlider.value;

// Event listeners for slider input to update the value displayed
tempSlider.addEventListener('input', function() {
    tempLabel.textContent = this.value; // Update temperature label
});

humiditySlider.addEventListener('input', function() {
    humidityLabel.textContent = this.value; // Update humidity label
});

trafficSlider.addEventListener('input', function() {
    trafficLabel.textContent = this.value; // Update traffic label
});

// Example script for handling form submission or other interactive behaviors
document.getElementById("recommend-btn").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent form submission to handle validation or AJAX calls if needed

    // Here, you can add logic to send the slider values to the backend or trigger predictions
    alert("Form submitted! Temperature: " + tempSlider.value + "°C, Humidity: " + humiditySlider.value + "%, Traffic: " + trafficSlider.value);
});

function toggleReadMore(button) {
    const description = button.parentElement.previousElementSibling; // Target the description <p>
    if (description.classList.contains('expanded')) {
        description.classList.remove('expanded');
        button.textContent = 'Read More';
    } else {
        description.classList.add('expanded');
        button.textContent = 'Read Less';
    }
}

function generateItinerary(cityName) {
    // Show loading state
    const popup = document.getElementById('itinerary-popup');
    const details = document.getElementById('itinerary-details');
    details.innerHTML = '<p>Loading itinerary...</p>';
    popup.classList.remove('hidden');

    // Fetch itinerary for the specified city
    fetch(`/itinerary?city=${encodeURIComponent(cityName)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || "Failed to load itinerary");
                });
            }
            return response.text();
        })
        .then(data => {
            details.innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
            details.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load itinerary</h3>
                    <p>${error.message}</p>
                    <p>Please try again later or contact support if the issue persists.</p>
                </div>
            `;
        });
}


function closePopup() {
    const popup = document.getElementById('itinerary-popup');
    popup.classList.add('hidden');
}

