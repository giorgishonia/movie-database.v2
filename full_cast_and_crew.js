document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const searchType = urlParams.get('searchType');

    const baseUrl = 'https://api.themoviedb.org/3';

    if (id && searchType) {
        const detailsUrl = `${baseUrl}/${searchType}/${id}/credits`;
        const detailsOptions = {
            method: 'GET',
            url: detailsUrl,
            params: { api_key: '170e9c0b74242721b6786d03329c6fd8' }
        };

        try {
            const detailsResponse = await axios.request(detailsOptions);
            const detailsData = detailsResponse.data;

            const detailsDiv = document.getElementById('fullCastAndCrew');
            detailsDiv.innerHTML = '';

            displayFullCredits(detailsData, detailsDiv);
        } catch (error) {
            console.error(error);
        }
    }
});

function displayFullCredits(creditsData, detailsDiv) {
    const actors = creditsData.cast;
    const crew = creditsData.crew;

    // Actors Section
    const actorsSection = document.createElement('div');
    const actorsHeader = document.createElement('h2');
    actorsHeader.textContent = 'Full Cast';
    actorsSection.appendChild(actorsHeader);
    const actorsList = document.createElement('div');
    actorsList.classList.add('actors-list');

    actors.forEach(actor => {
        const actorItem = document.createElement('div');
        actorItem.classList.add('actor-item');

        const actorImage = document.createElement('img');
        actorImage.classList.add('actor-image');
        if (actor.profile_path) {
            actorImage.src = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
        } else {
            actorImage.src = actor.gender === 1 ? 'default_woman_image.png' : 'default_man_image.png';
        }
        actorImage.alt = actor.name;
        actorItem.appendChild(actorImage);

        const actorName = document.createElement('p');
        actorName.classList.add('actor-name');
        actorName.textContent = actor.name;
        actorItem.appendChild(actorName);

        if (actor.character) {
            const actorRole = document.createElement('p');
            actorRole.classList.add('actor-role');
            actorRole.textContent = actor.character;
            actorItem.appendChild(actorRole);
        }

        actorsList.appendChild(actorItem);
    });

    actorsSection.appendChild(actorsList);
    detailsDiv.appendChild(actorsSection);

    // Crew Section
    if (crew && crew.length > 0) {
        const crewSection = document.createElement('div');
        const crewHeader = document.createElement('h2');
        crewHeader.textContent = 'Full Crew';
        crewSection.appendChild(crewHeader);
        const crewList = document.createElement('div');
        crewList.classList.add('crew-list');

        crew.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.classList.add('crew-item');

            const memberName = document.createElement('p');
            memberName.textContent = member.name;
            memberItem.appendChild(memberName);

            const memberJob = document.createElement('p');
            memberJob.textContent = member.job;
            memberItem.appendChild(memberJob);

            crewList.appendChild(memberItem);
        });

        crewSection.appendChild(crewList);
        detailsDiv.appendChild(crewSection);
    }
}
