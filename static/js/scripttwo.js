// Handle the scroll event to hide/show the header
let lastScrollTop = 0;
const header = document.querySelector('.top-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.top = '-60px';
    } else {
        header.style.top = '0';
    }

    lastScrollTop = scrollTop;

    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Function to initialize Read More buttons
function initializeReadMoreButtons() {
    // For recommendation cards
    document.querySelectorAll('.recommendation-card .read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardDescription = this.closest('.card-description');
            const shortDesc = cardDescription.querySelector('.short-desc');
            const fullDesc = cardDescription.querySelector('.full-desc');
            
            if (fullDesc.style.display === 'none') {
                shortDesc.style.display = 'none';
                fullDesc.style.display = 'inline';
                this.textContent = 'Read Less';
            } else {
                shortDesc.style.display = 'inline';
                fullDesc.style.display = 'none';
                this.textContent = 'Read More';
            }
        });
    });

    // For blog cards
    document.querySelectorAll('.blog-card .read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const blogContent = this.closest('.blog-content');
            const shortDesc = blogContent.querySelector('.short-desc');
            const fullDesc = blogContent.querySelector('.full-desc');
            
            if (fullDesc.style.display === 'none') {
                shortDesc.style.display = 'none';
                fullDesc.style.display = 'block';
                this.textContent = 'Read Less';
            } else {
                shortDesc.style.display = 'block';
                fullDesc.style.display = 'none';
                this.textContent = 'Read More';
            }
        });
    });
}

// Initialize Read More buttons when the page loads
document.addEventListener('DOMContentLoaded', initializeReadMoreButtons);

// Handle the search functionality
document.getElementById('search-btn')?.addEventListener('click', function() {
    const city = document.getElementById('search-input').value;

    fetch('/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: city }),
    })
    .then(response => response.json())
    .then(data => {
        const blogsContainer = document.getElementById('blogs');
        blogsContainer.innerHTML = '';

        if (data.error) {
            blogsContainer.innerHTML = `<p>${data.error}</p>`;
        } else {
            data.forEach(post => {
                let description = post.City_desc.replace(/[\[\];]/g, '');
                description = description.replace(/^['"]/, '');
                
                const shortDescription = description.split(' ').slice(0, 30).join(' ') + '...';
                const cityImage = `static/city_images/${post.City.toLowerCase().replace(/\s+/g, '_')}.jpg`;

                const blogCard = document.createElement('div');
                blogCard.className = 'blog-card';
                blogCard.innerHTML = `
                    <img src="${cityImage}" alt="${post.City}" class="blog-image" onerror="this.onerror=null;this.src='static/city_images/default.jpg';">
                    <div class="blog-content">
                        <h3>${post.City}</h3>
                        <p>Ratings: ${post.Ratings}</p>
                        <p class="short-desc">${shortDescription}</p>
                        <p class="full-desc" style="display: none;">${description}</p>
                        <button class="read-more-btn">Read More</button>
                    </div>
                `;
                blogsContainer.appendChild(blogCard);
            });
            
            // Reinitialize Read More buttons for new content
            initializeReadMoreButtons();
        }
    })
    .catch(error => console.error('Error:', error));
});

// Trigger search on "Enter" key press
document.getElementById('search-input')?.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('search-btn').click();
    }
});