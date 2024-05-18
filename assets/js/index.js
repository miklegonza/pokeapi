const pagination = document.querySelector('.pagination');
const cards = document.getElementById('cards');

const url = 'https://pokeapi.co/api/v2/pokemon/';

const typeColors = {
    normal: '#a8a878',
    grass: '#78c850',
    ground: '#e0c068',
    fighting: '#c03028',
    rock: '#b8a038',
    steel: '#b8b8d0',
    fire: '#f08030',
    electric: '#f8d030',
    flying: '#a890f0',
    psychic: '#f85888',
    bug: '#a8b820',
    dragon: '#7038f8',
    water: '#6890f0',
    ice: '#98d8d8',
    poison: '#a040a0',
    dark: '#705848',
    ghost: '#705898',
    fairy: '#ffaec9',
};

fetchAPI(url);

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
        const pokemonData = await fetch(pokemonResult.url);
        const pokemon = await pokemonData.json();
        const pokemonCard = {
            id: pokemon.id,
            name: pokemon.name,
            abilities: pokemon.abilities,
            image: validateImage(pokemon.sprites.other.home.front_default),
        };
        cards.innerHTML += createCard(pokemonCard);
    });
    createPaginationButtons(paginationLinks);
}

function createCard(data) {
    const { id, image, name, abilities } = data;
    let pokemonName = capitalize(name);
    let abilitiesList = '';
    abilities.forEach((ability) => {
        abilitiesList += `<li class="list-group-item">${ability.ability.name}</li>`;
    });
    return `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${image}" class="card-img-top"  alt="..." />
                <div class="card-body">
                    <h5 class="card-title">${id}. ${pokemonName}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item fw-bold">Abilities</li>
                    ${abilitiesList}
                </ul>
            </div>
        </div>
    `;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
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
