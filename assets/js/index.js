const pagination = document.querySelector('.pagination');
const cards = document.getElementById('cards');
const search = document.getElementById('search');

const url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21';

fetchAPI(url);
addSearchListener();

async function fetchAPI(url) {
    const data = await fetch(url);
    const result = await data.json();
    const pokemonResults = result.results;
    const paginationLinks = {
        previous: result.previous,
        next: result.next,
    };
    cards.innerHTML = '';
    pokemonResults.forEach(async (pokemonResult) => {
        await createCards(pokemonResult.url);
    });
    setTimeout(() => drawSeparators(), 800);
    createPaginationButtons(paginationLinks);
}

async function createCards(url) {
    const pokemonData = await fetch(url);
    const pokemon = await pokemonData.json();
    const pokemonImage = validateImage(
        pokemon.sprites.other.home.front_default
    );
    const pokemonCard = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemonImage,
        types: pokemon.types,
        species: pokemon.species,
        height: pokemon.height,
        weight: pokemon.weight,
        stats: pokemon.stats,
    };
    const card = await buildCard(pokemonCard);
    cards.innerHTML += card;
}

async function buildCard(data) {
    const { id, name, image, types, species, height, weight, stats } = data;
    let pokemonName = capitalize(name);
    let pokemonTypes = getTypes(types);
    let color = pokemonTypes.type;
    let pokemonDescription = await getDescription(species);
    let pokemonHeight = height / 10;
    let pokemonWeight = weight / 10;
    let pokemonStats = getStats(stats, color);

    return `
        <div class="col">
            <div class="card shadow-sm p-2">
                <div class="${color} rounded">
                    <div class="d-flex justify-content-between text-white px-3 py-2 fw-bold">
                        <h4 class="card-title fw-bold">${pokemonName}</h4>
                        <p class="m-0">#${id}</p>
                    </div>
                    <img src="${image}" class="pokemon d-block w-75" alt="${pokemonName}" />
                    <div class="bg-white m-1 pt-5 rounded">
                        <div class="d-flex justify-content-center gap-3">
                            ${pokemonTypes.badges}
                        </div>
                        <div class="d-flex justify-content-center">
                            <h5 class="${color}-text fw-bold">About</h5>
                        </div>
                        <p class="about-title mx-3 my-0 text-center">
                            ${pokemonDescription}
                        </p>
                        <div class="aboutContainer p-2 d-flex justify-content-evenly align-items-center">
                            <div class="text-center">
                                <div class="d-flex justify-content-between align-items-center">
                                    <i class="mx-2 fa-solid fa-ruler-vertical"></i>
                                    <p class="m-0">${pokemonHeight} m</p>
                                </div>
                                <p class="about-title m-0">Height</p>
                            </div>
                            <div class="aboutSeparator mx-2 border-end"></div>
                            <div class="text-center">
                                <div class="d-flex justify-content-between align-items-center">
                                    <i class="mx-2 fa-solid fa-weight-hanging"></i>
                                    <p class="m-0">${pokemonWeight} kg</p>
                                </div>
                                <p class="about-title m-0">Weight</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center">
                            <h5 class="${color}-text fw-bold">Stats</h5>
                        </div>
                        <div class="row px-3 pb-3 d-flex align-items-center">
                            <div class="col-5 pe-0">
                                ${pokemonStats.names}
                            </div>
                            <div class="col-1 p-0">
                                ${pokemonStats.values}
                            </div>
                            <div class="col-6 d-flex flex-column gap-3">
                                ${pokemonStats.bars}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function drawSeparators() {
    const aboutContainer =
        document.querySelector('.aboutContainer').offsetHeight;
    const aboutSeparator = document.querySelectorAll('.aboutSeparator');

    aboutSeparator.forEach((separator) => {
        separator.style.height = `calc(${aboutContainer}px - 1rem)`;
    });
}

function createPaginationButtons(links) {
    const { previous, next } = links;
    pagination.innerHTML = `
        <li class="page-item disabled" id="prevContainer">
            <button type="button" id="prevPage" class="page-link">
                Previous
            </button>
        </li>
        <li class="page-item disabled" id="nextContainer">
            <button type="button" id="nextPage" class="page-link">
                Next
            </button>
        </li>
    `;
    const prevContainer = document.getElementById('prevContainer');
    const nextContainer = document.getElementById('nextContainer');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (previous) {
        prevContainer.classList.remove('disabled');
        prevPage.addEventListener(
            'click',
            async () => await fetchAPI(previous)
        );
    }

    if (next) {
        nextContainer.classList.remove('disabled');
        nextPage.addEventListener('click', async () => await fetchAPI(next));
    }
}

function validateImage(image) {
    return image ? image : 'https://http.cat/404';
}

function getTypes(types) {
    let type = types[0].type.name;
    let badges = '';
    types.forEach((pokemonType) => {
        let name = pokemonType.type.name;
        badges += `<span class="${name} px-3 badge rounded-pill text-white my-3">${capitalize(
            name
        )}</span>`;
    });
    return { type, badges };
}

async function getDescription(species) {
    const data = await fetch(species.url);
    const specie = await data.json();
    const flavors = specie.flavor_text_entries.filter(
        (element) => element.language.name === 'en'
    );
    const index = Math.floor(Math.random() * flavors.length);
    return flavors[index].flavor_text.replace(/\n\f/g, ' ');
}

function getStats(stats, type) {
    let names = '';
    let values = '';
    let bars = '';

    stats.forEach((stat) => {
        let progress = stat.base_stat;
        names += `
            <p class="m-0 text-nowrap">
                ${capitalize(stat.stat.name).replace('Special-', 'Sp. ')}
            </p>
        `;
        values += `<p class="m-0 text-nowrap">${progress}</p>`;
        bars += `
            <div
                class="progress"
                role="progressbar"
                aria-valuenow="${progress / 2}"
                aria-valuemin="0"
                aria-valuemax="200"
                style="height: 8px; width: 100%"
            >
                <div 
                    class="${type} progress-bar" 
                    style="width: ${progress / 2}%"
                ></div>
            </div>
        `;
    });
    return { names, values, bars };
}

async function searchPokemon(pokemon) {
    pagination.innerHTML = '';
    cards.innerHTML = '';
    let newUrl = url.slice(0, url.indexOf('?')) + pokemon;
    await createCards(newUrl);
}

function addSearchListener() {
    search.addEventListener('submit', async (event) => {
        event.preventDefault();
        const pokemon = event.target.search.value.toLowerCase();
        await searchPokemon(pokemon);
        event.target.reset();
    });
}
