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
    const apiUrl = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${apiKey}&sort_by=popularity.desc`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
    }

    const data = await response.json();
    console.log('Trending Movies Data:', data); // Log the data fetched from the API
    return data.results;
}

function getScoreColor(score) {
    if (score < 40) {
        return 'red';
    } else if (score < 50) {
        return 'rgb(244, 85, 11)';
    } else if (score < 60) {
        return 'rgb(211, 154, 11)';
    } else if (score < 70) {
        return 'rgb(107, 127, 0)';
    } else if (score < 80) {
        return 'rgb(75, 157, 0)';
    } else if (score < 90) {
        return 'rgb(53, 172, 0)';
    } else if (score < 90) {
        return 'rgb(0, 186, 0)';
    } else {
        return 'rgb(0, 255, 0)';
    }
}

function displayTrendingMovies(movies) {
    const trendingMoviesContainer = document.getElementById('trendingMovies');
    trendingMoviesContainer.innerHTML = ''; // Clear previous movies

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        
        const title = document.createElement('h3');
        title.textContent = movie.title;
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
        
        // Usage inside the displayTrendingMovies function
        const releaseDate = document.createElement('p');
        releaseDate.textContent = formatDate(movie.release_date);
        
        
        const circularProgress = document.createElement('div');
        circularProgress.classList.add('circular-progress');
        
        const innerCircle = document.createElement('div');
        innerCircle.classList.add('inner-circle');
        innerCircle.style.background = `rgba(255, 255, 255, 0.6)`; // Set inner circle background with 0.6 opacity

        const percentageText = document.createElement('button');
        const voteAverage = Math.floor(movie.vote_average * 10);
        percentageText.textContent = `${voteAverage}%`;
        percentageText.classList.add('percentage');
        percentageText.style.background = getScoreColor(voteAverage);

        innerCircle.style.background = `conic-gradient(${getScoreColor(voteAverage)} ${voteAverage}%, transparent ${voteAverage}%)`;

        circularProgress.appendChild(innerCircle);
        circularProgress.appendChild(percentageText);
        
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        // Add a click event listener to navigate to movieDetails
        movieElement.addEventListener('click', () => {
            const movieId = movie.id;
            const movieTitle = encodeURIComponent(movie.title);
            window.location.href = `movieDetails.html?id=${movieId}&searchType=movie&query=${movieTitle}&sort_by=popularity.desc`;
        });

        movieElement.appendChild(poster);
        movieElement.appendChild(circularProgress);
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

        // Add fade-out animation to existing .movie elements
        const movies = document.querySelectorAll('.movie');
        movies.forEach(movie => {
            movie.classList.add('fade-out');
        });

        const trendingMovies = await fetchTrendingMovies(timeWindow);

        // Wait for fade-out animation to complete before displaying new movies
        setTimeout(() => {
            displayTrendingMovies(trendingMovies);
        }, 500); // Adjust timing to match CSS transition duration
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
});

document.getElementById('thisWeekButton').addEventListener('click', async () => {
    try {
        timeWindow = 'week';
        document.getElementById('todayButton').classList.remove('active');
        document.getElementById('thisWeekButton').classList.add('active');

        // Add fade-out animation to existing .movie elements
        const movies = document.querySelectorAll('.movie');
        movies.forEach(movie => {
            movie.classList.add('fade-out');
        });

        const trendingMovies = await fetchTrendingMovies(timeWindow);

        // Wait for fade-out animation to complete before displaying new movies
        setTimeout(() => {
            displayTrendingMovies(trendingMovies);
        }, 500); // Adjust timing to match CSS transition duration
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
});

// Handle search input
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm) {
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
