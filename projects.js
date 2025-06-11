const username = "Dhannuchanda";
const apiUrl = `https://api.github.com/users/${dhannuchanda}/repos`;

fetch(apiUrl)
  .then(response => response.json())
  .then(repos => {
    const container = document.getElementById("projects-container");

    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error fetching GitHub repos:", error);
  });
