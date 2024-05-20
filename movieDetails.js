document.addEventListener('DOMContentLoaded', async () => {
    const loadingLine = document.getElementById('progressBar');
    if (loadingLine) {
        loadingLine.style.display = 'block';
        await animateLoadingLine();
        loadingLine.style.display = 'none';
    } else {
        console.error('Progress bar element not found');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const searchType = urlParams.get('searchType');
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = '170e9c0b74242721b6786d03329c6fd8';

    if (id && searchType) {
        try {
            let detailsUrl;
            switch (searchType) {
                case 'movie':
                case 'tv':
                case 'person':
                case 'collection':
                case 'company':
                    detailsUrl = `${baseUrl}/${searchType}/${id}`;
                    break;
                default:
                    console.error('Invalid search type');
                    return;
            }

            const detailsOptions = {
                method: 'GET',
                url: detailsUrl,
                params: { api_key: apiKey }
            };

            const detailsResponse = await axios.request(detailsOptions);
            const detailsData = detailsResponse.data;
            console.log('Details Data:', detailsData);


            const rightDiv = document.querySelector('.right-div');
            if (rightDiv) {
                const originalNameTitle = document.createElement('h2');
                originalNameTitle.textContent = 'Original Name';
                rightDiv.appendChild(originalNameTitle);

                const originalName = document.createElement('p');
                originalName.textContent = detailsData.original_name || 'N/A';
                rightDiv.appendChild(originalName);
            }
            const movieDetailsDiv = document.getElementById('movieDetails');
            movieDetailsDiv.style.display = 'block';
            movieDetailsDiv.innerHTML = '';

            const contentContainer = document.createElement('div');
            contentContainer.className = 'content-container';
            contentContainer.style.position = 'relative';

            if (detailsData.backdrop_path) {
                contentContainer.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${detailsData.backdrop_path}')`;
                contentContainer.style.backgroundSize = 'cover';
                contentContainer.style.backgroundRepeat = 'no-repeat';
            }

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            contentContainer.appendChild(overlay);

            const mtyvneli = document.createElement('div');
            mtyvneli.classList.add('mtyvneli');

            const movieImgWrapper = document.createElement('div');
            movieImgWrapper.classList.add('movieimg-wrapper');

            const img = document.createElement('img');
            if (detailsData.poster_path) {
                img.src = `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`;
            } else {
                img.src = 'default_poster_image.png';
            }
            img.alt = `Poster of ${detailsData.title || detailsData.name}`;
            movieImgWrapper.appendChild(img);
            mtyvneli.appendChild(movieImgWrapper);

            const movieInfoWrapper = document.createElement('div');
            movieInfoWrapper.classList.add('movieinfo-wrapper');

            const title = document.createElement('a');
            title.textContent = detailsData.title || detailsData.name;
            movieInfoWrapper.appendChild(title);

            const infoLine = document.createElement('p');
            const rating = detailsData.content_ratings && detailsData.content_ratings.results && detailsData.content_ratings.results[0] ? detailsData.content_ratings.results[0].rating : 'NR';
            const releaseDate = detailsData.release_date || 'N/A';
            const originCountry = detailsData.origin_country && detailsData.origin_country.length > 0 ? detailsData.origin_country.join(', ') : 'N/A';
            const genres = detailsData.genres && detailsData.genres.length > 0 ? detailsData.genres.map(genre => genre.name).join(', ') : 'N/A';
            const movieLength = detailsData.runtime || 'N/A';
            infoLine.textContent = `${rating} | ${releaseDate} | ${originCountry} | ${genres} | ${movieLength}m`;
            movieInfoWrapper.appendChild(infoLine);

            const userScoreContainer = document.createElement('div');
            userScoreContainer.classList.add('user-score-container');

            const voteAverage = detailsData.vote_average;
            const roundedScore = Math.floor(voteAverage * 10);
            const scoreColor = getScoreColor(roundedScore);

            const circularProgress = document.createElement('div');
            circularProgress.classList.add('circular-progress');

            const innerCircle = document.createElement('div');
            innerCircle.classList.add('inner-circle');
            innerCircle.style.background = `conic-gradient(${scoreColor} ${roundedScore}%, transparent ${roundedScore}%)`;

            const percentageText = document.createElement('button');
            percentageText.textContent = `${roundedScore}%`;
            percentageText.classList.add('percentage');

            circularProgress.appendChild(innerCircle);
            circularProgress.appendChild(percentageText);
            userScoreContainer.appendChild(circularProgress);
            movieInfoWrapper.appendChild(userScoreContainer);

            const tagline = document.createElement('p');
            tagline.textContent = detailsData.tagline;
            movieInfoWrapper.appendChild(tagline);

            const overviewTitle = document.createElement('h3');
            overviewTitle.textContent = 'Overview';
            overviewTitle.classList.add('overview-title');
            movieInfoWrapper.appendChild(overviewTitle);

            const overview = document.createElement('p');
            overview.textContent = detailsData.overview || 'No overview available';
            overview.classList.add('overview');
            movieInfoWrapper.appendChild(overview);

            const createdBy = document.createElement('div');
            createdBy.classList.add('created-by');

            if (detailsData.created_by && Array.isArray(detailsData.created_by)) {
                const createdByText = document.createElement('h3');
                createdByText.textContent = `${detailsData.created_by.map(creator => creator.name).join(', ')}`;
                createdByText.classList.add('created-by-text');
                createdBy.appendChild(createdByText);

                const creatorText = document.createElement('p');
                creatorText.textContent = 'Creator';
                creatorText.classList.add('creator-text');
                createdBy.appendChild(creatorText);
            } else {
                const createdByText = document.createElement('p');
                createdByText.textContent = 'N/A';
                createdByText.classList.add('created-by-text');
                createdBy.appendChild(createdByText);

                const creatorText = document.createElement('p');
                creatorText.textContent = 'Creator';
                creatorText.classList.add('creator-text');
                createdBy.appendChild(creatorText);
            }

            
            movieInfoWrapper.appendChild(createdBy);

            if (detailsData.credits) {
                const credits = document.createElement('p');
                const crew = detailsData.credits.crew.slice(0, 3).map(person => `${person.name} (${person.job})`).join(', ');
                credits.textContent = crew || 'No credits available';
                movieInfoWrapper.appendChild(credits);
            }

            mtyvneli.appendChild(movieInfoWrapper);
            contentContainer.appendChild(mtyvneli);
            movieDetailsDiv.appendChild(contentContainer);

            if (searchType === 'movie' || searchType === 'tv') {
                const creditsResponse = await axios.get(`${baseUrl}/${searchType}/${id}/credits`, {
                    params: { api_key: apiKey }
                });
                const creditsData = creditsResponse.data;
                displayCredits(creditsData, movieDetailsDiv, urlParams, detailsData); // Pass detailsData
                const trailerData = await fetchTrailers(id, searchType);
                if (trailerData) {
                    const trailerKey = trailerData.key;
                    const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

                    const trailerButton = document.createElement('button');
                    trailerButton.textContent = '► Play Trailer';
                    trailerButton.classList.add('play-trailer-button');

                    trailerButton.addEventListener('click', () => {
                        window.open(trailerUrl, '_blank');
                    });

                    movieInfoWrapper.appendChild(trailerButton);
                } else {
                    console.log('No trailer available');
                }
            } else {
                console.error('Invalid search type');
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }
});

async function animateLoadingLine() {
    const loadingLine = document.getElementById('progressBar');
    if (loadingLine) {
        const pageWidth = document.documentElement.scrollWidth;
        const animationDuration = 1500;
        await new Promise(resolve => {
            loadingLine.style.width = `${pageWidth}px`;
            setTimeout(resolve, animationDuration);
        });
    } else {
        console.error('Progress bar element not found');
    }
}


function displayCredits(creditsData, detailsDiv, urlParams, detailsData) {
    const actors = creditsData.cast;
    const actorsContainer = document.createElement('div');
    actorsContainer.classList.add('carousel-container');
    const actorsHeader = document.createElement('h3');
    actorsHeader.textContent = 'Top Billed Cast';
    actorsContainer.appendChild(actorsHeader);
    const actorsList = document.createElement('div');
    actorsList.classList.add('carousel-list');
    
    function mapLanguageCodeToName(languageCode) {
        const languageMap = {
            'af': 'Afrikaans',
            'sq': 'Albanian',
            'am': 'Amharic',
            'ar': 'Arabic',
            'hy': 'Armenian',
            'az': 'Azerbaijani',
            'eu': 'Basque',
            'be': 'Belarusian',
            'bn': 'Bengali',
            'bs': 'Bosnian',
            'bg': 'Bulgarian',
            'ca': 'Catalan',
            'ceb': 'Cebuano',
            'ny': 'Chichewa',
            'zh': 'Chinese (Simplified)',
            'zh-TW': 'Chinese (Traditional)',
            'co': 'Corsican',
            'hr': 'Croatian',
            'cs': 'Czech',
            'da': 'Danish',
            'nl': 'Dutch',
            'eo': 'Esperanto',
            'et': 'Estonian',
            'tl': 'Filipino',
            'fi': 'Finnish',
            'fr': 'French',
            'fy': 'Frisian',
            'gl': 'Galician',
            'ka': 'Georgian',
            'de': 'German',
            'el': 'Greek',
            'gu': 'Gujarati',
            'ht': 'Haitian Creole',
            'ha': 'Hausa',
            'haw': 'Hawaiian',
            'iw': 'Hebrew',
            'hi': 'Hindi',
            'hmn': 'Hmong',
            'hu': 'Hungarian',
            'is': 'Icelandic',
            'ig': 'Igbo',
            'id': 'Indonesian',
            'ga': 'Irish',
            'it': 'Italian',
            'ja': 'Japanese',
            'jw': 'Javanese',
            'kn': 'Kannada',
            'kk': 'Kazakh',
            'km': 'Khmer',
            'ko': 'Korean',
            'ku': 'Kurdish (Kurmanji)',
            'ky': 'Kyrgyz',
            'lo': 'Lao',
            'la': 'Latin',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'lb': 'Luxembourgish',
            'mk': 'Macedonian',
            'mg': 'Malagasy',
            'ms': 'Malay',
            'ml': 'Malayalam',
            'mt': 'Maltese',
            'mi': 'Maori',
            'mr': 'Marathi',
            'mn': 'Mongolian',
            'my': 'Myanmar (Burmese)',
            'ne': 'Nepali',
            'no': 'Norwegian',
            'ps': 'Pashto',
            'fa': 'Persian',
            'pl': 'Polish',
            'pt': 'Portuguese',
            'pa': 'Punjabi',
            'ro': 'Romanian',
            'ru': 'Russian',
            'sm': 'Samoan',
            'gd': 'Scots Gaelic',
            'sr': 'Serbian',
            'st': 'Sesotho',
            'sn': 'Shona',
            'sd': 'Sindhi',
            'si': 'Sinhala',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'so': 'Somali',
            'es': 'Spanish',
            'su': 'Sundanese',
            'sw': 'Swahili',
            'sv': 'Swedish',
            'tg': 'Tajik',
            'ta': 'Tamil',
            'te': 'Telugu',
            'th': 'Thai',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'ug': 'Uyghur',
            'uz': 'Uzbek',
            'vi': 'Vietnamese',
            'cy': 'Welsh',
            'xh': 'Xhosa',
            'yi': 'Yiddish',
            'yo': 'Yoruba',
            'zu': 'Zulu'
        };
    
        return languageMap[languageCode] || 'N/A';
    }


    // Right div to display additional information
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('right-div');

    // Facts title
    const factsTitleContainer = document.createElement('div');
    const factsTitle = document.createElement('p');
    factsTitle.textContent = 'Facts';
    factsTitle.style.fontWeight = 'bold';
    factsTitle.style.fontSize = 'larger';
    factsTitleContainer.appendChild(factsTitle);
    rightDiv.appendChild(factsTitleContainer);

    // Display original name, type, network, original language, and status
    const originalNameContainer = document.createElement('div');
    const originalNameTitle = document.createElement('p');
    originalNameTitle.textContent = 'Original Name';
    originalNameTitle.style.fontWeight = 'bold';
    originalNameContainer.appendChild(originalNameTitle);

    const originalName = document.createElement('p');
    originalName.textContent = detailsData.original_name || detailsData.original_title;
    originalName.style.fontSize = 'smaller';
    originalNameContainer.appendChild(originalName);

    rightDiv.appendChild(originalNameContainer);

    const typeContainer = document.createElement('div');
    const typeTitle = document.createElement('p');
    typeTitle.textContent = 'Type';
    typeTitle.style.fontWeight = 'bold';
    typeContainer.appendChild(typeTitle);

    const type = document.createElement('p');
    type.textContent = detailsData.type || 'N/A';
    type.style.fontSize = 'smaller';
    typeContainer.appendChild(type);

    rightDiv.appendChild(typeContainer);
    
    if (detailsData.networks && detailsData.networks.length > 0) {
        const networkContainer = document.createElement('div');

        const networkTitle = document.createElement('p');
        networkTitle.textContent = "Network";
        networkTitle.style.fontWeight = 'bold';
        networkContainer.appendChild(networkTitle);

        const networkLogo = document.createElement('img');
        const network = detailsData.networks[0]; // Assuming only one network is available
        networkLogo.src = `https://image.tmdb.org/t/p/original${network.logo_path}`;
        networkLogo.alt = network.name;
        networkContainer.appendChild(networkLogo);

        rightDiv.appendChild(networkContainer);
    } else {
        const networkTitle = document.createElement('p');
        networkTitle.textContent = 'Network';
        networkTitle.style.fontWeight = 'bold';
        rightDiv.appendChild(networkTitle);

        const network = document.createElement('p');
        network.textContent = 'N/A';
        network.style.fontSize = 'smaller';
        rightDiv.appendChild(network);
    }

    const originalLanguageContainer = document.createElement('div');
    const originalLanguageTitle = document.createElement('p');
    originalLanguageTitle.textContent = 'Original Language';
    originalLanguageTitle.style.fontWeight = 'bold';
    originalLanguageContainer.appendChild(originalLanguageTitle);

    const originalLanguage = document.createElement('p');
    originalLanguage.textContent = mapLanguageCodeToName(detailsData.original_language) || 'N/A';
    originalLanguage.style.fontSize = 'smaller';
    originalLanguageContainer.appendChild(originalLanguage);

    rightDiv.appendChild(originalLanguageContainer);

    const statusContainer = document.createElement('div');
    const statusTitle = document.createElement('p');
    statusTitle.textContent = 'Status';
    statusTitle.style.fontWeight = 'bold';
    statusContainer.appendChild(statusTitle);

    const status = document.createElement('p');
    status.textContent = detailsData.status || 'N/A';
    status.style.fontSize = 'smaller';
    statusContainer.appendChild(status);

    rightDiv.appendChild(statusContainer);

    const bottomWrapper = document.createElement('div');
    bottomWrapper.classList.add('bottom-wrapper');

    bottomWrapper.appendChild(actorsList); // Add carousel-list to bottom-wrapper
    bottomWrapper.appendChild(rightDiv);

    actorsContainer.appendChild(bottomWrapper);

    detailsDiv.appendChild(actorsContainer);

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

    const showMoreItem = document.createElement('div');
    showMoreItem.classList.add('carousel-item');

    const showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'View More →';
    showMoreButton.classList.add('show-more-button');
    showMoreButton.onclick = () => {
        window.location.href = `full_cast_and_crew.html?id=${urlParams.get('id')}&searchType=${urlParams.get('searchType')}`;
    };

    showMoreItem.appendChild(showMoreButton);
    actorsList.appendChild(showMoreItem);

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
        const walk = (x - startX) * 3;
        actorsList.scrollLeft = scrollLeft - walk;
    });

    // Trailer button
    const trailerButton = document.createElement('button');
    trailerButton.textContent = 'Watch Trailer';
    trailerButton.classList.add('trailer-button');
    trailerButton.onclick = () => {
        if (detailsData.videos && detailsData.videos.results.length > 0) {
            const trailerKey = detailsData.videos.results[0].key;
            window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
        } else {
            alert('Trailer not available');
        }
    };
    rightDiv.appendChild(trailerButton);
}


async function fetchTrailers(id, searchType) {
    const contentType = searchType === 'movie' ? 'movie' : 'tv';
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = '170e9c0b74242721b6786d03329c6fd8';
    try {
        const response = await fetch(`${baseUrl}/${contentType}/${id}/videos?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        console.log('Trailers Data:', data);

        if (data.results && data.results.length > 0) {
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                return trailer;
            } else {
                console.log('No suitable trailer found');
            }
        } else {
            console.log('No trailers available');
        }
    } catch (error) {
        console.error('Error fetching trailers:', error);
    }

    return null;
}

function getScoreColor(score) {
    if (score < 40) {
        return 'red';
    } else if (score < 60) {
        return 'orange';
    } else if (score < 80) {
        return 'yellow';
    } else if (score < 90) {
        return 'rgba(113, 206, 32, 1)';
    } else {
        return 'rgba(32, 206, 122, 1)';
    }
}
