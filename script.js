

const characterImages = {
  "Luke Skywalker": "https://starwars-visualguide.com/assets/img/characters/1.jpg",
  "Darth Vader": "https://starwars-visualguide.com/assets/img/characters/4.jpg",
  "Leia Organa": "https://starwars-visualguide.com/assets/img/characters/5.jpg",
  "Han Solo": "https://starwars-visualguide.com/assets/img/characters/14.jpg",
  "Chewbacca": "https://starwars-visualguide.com/assets/img/characters/13.jpg",
  "R2-D2": "https://starwars-visualguide.com/assets/img/characters/3.jpg",
  "C-3PO": "https://starwars-visualguide.com/assets/img/characters/2.jpg",
  "Yoda": "https://starwars-visualguide.com/assets/img/characters/20.jpg",
  "Boba Fett": "https://starwars-visualguide.com/assets/img/characters/22.jpg",
  "Rey": "https://starwars-visualguide.com/assets/img/characters/82.jpg",
};

async function fetchName(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    return data.name || "Unknown";
  } catch (error) {
    console.error("Error resolving URL:", url, error);
    return "Unknown";
  }
}

async function createCharacterCard(character) {
  const imageUrl = characterImages[character.name] || "https://starwars-visualguide.com/assets/img/placeholder.jpg";

  const homeworldName = await fetchName(character.homeworld);
  const starshipNames = await Promise.all(character.starships.map(fetchName));
  const vehicleNames = await Promise.all(character.vehicles.map(fetchName));

  const div = document.createElement("div");
  div.className = "character";
  div.innerHTML = `
    <img src="${imageUrl}" alt="${character.name}" class="character-img" />
    <h3>${character.name}</h3>
    <p><strong>Birth Year:</strong> ${character.birth_year}</p>
    <p><strong>Gender:</strong> ${character.gender}</p>
    <p><strong>Eye Color:</strong> ${character.eye_color}</p>
    <p><strong>Hair Color:</strong> ${character.hair_color}</p>
    <p><strong>Skin Color:</strong> ${character.skin_color}</p>
    <p><strong>Homeworld:</strong> ${homeworldName}</p>
    <p><strong>Starships:</strong> ${starshipNames.length > 0 ? starshipNames.join(', ') : 'None'}</p>
    <p><strong>Vehicles:</strong> ${vehicleNames.length > 0 ? vehicleNames.join(', ') : 'None'}</p>
  `;
  return div;
}

async function displayCharacters(characters) {
  const container = document.getElementById("characters");
  container.innerHTML = "";

  if (characters.length === 0) {
    container.innerHTML = "<p>No characters found.</p>";
    return;
  }

  for (const character of characters) {
    const card = await createCharacterCard(character);
    container.appendChild(card);
  }
}

async function searchCharacters(name) {
  try {
    const url = `https://swapi.py4e.com/api/people/?search=${encodeURIComponent(name)}`;
    console.log("Searching:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Results:", data);

    await displayCharacters(data.results);
  } catch (error) {
    console.error("Error fetching characters:", error);
    document.getElementById("characters").innerHTML = "<p>Error loading characters.</p>";
  }
}

document.getElementById("searchButton").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (searchTerm) {
    searchCharacters(searchTerm);
  }
});


