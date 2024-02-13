async function fetchRepos() {
  const response = await fetch("https://api.github.com/repositories");
  return response.json();
}

function clearElement(element) {
  element.innerHTML = "";
}

function appendRepoToElement(element, repo) {
  const repoLink = document.createElement("a");
  repoLink.className = "repo";
  // Измените href, чтобы перенаправлять на страницу с деталями, передавая информацию в URL
  repoLink.href = `javascript:void(0);`; // Удалите прямую ссылку на GitHub
  repoLink.innerText = repo.name;
  // Удалите target = "_blank", так как переадресация будет внутри вашего приложения
  repoLink.addEventListener("click", function () {
    window.location.href = `repo-details.html?repo=${encodeURIComponent(repo.full_name)}`;
  });
  element.appendChild(repoLink);
}

function displayRepos(repos, element, rowsPerPage, page) {
  clearElement(element);
  const paginatedRepos = paginate(repos, rowsPerPage, page);
  paginatedRepos.forEach((repo) => appendRepoToElement(element, repo));
}

function paginate(items, rowsPerPage, page) {
  const start = rowsPerPage * (page - 1);
  const end = start + rowsPerPage;
  return items.slice(start, end);
}

function createPaginationButton(page, currentPage, onClick) {
  const button = document.createElement("li");
  button.className = `pagination__item ${currentPage === page ? "pagination__item--active" : ""}`;
  button.innerText = page;
  button.addEventListener("click", () => onClick(page));
  return button;
}

function displayPagination(container, totalPages, currentPage, onClick) {
  clearElement(container);
  const ul = document.createElement("ul");
  ul.className = "pagination__list";

  for (let i = 1; i <= totalPages; i++) {
    const button = createPaginationButton(i, currentPage, onClick);
    ul.appendChild(button);
  }

  container.appendChild(ul);
}

async function main() {
  const repos = await fetchRepos();
  const repoListElement = document.querySelector(".rep-list");
  const paginationElement = document.querySelector(".pagination");
  console.log(repos);
  let currentPage = 1;
  const rowsPerPage = 10;

  const updateUI = (filteredRepos, page) => {
    displayRepos(filteredRepos, repoListElement, rowsPerPage, page);
    displayPagination(
      paginationElement,
      Math.ceil(filteredRepos.length / rowsPerPage),
      page,
      (page) => {
        currentPage = page;
        updateUI(filteredRepos, page);
      }
    );
  };

  document.getElementById("searchInput").addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredRepos = repos.filter((repo) => repo.name.toLowerCase().includes(searchValue));
    updateUI(filteredRepos, 1);
  });

  updateUI(repos, currentPage);
}

main();
