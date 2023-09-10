const apiKey = '43711408'; // Replace with your actual OMDB API key
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');
const favbtn = document.getElementById('favicon');
const favContainer = document.getElementById('fcontainer');
const closebtn = document.getElementById('closebtn');
const iconf = document.getElementById('iconf');
const info = document.getElementById('info');
// Initialize favorite movies from localStorage or an empty array
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Function to update the list of favorite movies in localStorage
function updateFavoriteMovies() {
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Function to add a movie to favorites
function addToFavorites(movie) {
    favoriteMovies.push(movie);
    updateFavoriteMovies();
    displayFavoriteMovies();
}

// Function to remove a movie from favorites
function removeFromFavorites(imdbID) {
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== imdbID);
    updateFavoriteMovies();
    displayFavoriteMovies();
}

// Function to display favorite movies in the favContainer
function displayFavoriteMovies() {
    favContainer.innerHTML = ''; // Clear previous results
    favoriteMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        const removeIcon = document.createElement('span');
        removeIcon.classList.add('material-symbols-outlined', 'remove-icon');
        removeIcon.textContent = 'remove';
        removeIcon.addEventListener('click', () => removeFromFavorites(movie.imdbID));
        movieCard.appendChild(removeIcon);
        favContainer.appendChild(movieCard);
    });
}

searchInput.addEventListener('input', debounce(searchMovies, 300));

function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
    };
}

function searchMovies() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        movieContainer.innerHTML = ''; // Clear the movie container if the search input is empty.
        return;
    }

    const apiURL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                const movies = data.Search;
                movieContainer.innerHTML = ''; // Clear previous results
                movies.forEach(movie => {
                    const movieCard = createMovieCard(movie);
                    const favoriteIcon = movieCard.querySelector('.pfav');
                    favoriteIcon.addEventListener('click', () => addToFavorites(movie));
                    movieContainer.appendChild(movieCard);
                });
            } else {
                movieContainer.innerHTML = 'No results found.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Initial setup to display favorite movies 
displayFavoriteMovies();
favbtn.addEventListener('click', toggleFaveContainer);
function toggleFaveContainer() {
    const currentDisplayStyle = window.getComputedStyle(favContainer).getPropertyValue('display');

    if (currentDisplayStyle === 'none') {
        showFaveContainer();
    } else {
        hideFaveContainer();
    }
}
toggleFavContainerButton.addEventListener('click', () => {
    // Check the current display state of the favContainer
    const currentDisplayStyle = window.getComputedStyle(favContainer).getPropertyValue('display');

    // Toggle the display property
    if (currentDisplayStyle === 'none') {
        showFaveContainer(); // Show the favContainer and favorites
    } else {
        hideFaveContainer(); // Hide the favContainer
    }
});

// Modify the showFaveContainer function
function showFaveContainer() {
    favContainer.style.display = 'flex';
    iconf.innerHTML = 'heart_check';
    iconf.style.color = 'red';
    displayFavoriteMovies();
}

// Create a new function to hide the favContainer
function hideFaveContainer() {
    favContainer.style.display = 'none';
    iconf.innerHTML = 'favorite';
    iconf.style.color = 'black';
}



/* 

   

<div class="card">
    <img src="${movie.Title}" alt="${movie.Title}" />
    <div class="card-details">
       <div class="card-title">${movie.Title}</div>
       <div class="card-info">
          <p><strong>Year:</strong>${movie.Year} &#x2022; ${movie.Country} &#x2022; Rating-${movie.imdbRating}</p>
          <p><strong>writer:</strong>${movie.Writer}</p>
          <p><strong>Actor:</strong>${movie.Actors}</p>
          <p><strong>Genre:</strong>${movie.Genre}</p>
          <p><strong>Description:</strong>${movie.Plot}</p>
          </div>
    </div>
</div>

*/
// Function to handle "info" button click and navigate to movies.html
function handleInfoButtonClick(event, movie) {
    // Prevent the default behavior of the button (e.g., form submission)
    event.preventDefault();

    // Serialize the movie object to a query string
    const queryString = Object.keys(movie)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(movie[key])}`)
        .join('&');

    // Navigate to movies.html with the query string as parameters
    window.location.href = `MoviesDetails.html?${queryString}`;
}
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('moviecard');
    movieCard.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <div class="title">${movie.Title}</div>
        <span class="material-symbols-outlined pfav">favorite</span>
        <a href="MoviesDetails.html" class="material-symbols-outlined" id="info">info</a> 
    `;

    const infoLink = movieCard.querySelector('#info');
    infoLink.addEventListener('click', event => {
        handleInfoButtonClick(event, movie);
    });

    return movieCard;
}
// Get the query parameters from the URL
const queryParams = new URLSearchParams(window.location.search);

// Initialize an empty movie object
const movie = {};

// Check if query parameters exist
if (queryParams.has('Title')) {
    // Populate the movie object with query parameters
    movie.Title = queryParams.get('Title');
    movie.Year = queryParams.get('Year');
    movie.Director = queryParams.get('Director');
    movie.ReleaseDate = queryParams.get('ReleaseDate');
    movie.Description = queryParams.get('Description');

    // Display the movie details on the page
    const protectDiv = document.querySelector('.protect');
    protectDiv.innerHTML = `
        <div class="card">
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <div class="card-details">
                <div class="card-title">${movie.Title}</div>
                <div class="card-info">
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Release Date:</strong> ${movie.ReleaseDate}</p>
                    <p><strong>Description:</strong> ${movie.Description}</p>
                </div>
            </div>
        </div>
    `;
} else {
    // Handle the case where query parameters are missing
    const protectDiv = document.querySelector('.protect');
    protectDiv.textContent = 'No details found.';
}