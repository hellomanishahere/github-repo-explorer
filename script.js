const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

searchBtn.addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    resultsDiv.innerHTML = "Please enter a search term ⚠️";
    return;
  }

  resultsDiv.innerHTML = "Loading... ⏳";

  fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`)
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = "";

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "No repositories found ❌";
        return;
      }

      data.items.forEach(repo => {
        const div = document.createElement("div");
        div.className = "repo";

        div.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description ? repo.description.substring(0, 100) + "..." : "No description available"}</p>
          <p>⭐ Stars: ${repo.stargazers_count}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;

        resultsDiv.appendChild(div);
      });
    })
    .catch(error => {
      resultsDiv.innerHTML = "Error fetching data ❌";
      console.error(error);
    });
});
