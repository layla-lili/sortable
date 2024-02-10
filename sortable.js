const searchInput = document.querySelector('#search-input');
const tableBody = document.querySelector('#data-table tbody');
const columnHeaders = document.querySelectorAll('#data-table th');
let heroesData = []; // Store the original data
let itemsPerPage = 20;

// Fetch the data from the API
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then(response => response.json())
  .then(heroList => {
    heroesData = heroList; // Store the original data

    // Render the table with the data
    renderTable(heroList.slice(0, 20));
    updatePagintaion(itemsPerPage);
  })
  .catch(error => {
    console.error('Error:', error);
  });


// Render the table with the provided data
function renderTable(data) {
  // Clear existing table rows
  tableBody.innerHTML = '';
  // Iterate over the data and create table rows
  data.forEach(hero => {
    const row = document.createElement('tr');
    // Create table cells for each column
    //const idCell = createTableCell('text', hero.id);
    const iconCell = createTableCell('img', hero.images.xs);
    const nameCell = createTableCell('text', hero.name);
    const fullNameCell = createTableCell('text', hero.biography.fullName);
    const powerstatsCells = Object.values(hero.powerstats).map(value => createTableCell('text', value));
    const raceCell = createTableCell('text', hero.appearance.race);
    const genderCell = createTableCell('text', hero.appearance.gender);
    const heightCell = createTableCell('text', hero.appearance.height.join(', '));
    const weightCell = createTableCell('text', hero.appearance.weight.join(', '));
    const birthPlaceCell = createTableCell('text', hero.biography.placeOfBirth);
    const alignmentCell = createTableCell('text', hero.biography.alignment);

    // Append cells to the row
    row.append(iconCell, nameCell, fullNameCell, ...powerstatsCells, raceCell, genderCell, heightCell, weightCell, birthPlaceCell, alignmentCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Create a table cell with the specified content
function createTableCell(type, content) {
  const cell = document.createElement('td');

  if (type === 'img') {
    const img = document.createElement('img');
    img.src = content;
    cell.appendChild(img);
  } else {
    cell.textContent = content;
  }

  return cell;
}

// Event listener for search input
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredData = heroesData.filter(hero => hero.name.toLowerCase().includes(searchTerm));
  renderTable(filteredData);
});

const table = document.querySelector('#data-table');

let sortState = {
  column: null,
  order: 'asc'
};

// Event listener for column header click
columnHeaders.forEach((header, index) => {
  header.addEventListener('click', () => {
    const column = index;
    let order;

    if (sortState.column === column) {
      order = sortState.order === 'asc' ? 'desc' : 'asc';
    } else {
      order = 'asc';
    }

    sortState.column = column;
    sortState.order = order;

    // Remove sorting classes from all column headers
    columnHeaders.forEach((header, index) => {
      header.classList.remove('asc', 'desc');
    });

    // Add sorting class to the clicked column header
    header.classList.add(order);

    // Sort the table based on the clicked column header
    sortTable(column, order);
  });
});

// Sort the table based on the specified column and order
function sortTable(column, order) {
  const rows = Array.from(table.tBodies[0].querySelectorAll('tr'));

  // Sort the rows
  rows.sort((a, b) => {
    const cellA = a.cells[column].textContent.trim();
    const cellB = b.cells[column].textContent.trim();

    if (cellA === '' && cellB !== '') {
      return 1; // Sort missing value last if cellA is empty
    } else if (cellA !== '' && cellB === '') {
      return -1; // Sort missing value last if cellB is empty
    } else if (cellA < cellB) {
      return order === 'asc' ? -1 : 1;
    } else if (cellA > cellB) {
      return order === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });

  // Reorder the rows in the table
  table.tBodies[0].append(...rows);
}

function handleButtonClick() {
  const itemsPerPageSelect = document.getElementById('itemsPerPage');
  const selectedValue = itemsPerPageSelect.value;
  if (selectedValue == 'all') {
    renderTable(heroesData);
    updatePagintaion(heroesData.length);
  } else {
    itemsPerPage = parseInt(selectedValue, 10);
    updatePagintaion(itemsPerPage);
  }
}

function updatePagintaion(itemsPerPage) {
  const totalItems = heroesData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';
  renderTable(heroesData.slice(0, itemsPerPage));
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    //Add the CSS class to the button
    button.classList.add('pagination-button');

    button.setAttribute('type', 'button');
    button.textContent = i;
    button.addEventListener('click', () => {
      const currentPage = i;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      renderTable(heroesData.slice(startIndex, endIndex));
    });
    paginationElement.appendChild(button);
  }
}