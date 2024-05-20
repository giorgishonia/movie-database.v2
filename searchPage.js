let currentPage = 1;
let totalPages = 1;
let currentSearchType = 'movie'; // Default search type

// Load previous search term from sessionStorage
const previousSearchTerm = sessionStorage.getItem('lastSearchTerm');
if (previousSearchTerm) {
    document.getElementById('searchInput').value = previousSearchTerm;
    searchMovies();
}

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

async function searchMoviesWithDelay() {
    // Hide search results
    const searchResults = document.getElementById('searchResults');
    searchResults.style.display = 'none';

    // Hide pagination and apply loader style
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'none';

    // Show loader and position in the center
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    loader.style.position = 'fixed';
    loader.style.top = '20%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';

    // Wait for 1.5 seconds (1500 milliseconds) before executing the search
    await wait(1000);
    searchMovies();

    // Show search results and hide loader after search is complete
    searchResults.style.display = 'block';
    loader.style.display = 'none';

    // Show pagination after search is complete
    pagination.style.display = 'block';
}

// Call searchMoviesWithDelay instead of searchMovies
document.getElementById('searchInput').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('searchInput').value.trim(); // Trimmed to remove white spaces
        const errorMessageElement = document.getElementById('errorMessage');
        
        if (searchTerm !== '') {
            currentPage = 1; // Reset currentPage when a new search is initiated
            searchMoviesWithDelay(); // Call searchMoviesWithDelay instead of searchMovies
        } else {
            // Clear the previous search results and hide pagination buttons
            document.getElementById('searchResults').innerHTML = '';
            document.getElementById('pagination').innerHTML = '';
            errorMessageElement.textContent = 'Please fill in the search input';
            resetCounts(); // Reset counts to 0
        }
    }
});

function resetCounts() {
    document.getElementById('movieCount').textContent = '0';
    document.getElementById('tvCount').textContent = '0';
    document.getElementById('peopleCount').textContent = '0';
    document.getElementById('collectionsCount').textContent = '0';
    document.getElementById('companiesCount').textContent = '0';
}

// Add event listeners to search option buttons
document.getElementById('movieButton').addEventListener('click', () => {
    currentSearchType = 'movie';
    searchMovies();
});

document.getElementById('tvShowButton').addEventListener('click', () => {
    currentSearchType = 'tv';
    searchMovies();
});

document.getElementById('peopleButton').addEventListener('click', () => {
    currentSearchType = 'person';
    searchMovies();
});

document.getElementById('collectionsButton').addEventListener('click', () => {
    currentSearchType = 'collection';
    searchMovies();
});

document.getElementById('companiesButton').addEventListener('click', () => {
    currentSearchType = 'company';
    searchMovies();
});

