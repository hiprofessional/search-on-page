function handleSearch(searchCallback) {
  const searchInputSelector = 'searchInput';
  document.getElementById(searchInputSelector).addEventListener('keyup', function (event) {
    searchCallback(event.target.value)
  });
}

function searchFunction(searchValue) {
  searchValue = searchValue.toLowerCase();
  if (searchValue.length === 0) {
    renderResults([]);
    return;
  }

  // get links
  const allItems = document.querySelectorAll('.main-content a');
  // search
  // const level1items = level1search(searchValue, allItems);
  const level2items = level2search(searchValue, allItems);
  // render
  renderResults(level2items);
}

function renderResults(itemsToShow) {
  const searchResultsContainer = document.getElementById('searchResults');

  const items = itemsToShow.map((item) => {
    return `<li>${item}</li>`
  }).join('');

  let result = `<ul>${items}</ul>
    <div class='foundCounter'>${itemsToShow.length} items found</div>
  `;

  searchResultsContainer.innerHTML = result;

  if (itemsToShow.length > 0) {
    searchResultsContainer.classList.add('visible');
  } else {
    searchResultsContainer.classList.remove('visible');
  }
}


function level1search(searchValue, allItems) {
  const result = [];
  allItems.forEach(el => {
    if (el.text.toLowerCase().includes(searchValue)) {
      result.push(`<a href="${el.href}">${simpleHighlight(el.text, searchValue)}</a>`);
    }
  });
  return result;
}

function simpleHighlight(text, searchValue) {
  const startIndex = text.toLowerCase().indexOf(searchValue);
  const result = [
    text.slice(0, startIndex),
    `<span class='highlight'>`,
    text.slice(startIndex, startIndex + searchValue.length),
    `</span>`,
    text.slice(startIndex + searchValue.length)
  ].join('');
  return result;
}

function level2search_v1(searchValue, allItems) {
  const result = [];
  allItems.forEach(el => {
    const searchResult = fuzzySearch(searchValue, el.text.toLowerCase());
    if (searchResult) {
      result.push(`<a href="${el.href}">${el.text}</a>`);
    }
  });
  return result;
}

function fuzzySearch(searchValue, text) {
  const textLength = text.length;
  const searchValueLength = searchValue.length;

  if (searchValueLength > textLength) {
    return false;
  }

  if (searchValueLength === textLength) {
    return searchValue === text;
  }

  outer: for (let i = 0, j = 0; i < searchValueLength; i++) {
    const searchValueChar = searchValue.charCodeAt(i);
    while (j < textLength) {
      if (text.charCodeAt(j++) === searchValueChar) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

function level2search(searchValue, allItems) {
  const result = [];
  allItems.forEach(el => {
    const positions = fuzzySearch_v2(searchValue, el.text.toLowerCase());
    if (positions.length > 0) {
      result.push(`<a href="${el.href}">${highlightByPositions(el.text, positions)}</a>`);
    }
  });
  return result;
}

function fuzzySearch_v2(searchValue, text) {
  const textLength = text.length;
  const searchValueLength = searchValue.length;
  const positions = [];
  if (searchValueLength > textLength) {
    return [];
  }

  if (searchValueLength === textLength) {
    return (searchValue === text ? [0] : []);
  }

  outer: for (let i = 0, j = 0; i < searchValueLength; i++) {
    const searchValueChar = searchValue.charCodeAt(i);
    while (j < textLength) {
      if (text.charCodeAt(j++) === searchValueChar) {
        positions.push(j - 1);
        continue outer;
      }
    }
    return [];
  }
  return positions;
}


function highlightByPositions(text, positions) {
  if (positions.length === 0) {
    return text;
  }
  const result = [];
  for (let i = 0; i < positions.length; i++) {
    if (i === 0) {
      result.push(text.slice(0, positions[i]));
    } else {
      result.push(text.slice(positions[i - 1] + 1, positions[i]));
    }
    result.push('<span class="highlight">');
    result.push(text.slice(positions[i], positions[i] + 1));
    result.push('</span>');
  }
  result.push(text.slice(positions[positions.length - 1] + 1))
  return result.join('');
}

handleSearch(searchFunction);