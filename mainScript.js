let timeWindow = 'day'; // Default time window

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const trendingMovies = await fetchTrendingMovies(timeWindow);
        displayTrendingMovies(trendingMovies);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
});

async function fetchTrendingMovies(timeWindow) {
    const apiKey = '170e9c0b74242721b6786d03329c6fd8';
    const apiUrl = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${apiKey}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
    }

    const data = await response.json();
    return data.results;
}

function displayTrendingMovies(movies) {
    const trendingMoviesContainer = document.getElementById('trendingMovies');
    trendingMoviesContainer.innerHTML = ''; // Clear previous movies

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        
        const title = document.createElement('h3');
        title.textContent = movie.title;
        
        const releaseDate = document.createElement('p');
        releaseDate.textContent = `${movie.release_date}`;
        
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        // Add a click event listener to navigate to movieDetails
        movieElement.addEventListener('click', () => {
            const movieId = movie.id;
            const movieTitle = encodeURIComponent(movie.title);
            window.location.href = `movieDetails.html?id=${movieId}&searchType=movie&query=${movieTitle}`;
        });

        movieElement.appendChild(poster);
        movieElement.appendChild(title);
        movieElement.appendChild(releaseDate);

        trendingMoviesContainer.appendChild(movieElement);
    });
}

// Event listeners for slider buttons
document.getElementById('todayButton').addEventListener('click', async () => {
    try {
        timeWindow = 'day';
        document.getElementById('todayButton').classList.add('active');
        document.getElementById('thisWeekButton').classList.remove('active');

        const trendingMovies = await fetchTrendingMovies(timeWindow);
        displayTrendingMovies(trendingMovies);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
});

document.getElementById('thisWeekButton').addEventListener('click', async () => {
    try {
        timeWindow = 'week';
        document.getElementById('todayButton').classList.remove('active');
        document.getElementById('thisWeekButton').classList.add('active');

        const trendingMovies = await fetchTrendingMovies(timeWindow);
        displayTrendingMovies(trendingMovies);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
});

// Handle search input
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm) {
            window.location
            window.location.href = `searchPage.html?query=${encodeURIComponent(searchTerm)}`;
        }
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        window.location.href = `searchPage.html?query=${encodeURIComponent(searchTerm)}`;
    }
});
