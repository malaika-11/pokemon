const pokemonContainer = document.getElementById("pokemon-container");

const modal = document.getElementById("description-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDescription = document.getElementById("modal-description");

const closeModal = document.getElementById("close-modal");

const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

let pokemonList = [];

let currentPokemonIndex = 0;


async function getPokemon() {

    try {

        pokemonContainer.innerHTML = "";

        for (let i = 1; i <= 20; i++) {

            const pokemonResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${i}`
            );

            const pokemon = await pokemonResponse.json();


            const speciesResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${i}`
            );

            const species = await speciesResponse.json();


            const englishDescription =
                species.flavor_text_entries.find(
                    entry => entry.language.name === "en"
                );


            let description = englishDescription
                ? englishDescription.flavor_text
                : "This Pokémon is full of surprises!";


            description = description
                .replace(/\n|\f/g, " ")
                .replace(/\s+/g, " ");


            pokemonList.push({
                name: pokemon.name,
                image: pokemon.sprites.front_default,
                description: description
            });


            createPokemonCard(
                pokemonList[pokemonList.length - 1],
                pokemonList.length - 1
            );
        }

    } catch (error) {

        console.error("Error loading Pokémon:", error);

        pokemonContainer.innerHTML = `
            <p class="loading">
                Oops! We couldn't load the Pokémon.
            </p>
        `;
    }
}

function createPokemonCard(pokemon, index) {

    const card = document.createElement("div");

    card.classList.add("pokemon-card");

    card.innerHTML = `
        <img
            src="${pokemon.image}"
            alt="${pokemon.name}"
        >

        <h2>${pokemon.name}</h2>

        <button class="description-button">
            Description
        </button>
    `;


    const button = card.querySelector(
        ".description-button"
    );


    button.addEventListener("click", () => {

        openDescription(index);

    });


    pokemonContainer.appendChild(card);
}

function openDescription(index) {

    currentPokemonIndex = index;

    updateModal();

    modal.style.display = "flex";
}

function updateModal() {

    const pokemon = pokemonList[currentPokemonIndex];


    modalImage.src = pokemon.image;

    modalImage.alt = pokemon.name;

    modalName.textContent = pokemon.name;

    modalDescription.textContent = pokemon.description;

    if (currentPokemonIndex === 0) {

        previousButton.disabled = true;

    } else {

        previousButton.disabled = false;

    }

    if (currentPokemonIndex === pokemonList.length - 1) {

        nextButton.disabled = true;

    } else {

        nextButton.disabled = false;

    }
}

previousButton.addEventListener("click", () => {

    if (currentPokemonIndex > 0) {

        currentPokemonIndex--;

        updateModal();
    }

});

nextButton.addEventListener("click", () => {

    if (currentPokemonIndex < pokemonList.length - 1) {

        currentPokemonIndex++;

        updateModal();
    }

});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});

getPokemon();