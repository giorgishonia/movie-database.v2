document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const searchType = urlParams.get('searchType'); // Retrieve the searchType from the URL

    // Define baseUrl here
    const baseUrl = 'https://api.themoviedb.org/3';

    if (id && searchType) {
        let detailsUrl;
        switch (searchType) {
            case 'movie':
                detailsUrl = `${baseUrl}/movie/${id}`;
                break;
            case 'tv':
                detailsUrl = `${baseUrl}/tv/${id}`;
                break;
            case 'person':
                detailsUrl = `${baseUrl}/person/${id}`;
                break;
            case 'collection':
                detailsUrl = `${baseUrl}/collection/${id}`;
                break;
            case 'company':
                detailsUrl = `${baseUrl}/company/${id}`;
                break;
            default:
                console.error('Invalid search type');
                return;
        }

        const detailsOptions = {
            method: 'GET',
            url: detailsUrl,
            params: { api_key: '170e9c0b74242721b6786d03329c6fd8' }
        };

        try {
            const detailsResponse = await axios.request(detailsOptions);
            const detailsData = detailsResponse.data;

            const detailsDiv = document.getElementById('movieDetails');
            detailsDiv.innerHTML = '';

            // Create a new container for the content up to the rating
            const contentContainer = document.createElement('div');
            contentContainer.className = 'content-container';

            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            contentContainer.appendChild(overlay);

            // Set backdrop image as background
            if (detailsData.backdrop_path) {
                overlay.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${detailsData.backdrop_path}')`;
            }

            const img = document.createElement('img');
            img.crossOrigin = "Anonymous"; // To avoid CORS issues with Color Thief
            if (detailsData.poster_path) {
                img.src = `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`;
            } else {
                img.src = 'default_poster_image.png'; // Path to your default poster image
            }
            img.alt = `Poster of ${detailsData.title || detailsData.name}`;
            contentContainer.appendChild(img);

            // Use Color Thief to get the dominant color of the poster image
            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                const rgbaColor = `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.6)`;
                overlay.style.backgroundColor = rgbaColor;
            };

            const title = document.createElement('h2');
            title.textContent = detailsData.title || detailsData.name;
            contentContainer.appendChild(title);

            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Release Date: ${detailsData.release_date || detailsData.first_air_date}`;
            contentContainer.appendChild(releaseDate);

            const overview = document.createElement('p');
            overview.textContent = detailsData.overview;
            contentContainer.appendChild(overview);

            const rating = document.createElement('p');
            rating.textContent = `Rating: ${detailsData.vote_average}`;
            contentContainer.appendChild(rating);

            detailsDiv.appendChild(contentContainer);

            // Display credits for movies and TV shows
            if (searchType === 'movie' || searchType === 'tv') {
                const creditsResponse = await axios.get(`${baseUrl}/${searchType}/${id}/credits`, {
                    params: { api_key: '170e9c0b74242721b6786d03329c6fd8' }
                });
                const creditsData = creditsResponse.data;
                displayCredits(creditsData, detailsDiv, urlParams);
            }
        } catch (error) {
            console.error(error);
        }
    }
});

function displayCredits(creditsData, detailsDiv, urlParams) {
    const actors = creditsData.cast;

    // Create actors container
    const actorsContainer = document.createElement('div');
    actorsContainer.classList.add('carousel-container');
    const actorsHeader = document.createElement('h3');
    actorsHeader.textContent = 'Top Billed Cast';
    actorsContainer.appendChild(actorsHeader);
    const actorsList = document.createElement('div');
    actorsList.classList.add('carousel-list');

    actors.slice(0, 9).forEach(actor => {
        const actorItem = document.createElement('div');
        actorItem.classList.add('carousel-item');

        const actorContainer = document.createElement('div');
        actorContainer.classList.add('actor-container');

        const actorImage = document.createElement('img');
        actorImage.classList.add('actor-image');
        if (actor.profile_path) {
            actorImage.src = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
        } else {
            actorImage.src = actor.gender === 1 ? 'default_woman_image.png' : 'default_man_image.png';
        }
        actorImage.alt = actor.name;
        actorContainer.appendChild(actorImage);

        const actorDetails = document.createElement('div');
        actorDetails.classList.add('actor-details');

        let actorName = actor.name.split(' ').slice(0, 2).join(' '); // Limit to first two words
        const actorNameElement = document.createElement('p');
        actorNameElement.classList.add('actor-name');
        actorNameElement.textContent = actorName;
        actorDetails.appendChild(actorNameElement);

        if (actor.character) {
            const actorRole = document.createElement('p');
            actorRole.classList.add('actor-role');
            actorRole.textContent = actor.character.split(' ').join('\n'); // Split role into separate lines
            actorDetails.appendChild(actorRole);
        }

        actorContainer.appendChild(actorDetails);
        actorItem.appendChild(actorContainer);
        actorsList.appendChild(actorItem);
    });

    actorsContainer.appendChild(actorsList);

    const showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'Show More';
    showMoreButton.classList.add('show-more-button');
    showMoreButton.onclick = () => {
        window.location.href = `full_cast_and_crew.html?id=${urlParams.get('id')}&searchType=${urlParams.get('searchType')}`;
    };
    actorsContainer.appendChild(showMoreButton);

    detailsDiv.appendChild(actorsContainer);

    // Add drag functionality to carousel
    let isDown = false;
    let startX;
    let scrollLeft;

    actorsList.addEventListener('mousedown', (e) => {
        isDown = true;
        actorsList.classList.add('active');
        startX = e.pageX - actorsList.offsetLeft;
        scrollLeft = actorsList.scrollLeft;
    });

    actorsList.addEventListener('mouseleave', () => {
        isDown = false;
        actorsList.classList.remove('active');
    });

    actorsList.addEventListener('mouseup', () => {
        isDown = false;
        actorsList.classList.remove('active');
    });

    actorsList.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - actorsList.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        actorsList.scrollLeft = scrollLeft - walk;
    });
}
