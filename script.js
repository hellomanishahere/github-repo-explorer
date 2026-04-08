const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const languageFilter = document.getElementById("languageFilter");
const sortSelect = document.getElementById("sortSelect");
const darkModeBtn = document.getElementById("darkModeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let allRepos = [];
let currentPage = 1;
const perPage = 6;

function displayRepos(repos) {
  resultsDiv.innerHTML = "";
  repos.map(repo => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description ? repo.description.substring(0, 100) + "..." : "No description available"}</p>
      <p>⭐ ${repo.stargazers_count}</p>
      <p>🍴 ${repo.forks_count}</p>
      <p>${repo.language || "N/A"}</p>
      <a href="${repo.html_url}" target="_blank">View Repository</a>
    `;
    resultsDiv.appendChild(div);
  });
}

function paginate(repos) {
  const start = (currentPage - 1) * perPage;
  const paginated = repos.slice(start, start + perPage);
  displayRepos(paginated);
}

function processRepos() {
  let repos = [...allRepos];

  const lang = languageFilter.value;
  if (lang) {
    repos = repos.filter(repo => repo.language === lang);
  }

  const sortType = sortSelect.value;
  if (sortType === "stars") {
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortType === "forks") {
    repos.sort((a, b) => b.forks_count - a.forks_count);
  } else {
    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  paginate(repos);
}

searchBtn.addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    resultsDiv.innerHTML = "Please enter a search term ⚠️";
    return;
  }

  resultsDiv.innerHTML = "Loading... ⏳";

  fetch(`https://api.github.com/search/repositories?q=${query}&per_page=30`)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "No repositories found ❌";
        return;
      }
      allRepos = data.items;
      currentPage = 1;
      processRepos();
    })
    .catch(() => {
      resultsDiv.innerHTML = "Error fetching data ❌";
    });
});

languageFilter.addEventListener("change", () => {
  currentPage = 1;
  processRepos();
});

sortSelect.addEventListener("change", () => {
  processRepos();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    processRepos();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  processRepos();
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
