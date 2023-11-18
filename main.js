let input = document.getElementById("input-box");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");

let date = new Date();
console.log(date.getTime());

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function displayWords(value) {
  input.value = value;
  removeElements();
}

function removeElements() {
  listContainer.innerHTML = "";
  showContainer.innerHTML = "";
}

function displayFavorites() {
  Promise.all(
    favorites.map((characterId) =>
      fetch(
        `https://gateway.marvel.com:443/v1/public/characters/${characterId}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`
      ).then((response) => response.json())
    )
  )
    .then((characters) => {
      characters.forEach((character) => {
        const characterData = character.data.results[0];
        showContainer.innerHTML += `
          <div class="bg-gradient-to-r from-slate-900 via-red-700 to-slate-900 rounded-xl">
            <div class="mb-2 flex justify-center items-center">
              <img class="character-image" src="${characterData.thumbnail.path}.${characterData.thumbnail.extension}"/>
            </div>
            <div class="character-name text-white mb-3 text-center">${characterData.name}</div>
          </div>`;
      });
    })
    .catch((error) => {
      console.error("Error fetching character details:", error);
    });
}

input.addEventListener("input", async () => {
  removeElements();

  if (input.value.length < 1) {
    displayFavorites();
    return;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");
    div.setAttribute("onclick", "displayWords('" + name + "')");
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
    div.innerHTML = `<p class="item">${word}</p>`;
    listContainer.appendChild(div);
  });

  jsonData.data["results"].forEach((element) => {
    showContainer.innerHTML += `
      <div class="bg-gradient-to-r from-slate-900 via-red-700 to-slate-900 rounded-xl">
        <div class="mb-2 flex justify-center items-center">
          <img class="character-image" src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>
        </div>
        <div class="character-name text-white mb-3 text-center">${element.name}</div>
        <div class="text-center pb-4">
          <button class="favorite-button" onclick="toggleFavorite(${element.id}, event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
          </button>
        </div>
      </div>`;
  });

  if (input.value.length < 1) {
    displayFavorites();
  }
});

function toggleFavorite(characterId, event) {
    const icon = event.currentTarget.querySelector('svg');
    const isFavorite = favorites.includes(characterId);
  
    if (isFavorite) {
      favorites = favorites.filter((id) => id !== characterId);
      icon.style.fill = ""; 
    } else {
      favorites.push(characterId);
      icon.style.fill = "red"; 
    }
  
    localStorage.setItem("favorites", JSON.stringify(favorites));
  
    console.log("Favorites:", favorites);
  
    if (input.value.length < 1) {
      displayFavorites();
    }
  }
  