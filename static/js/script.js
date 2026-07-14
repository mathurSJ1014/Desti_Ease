// Toggle Hamburger Menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Smooth scrolling and active menu highlighting
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll("nav ul li a");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute("id");
            }
        });

        navLi.forEach((li) => {
            li.classList.remove("active");
            if (li.getAttribute("href") === `#${current}`) {
                li.classList.add("active");
            }
        });
    });
});

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active'); // Remove the active class from all sections
    });

    // Show the selected section with animation
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.add('active'); // Add active class to the selected section
}

// Initially show the recommendations section
document.getElementById('recommendations').classList.add('active');

let lastScrollTop = 0;
const header = document.querySelector('header');

// Listen for scroll events
window.addEventListener('scroll', function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scrolling down
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scroll value
});

// Popup elements
const popupOverlay = document.getElementById('popupOverlay');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');
const popupImage = document.getElementById('popupImage');
const closePopupButton = document.getElementById('closePopup');

// Place details mapping for each category
const placeDetails = {
    "Beaches": {
        "Goa": {
            description: "Goa is famous for its beaches, vibrant nightlife, and seafood.",
            image: "/static/city_images/goa.jpg"
        },
        "Chennai": {
            description: "Chennai has long stretches of sandy beaches and beautiful temples.",
            image: "/static/city_images/chennai.jpg"
        },
        "Kochi": {
            description: "Kochi is known for its backwaters and scenic beachside landscapes.",
            image: "/static/city_images/kochi.jpg"
        }
    },
    "Mountains": {
        "Manali": {
            description: "Manali is a hill station known for adventure sports and beautiful mountains.",
            image: "/static/city_images/manali.jpg"
        },
        "Leh Ladakh": {
            description: "Leh Ladakh offers stunning mountain views and Buddhist monasteries.",
            image: "/static/city_images/leh_ladakh.jpg"
        },
        "Srinagar": {
            description: "Srinagar is known for its houseboats and scenic mountain landscapes.",
            image: "/static/city_images/srinagar.jpg"
        }
    },
    "Desert": {
        "Jaisalmer": {
            description: "Jaisalmer is famous for its golden sandstone forts and desert landscapes.",
            image: "/static/city_images/jaisalmer.jpg"
        },
        "Bikaner": {
            description: "Bikaner is known for its desert fortresses and camel rides.",
            image: "/static/city_images/bikaner.jpg"
        },
        "Jodhpur": {
            description: "Jodhpur is a desert city known for its blue-painted houses and Mehrangarh Fort.",
            image: "/static/city_images/jodhpur.jpg"
        }
    },
    "Plains": {
        "Udaipur": {
            description: "Udaipur is known for its lakes, palaces, and beautiful surrounding plains.",
            image: "/static/city_images/udaipur.jpg"
        },
        "Ahmedabad": {
            description: "Ahmedabad is a vibrant city with cultural heritage in the plains of Gujarat.",
            image: "/static/city_images/ahmedabad.jpg"
        },
        "Bengaluru": {
            description: "Bengaluru is a modern city with beautiful gardens and pleasant weather.",
            image: "/static/city_images/bengaluru.jpg"
        }
    },
    "Hills": {
        "Alibaug": {
            description: "Alibaug offers scenic coastal views and a serene atmosphere.",
            image: "/static/city_images/alibaug.jpg"
        },
        "Matheran": {
            description: "Matheran is a small hill station known for its peaceful environment and panoramic views.",
            image: "/static/city_images/matheran.jpg"
        },
        "Khandala": {
            description: "Khandala is a popular hill station with lakes and green valleys.",
            image: "/static/city_images/khandala.jpg"
        }
    }
};

// Function to show the popup with category details
function showPopup(category) {
    let places = placeDetails[category];
    let popupContent = '';
    for (let place in places) {
        let details = places[place];
        popupContent += `
            <div class="place-item">
                <img src="${details.image}" alt="${place}" class="popup-image">
                <div class="popup-description">
                    <h3>${place}</h3>
                    <p>${details.description}</p>
                </div>
            </div>
        `;
    }

    popupTitle.textContent = category; // Set the title of the popup
    popupDescription.innerHTML = popupContent; // Set the description content
    popupOverlay.style.display = 'flex'; // Show the popup
}

// Event listeners for place cards
document.getElementById('beaches-card').addEventListener('click', () => showPopup('Beaches'));
document.getElementById('mountains-card').addEventListener('click', () => showPopup('Mountains'));
document.getElementById('desert-card').addEventListener('click', () => showPopup('Desert'));
document.getElementById('plains-card').addEventListener('click', () => showPopup('Plains'));
document.getElementById('hills-card').addEventListener('click', () => showPopup('Hills'));

// Close popup
closePopupButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

// Close popup if user clicks outside of content
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

const chatbotContainer = document.getElementById('chatbot-container');
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotMessages = document.getElementById('chatbot-messages');

// Chatbot Toggle
chatbotToggleBtn.addEventListener('click', () => {
    chatbotContainer.style.display = 'flex'; // Make chatbot visible
});

// Close chatbot
chatbotCloseBtn.addEventListener('click', () => {
    chatbotContainer.style.display = 'none'; // Hide chatbot
});

// Append Messages to Chatbot Window
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
}

// Send Message to Backend
chatbotSendBtn.addEventListener('click', () => sendMessage());
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        appendMessage('user', userMessage);
        chatbotInput.value = ''; // Clear input field

        // Send user message to backend
        fetch('/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to connect to chatbot.');
            return response.json();
        })
        .then(data => {
            appendMessage('bot', data.reply || "Sorry, I couldn't understand that.");
        })
        .catch((error) => {
            console.error(error);
            appendMessage('bot', 'Oops! Something went wrong. Please try again.');
        });
    }
}

// Your existing JavaScript code...
async function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        appendMessage('user', userMessage);
        chatbotInput.value = '';

        try {
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to connect to chatbot.');
            }

            const data = await response.json();
            
            // Append both full reply and summary
            appendMessage('bot', data.reply);
            
            // Optional: Add a way to view full response, if desired
            // You could implement this with a "Show Full Response" button or modal
        } catch (error) {
            console.error(error);
            appendMessage('bot', 'Oops! Something went wrong. Please try again.');
        }
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);

    const messageLabelElement = document.createElement('div');
    messageLabelElement.classList.add('message-label');
    messageLabelElement.textContent = sender === 'user' ? 'You' : 'DestiEase Bot';

    const messageContentElement = document.createElement('div');
    messageContentElement.classList.add('message-content');
    messageContentElement.textContent = message;

    messageElement.appendChild(messageLabelElement);
    messageElement.appendChild(messageContentElement);
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Event listeners for sending messages
chatbotSendBtn.addEventListener('click', () => sendMessage());
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

//  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