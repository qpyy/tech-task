async function fetchRepoDetails(repoFullName) {
  const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`);
  const repoDetails = await repoResponse.json();

  // Получение списка языков
  const languagesResponse = await fetch(repoDetails.languages_url);
  const languages = await languagesResponse.json();

  // Получение списка контрибьюторов
  const contributorsResponse = await fetch(repoDetails.contributors_url + "?per_page=10");
  const contributors = await contributorsResponse.json();

  // Получение количества звезд и даты последнего коммита
  const commitsResponse = await fetch(
    repoDetails.commits_url.replace("{/sha}", "") + "?per_page=1"
  );
  const lastCommit = await commitsResponse.json();

  displayRepoDetails(repoDetails, languages, contributors, lastCommit);
}

async function displayRepoDetails(repo, languages, contributors, lastCommit) {
  const detailsElement = document.getElementById("repo-details");

  // Форматирование даты последнего коммита
  const lastCommitDate = lastCommit[0]
    ? new Date(lastCommit[0].commit.committer.date).toLocaleDateString()
    : "Недоступно";

  detailsElement.innerHTML = `<h2>${repo.name} - ⭐${
    repo.stargazers_count
  } - Последний коммит: ${lastCommitDate}</h2>
                              <img src="${
                                repo.owner.avatar_url
                              }" alt="Аватар владельца" style="width: 100px;"><br>
                              <a href="${repo.owner.html_url}" target="_blank">${
    repo.owner.login
  }</a>
                              <p>Используемые языки: ${Object.keys(languages).join(", ")}</p>
                              <p>${repo.description}</p>
                              <h3>Контрибьюторы:</h3>
                              <ul>${contributors
                                .map(
                                  (contributor) =>
                                    `<li><a href="${contributor.html_url}" target="_blank">${contributor.login}</a></li>`
                                )
                                .join("")}</ul>`;
}

function getRepoFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("repo");
}

document.addEventListener("DOMContentLoaded", (event) => {
  const repoFullName = getRepoFromURL();
  if (repoFullName) {
    fetchRepoDetails(repoFullName);
  } else {
    console.error("Repository name not provided in the URL");
  }
});
