async function getData() {
  const response = await fetch("https://api.github.com/repositories");
  return response.json();
}

function clearElement(element) {
  element.innerHTML = "";
}

function createRepsElement(data) {
  const repsEl = document.createElement("div");
  repsEl.classList.add("reps");
  repsEl.innerText = `${data.full_name}`;
  return repsEl;
}

function displayList(arrData, rowPerPage, page) {
  const repsElement = document.querySelector(".rep-list");
  clearElement(repsElement);
  page--;

  const start = rowPerPage * page;
  const end = start + rowPerPage;
  const paginatedData = arrData.slice(start, end);

  paginatedData.forEach((el) => {
    const repsEl = createRepsElement(el);
    repsElement.appendChild(repsEl);
  });
}

function createPaginationBtn(page, currentPage, repsData, rows) {
  const liEl = document.createElement("li");
  liEl.classList.add("pagination__item");
  liEl.innerText = page;

  if (currentPage === page) {
    liEl.classList.add("pagination__item--active");
  }

  liEl.addEventListener("click", () => {
    currentPage = page;
    displayList(repsData, rows, currentPage);

    const currentItemLi = document.querySelector("li.pagination__item--active");
    currentItemLi.classList.remove("pagination__item--active");

    liEl.classList.add("pagination__item--active");
  });

  return liEl;
}

function displayPagination(arrData, rowPerPage, currentPage) {
  const paginationEl = document.querySelector(".pagination");
  clearElement(paginationEl);

  const pagesCount = Math.ceil(arrData.length / rowPerPage);
  const ulEl = document.createElement("ul");
  ulEl.classList.add("pagination__list");

  for (let i = 0; i < pagesCount; i++) {
    const liEl = createPaginationBtn(i + 1, currentPage, arrData, rowPerPage);
    ulEl.appendChild(liEl);
  }

  paginationEl.appendChild(ulEl);
}

async function main() {
  const repsData = await getData();
  let currentPage = 1;
  let rows = 10;

  function searchRep(searchValue) {
    const repsElement = document.querySelector(".rep-list");
    clearElement(repsElement);

    const filteredData = repsData.filter((el) =>
      el.full_name.toLowerCase().includes(searchValue.toLowerCase())
    );

    currentPage = 1;

    const paginationEl = document.querySelector(".pagination");
    clearElement(paginationEl);

    displayList(filteredData, rows, currentPage);
    displayPagination(filteredData, rows, currentPage);
  }

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value;
    searchRep(searchValue);
  });

  displayList(repsData, rows, currentPage);
  displayPagination(repsData, rows, currentPage);
}

main();
