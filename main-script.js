const inputBox = document.getElementById('input-box');
const resultsContainer = document.querySelector('.results-container');
const displayContainer = document.getElementById('show-container');
const paginationContainer = document.querySelector('.pagination-container');

let characters = [];
let currentPage = 1;
let filteredResults = []; 
const resultsPerPage = 12;

function isBookmarked(character) {
    const bookmarkedCharacters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
    return bookmarkedCharacters.some((c) => c.id === character.id);
}

function displayResults() {
    const showContainer = document.getElementById('show-container');
    showContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    const searchTerm = inputBox.value.trim().toLowerCase();
    filteredResults = characters.filter(
        (character) => character.name.toLowerCase().includes(searchTerm)
    );

    paginationContainer.style.display = filteredResults.length > 0 ? 'block' : 'none';

    const currentResults = filteredResults.slice(startIndex, endIndex);

    currentResults.forEach((character) => {
        const characterElement = createCharacterElement(character);
        showContainer.appendChild(characterElement);
    });

    updatePagination();
}

function createCharacterElement(character) {
    const characterElement = document.createElement('div');
    characterElement.classList.add('bg-gradient-to-r', 'from-slate-900', 'via-red-700', 'to-slate-900', 'rounded-xl');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('mb-2', 'flex', 'justify-center', 'items-center');

    const imageElement = document.createElement('img');
    imageElement.classList.add('character-image', 'w-80', 'h-72', 'object-fill');
    imageElement.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    imageElement.alt = character.name;

    const nameElement = document.createElement('div');
    nameElement.classList.add('character-name', 'text-white', 'mb-3', 'text-center');
    nameElement.textContent = character.name;

    const bookmarkElement = document.createElement('button');
    bookmarkElement.textContent = isBookmarked(character) ? 'Bookmarked' : 'Bookmark';
    bookmarkElement.classList.add('mt-2', 'mb-2', 'bg-red-600', 'text-white', 'p-1', 'rounded', 'hover:bg-red-700', 'focus:outline-none', 'block', 'mx-auto');
    bookmarkElement.addEventListener('click', () => bookmarkCharacter(character));

    imageContainer.appendChild(imageElement);
    characterElement.appendChild(imageContainer);
    characterElement.appendChild(nameElement);
    characterElement.appendChild(bookmarkElement);

    return characterElement;
}

function bookmarkCharacter(character) {
    const bookmarkedCharacters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
    const isAlreadyBookmarked = bookmarkedCharacters.some((c) => c.id === character.id);
    if (isAlreadyBookmarked) {
        const updatedBookmarks = bookmarkedCharacters.filter((c) => c.id !== character.id);
        localStorage.setItem('bookmarkedCharacters', JSON.stringify(updatedBookmarks));
    } else {
        bookmarkedCharacters.push(character);
        localStorage.setItem('bookmarkedCharacters', JSON.stringify(bookmarkedCharacters));
    }

    displayResults();
}

function displayBookmarkedCharacters() {
    const showContainer = document.getElementById('show-container');
    showContainer.innerHTML = '';

    paginationContainer.style.display = 'none';

    if (inputBox.value.trim() === '') {
        const bookmarkedCharacters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];

        bookmarkedCharacters.forEach((character) => {
            const characterElement = createCharacterElement(character);
            showContainer.appendChild(characterElement);
        });
    }
}
function updatePagination() {
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    paginationContainer.innerHTML = '';

    const leftArrow = createArrowButton('left', '←');
    leftArrow.addEventListener('click', () => navigatePage('prev'));

    paginationContainer.appendChild(leftArrow);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-item', 'mx-1', 'px-2', 'py-1', 'bg-gray-600', 'text-white', 'rounded', 'focus:outline-none', 'hover:bg-gray-700');

        if (i === currentPage) {
            pageButton.classList.add('current-page');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayResults();
        });

        paginationContainer.appendChild(pageButton);
    }

    const rightArrow = createArrowButton('right', '→');
    rightArrow.addEventListener('click', () => navigatePage('next'));

    paginationContainer.appendChild(rightArrow);

    paginationContainer.style.display = 'flex';
    paginationContainer.style.alignItems = 'center';
    paginationContainer.style.justifyContent = 'center';

    leftArrow.style.display = currentPage === 1 ? 'none' : 'block';
    rightArrow.style.display = currentPage === totalPages ? 'none' : 'block';
}


  function createArrowButton(direction, text) {
    const arrowButton = document.createElement('button');
    arrowButton.textContent = text;
    arrowButton.classList.add('pagination-item', 'mx-1', 'px-2', 'py-1', 'bg-gray-600', 'text-white', 'rounded', 'focus:outline-none', 'hover:bg-gray-700');
  
    arrowButton.classList.add(`pagination-${direction}-arrow`);
  
    return arrowButton;
  }
  
  function navigatePage(direction) {
    const totalPages = Math.ceil(characters.length / resultsPerPage);
  
    if (direction === 'prev' && currentPage > 1) {
      currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
      currentPage++;
    }
  
    displayResults();
  }
  
  inputBox.addEventListener('input', async () => {
    const searchTerm = inputBox.value.trim();

    currentPage = 1;

    if (searchTerm.length > 0) {
        characters = await searchMarvelCharacters(searchTerm);
        displayResults();
    } else {
        displayBookmarkedCharacters();
    }
});
displayBookmarkedCharacters();
