const url = 'https://pokeapi.co/api/v2/pokemon/';

const data = fetch(url);

data.then((result) => result.json()).then((result) => {
    const pokemonResults = result.results;
    pokemonResults.forEach((pokemon) => {
        const pokemonEndpoint = pokemon.url;
        const pokemonData = fetch(pokemonEndpoint);
        pokemonData
            .then((result) => result.json())
            .then((result) => {
                const pokemonImage = result.sprites.other.home.front_default;
                const pokemonName = result.name;
                const pokemonAbilities = result.abilities;

                createCard(pokemonImage, pokemonName, pokemonAbilities);
            });
    });
});

function createCard(image, name, abilities) {
    const cards = document.getElementById('cards');
    let pokemonName = capitalize(name);
    let abilitiesList = '';
    abilities.forEach((ability) => {
        abilitiesList += `<li class="list-group-item">${ability.ability.name}</li>`;
    });
    cards.innerHTML += `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${image}" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">${pokemonName}</h5>
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
