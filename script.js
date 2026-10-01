const pokemonContainer = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search-input");

const modal = document.getElementById("description-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalAbility = document.getElementById("modal-ability");
const modalDescription = document.getElementById("modal-description");

const closeModal = document.getElementById("close-modal");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");


// Store the 20 Pokémon
let pokemonList = [];

// Keep track of the Pokémon in the popup
let currentPokemonIndex = 0;


async function getPokemon() {

    try {

        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
        );

        const data = await response.json();


        // Fetch the details for all 20 Pokémon
        const pokemonDetails = await Promise.all(

            data.results.map(async (pokemon) => {

                const response = await fetch(pokemon.url);

                return await response.json();

            })

        );


        // Save the Pokémon
        pokemonList = pokemonDetails;


        // Show all Pokémon
        displayPokemon(pokemonList);

    } catch (error) {

        console.error("Error loading Pokémon:", error);

        pokemonContainer.innerHTML = `
            <p class="loading">
                Oops! We couldn't load the Pokémon.
                Please refresh the page.
            </p>
        `;
    }
}


function displayPokemon(pokemonArray) {

    // Clear the grid first
    pokemonContainer.innerHTML = "";


    // If there are no search results
    if (pokemonArray.length === 0) {

        pokemonContainer.innerHTML = `
            <p class="no-results">
                No Pokémon found 🔎
            </p>
        `;

        return;
    }


    // Create a card for every Pokémon
    pokemonArray.forEach((pokemon) => {

        const card = document.createElement("div");

        card.className = "pokemon-card";


        // Get official artwork
        const image =
            pokemon.sprites.other["official-artwork"].front_default;


        card.innerHTML = `
            <img
                src="${image}"
                alt="${pokemon.name}"
            >

            <h2>${pokemon.name}</h2>

            <button class="description-button">
                Description
            </button>
        `;


        // Get the button
        const button =
            card.querySelector(".description-button");


        // Open description
        button.addEventListener("click", () => {

            // Find the Pokémon in the original list
            currentPokemonIndex =
                pokemonList.findIndex(
                    item => item.id === pokemon.id
                );

            openDescription();

        });


        pokemonContainer.appendChild(card);

    });
}

searchInput.addEventListener("input", function () {

    // Get what the user typed
    const searchTerm =
        searchInput.value.toLowerCase().trim();


    // Filter the Pokémon by name
    const filteredPokemon =
        pokemonList.filter(function (pokemon) {

            return pokemon.name
                .toLowerCase()
                .includes(searchTerm);

        });


    // Show the results
    displayPokemon(filteredPokemon);

});


function openDescription() {

    updateModal();

    modal.style.display = "flex";
}


function updateModal() {

    const pokemon =
        pokemonList[currentPokemonIndex];


    // Image
    const image =
        pokemon.sprites.other["official-artwork"].front_default;

    modalImage.src = image;
    modalImage.alt = pokemon.name;


    // Name
    modalName.textContent =
        capitalize(pokemon.name);


    // Ability
    const ability =
        pokemon.abilities[0].ability.name;

    modalAbility.textContent =
        capitalize(ability);


    // Types
    const types =
        pokemon.types
            .map(type => type.type.name)
            .join(" and ");


    // Height
    const height =
        (pokemon.height / 10).toFixed(1);


    // Weight
    const weight =
        (pokemon.weight / 10).toFixed(1);


    // Fun description
    modalDescription.textContent =
        `${capitalize(pokemon.name)} is a ${types}-type Pokémon. ` +
        `It is ${height} meters tall and weighs ${weight} kg. ` +
        `Its special ability is ${capitalize(ability)}. `;


    // Previous button
    if (currentPokemonIndex === 0) {

        previousButton.disabled = true;

    } else {

        previousButton.disabled = false;

    }


    // Next button
    if (
        currentPokemonIndex === pokemonList.length - 1
    ) {

        nextButton.disabled = true;

    } else {

        nextButton.disabled = false;

    }
}

previousButton.addEventListener("click", function () {

    if (currentPokemonIndex > 0) {

        currentPokemonIndex--;

        updateModal();

    }

});


nextButton.addEventListener("click", function () {

    if (
        currentPokemonIndex <
        pokemonList.length - 1
    ) {

        currentPokemonIndex++;

        updateModal();

    }

});


closeModal.addEventListener("click", function () {

    modal.style.display = "none";

});


modal.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});


function capitalize(word) {

    return word.charAt(0).toUpperCase() + word.slice(1);

}


getPokemon();