async function searchMovies() {
    const searchTermInput = document.getElementById('searchInput').value.trim();
    const errorMessageElement = document.getElementById('errorMessage');
    const loader = document.getElementById('loader');

    if (!searchTermInput) {
        // Clear the previous search results and hide pagination buttons
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        errorMessageElement.textContent = 'Please fill in the search input';
        resetCounts(); // Reset counts to 0
        return;
    } else {
        errorMessageElement.textContent = ''; // Clear any previous error messages
    }

    // Show loader
    loader.style.display = 'block';

    const { searchTerm, year } = parseSearchTerm(searchTermInput);

    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/search/${currentSearchType}`,
        params: {
            api_key: '170e9c0b74242721b6786d03329c6fd8',
            query: searchTerm,
            page: currentPage
        }
    };

    // Include year filter in the request if provided
    if (year) {
        options.params['year'] = year;
    }

    async function fetchData() {
        try {
            const response = await axios.request(options);
            totalPages = response.data.total_pages;
            displayResults(response.data);
            sessionStorage.setItem('lastSearchTerm', searchTerm);
            sessionStorage.setItem('searchResults', JSON.stringify(response.data));
            renderPagination();
            updateCounts(response.data); // Update counts after search is completed

            // Hide loader
            loader.style.display = 'none';

            // Log the API response data
            console.log(response.data);
        } catch (error) {
            console.error(error);
            // Hide loader in case of error
            loader.style.display = 'none';
        }
    }

    fetchData();
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        searchMovies();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        searchMovies();
    }
}

function renderPagination() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    // Hide pagination buttons if there is only one page or no results
    if (totalPages <= 1 || document.getElementById('searchResults').innerHTML === '') {
        return;
    }

    const maxPages = 5; // Maximum number of pages to display

    // Calculate the starting page number
    let startPage = currentPage - Math.floor(maxPages / 2);
    startPage = Math.max(startPage, 1); // Ensure startPage is not less than 1

    // Calculate the ending page number
    let endPage = startPage + maxPages - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
    }

    // Render previous page arrow
    const prevPageButton = document.createElement('button');
    prevPageButton.textContent = '◄';
    prevPageButton.disabled = currentPage === 1; // Disable button if on first page
    prevPageButton.addEventListener('click', previousPage);
    paginationDiv.appendChild(prevPageButton);

    // Render page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            searchMovies();
        });
        paginationDiv.appendChild(pageButton);
    }

    // Render next page arrow
    const nextPageButton = document.createElement('button');
    nextPageButton.textContent = '►';
    nextPageButton.addEventListener('click', nextPage);
    paginationDiv.appendChild(nextPageButton);
}

function displayResults(data) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (!data || data.results.length === 0) {
        // Handle error or no results case
        return;
    }

    data.results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('movieItem');

        const img = document.createElement('img');
        img.alt = item.title || item.name;

        if (item.poster_path) {
            img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        } else {
            img.src = 'demo-image.png'; // Path to your demo image
        }

        img.style.cursor = 'pointer';
        img.onclick = () => {
            const searchTerm = encodeURIComponent(document.getElementById('searchInput').value.trim());
            window.location.href = `movieDetails.html?id=${item.id}&searchType=${currentSearchType}&query=${searchTerm}`;
        };

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('itemInfo');

        const titleContainer = document.createElement('div');
        titleContainer.classList.add('titleContainer');

        const title = document.createElement('p');
        title.classList.add('title');
        title.textContent = item.title || item.name;
        titleContainer.appendChild(title);

        if ((item.title && item.original_title && item.title !== item.original_title) ||
            (item.name && item.original_name && item.name !== item.original_name
            )) {
                const originalTitle = document.createElement('p');
                originalTitle.classList.add('originalTitle');
                originalTitle.textContent = item.original_title || item.original_name;
                titleContainer.appendChild(originalTitle);
            }
    
            infoDiv.appendChild(titleContainer);
    
            // Limit overview text to 280 characters with three dots (...) if necessary
            const overview = document.createElement('p');
            overview.classList.add('overview');
            overview.textContent = item.overview ? truncateText(item.overview, 263) : 'No overview available';
            infoDiv.appendChild(overview);
    
            const releaseDate = document.createElement('p');
            releaseDate.classList.add('year');
            releaseDate.textContent = item.release_date || item.first_air_date;
            infoDiv.appendChild(releaseDate);
    
            itemDiv.appendChild(img);
            itemDiv.appendChild(infoDiv);
            resultsDiv.appendChild(itemDiv);
        });
    }
    
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        } else {
            return text;
        }
    }
    
    function updateCounts() {
        const searchTermInput = document.getElementById('searchInput').value;
        const { searchTerm, year } = parseSearchTerm(searchTermInput);
    
        const types = ['movie', 'tv', 'person', 'collection', 'company'];
        types.forEach(type => {
            const options = {
                method: 'GET',
                url: `https://api.themoviedb.org/3/search/${type}`,
                params: {
                    api_key: '170e9c0b74242721b6786d03329c6fd8',
                    query: searchTerm,
                    page: 1
                }
            };
    
            // Include year filter in the request if provided
            if (year) {
                if (type === 'movie' || type === 'tv') {
                    options.params['year'] = year;
                }
            }
    
            axios.request(options).then(response => {
                const count = response.data.total_results;
                if (type === 'movie') {
                    document.getElementById('movieCount').textContent = `${count}`;
                } else if (type === 'tv') {
                    document.getElementById('tvCount').textContent = `${count}`;
                } else if (type === 'person') {
                    document.getElementById('peopleCount').textContent = `${count}`;
                } else if (type === 'collection') {
                    document.getElementById('collectionsCount').textContent = `${count}`;
                } else if (type === 'company') {
                    document.getElementById('companiesCount').textContent = `${count}`;
                }
            }).catch(error => {
                console.error(`Error fetching ${type} count:`, error);
            });
        });
    }
    
    function parseSearchTerm(searchTerm) {
        const regex = /(.+)\s+y:(\d{4})/; // Regular expression to match the search term and year filter
        const match = searchTerm.match(regex);
        if (match) {
            return {
                searchTerm: match[1].trim(),
                year: parseInt(match[2])
            };
        } else {
            return {
                searchTerm,
                year: null
            };
        }
    }
    
    // Initialize counts on page load
    updateCounts();
    
    document.addEventListener('DOMContentLoaded', () => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchTerm = queryParams.get('query');
        if (searchTerm) {
            document.getElementById('searchInput').value = decodeURIComponent(searchTerm);
            searchMovies(); // Trigger search if a search term is provided in the URL
        }
    });
