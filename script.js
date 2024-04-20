document.addEventListener("DOMContentLoaded", function () {
    const randomPlayersContainer = document.getElementById("random-players-container");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchSection = document.getElementById("search-section");

    // Función para obtener una letra aleatoria de A a Z
    function getRandomLetter() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // Función para obtener jugadores aleatorios de la API
    async function getRandomPlayers() {
        try {
            const letter = getRandomLetter();
            const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${letter}`);
            const data = await response.json();
            return data.player;
        } catch (error) {
            console.error("Error al obtener jugadores aleatorios:", error);
        }
    }

    // Función para mostrar la información de los jugadores aleatorios en tarjetas
    async function renderRandomPlayers() {
        const randomPlayers = await getRandomPlayers();
        // Ordenar los jugadores, primero los que tienen imagen
        randomPlayers.sort((a, b) => {
            if (a.strThumb === null && b.strThumb !== null) {
                return 1; // b tiene imagen, a no
            } else if (a.strThumb !== null && b.strThumb === null) {
                return -1; // a tiene imagen, b no
            } else {
                return 0; // ambos tienen imagen o ambos no tienen
            }
        });
        randomPlayersContainer.innerHTML = ""; // Limpiamos los jugadores aleatorios
        randomPlayers.forEach(player => {
            const card = createPlayerCard(player);
            randomPlayersContainer.appendChild(card);
        });
    }

  // Función para crear una tarjeta de jugador
  function createPlayerCard(player) {
      const card = document.createElement("div");
      card.classList.add("player-card");
      card.id = `player-${player.idPlayer}`;

      // Creamos un array con los enlaces a redes sociales
      const socialLinks = [];
      if (player.strFacebook) socialLinks.push({ name: "Facebook", url: player.strFacebook });
      if (player.strTwitter) socialLinks.push({ name: "Twitter", url: `https://${player.strTwitter}` });
      if (player.strInstagram) socialLinks.push({ name: "Instagram", url: `https://${player.strInstagram}` });
      if (player.strYoutube) socialLinks.push({ name: "YouTube", url: `https://${player.strYoutube}` });

      card.innerHTML = `
          <img src="${player.strThumb}" alt="${player.strPlayer}">
          <div class="player-info">
              ${player.strThumb === null ? '<p class="no-image">Este jugador no cuenta con imagen</p>' : ''}
              <h3><i class="fas fa-user"></i> ${player.strPlayer}</h3>
              ${player.strThumb === null ? '' : `<p class="purple"><strong>ID:</strong> ${player.idPlayer}</p>`}
              <p class="purple"><strong>Nacionalidad:</strong> ${player.strNationality}</p>
              <p class="purple"><strong>Lugar de Nacimiento:</strong> ${player.strBirthLocation}</p>
              ${player.strThumb === null ? '' : `<p class="purple"><strong>Fecha de Nacimiento:</strong> ${player.dateBorn}</p>`}
              <p class="purple"><strong>Género:</strong> ${player.strGender}</p>
              <p class="purple"><strong>Posición:</strong> ${player.strPosition}</p>
              <p class="purple"><strong>Altura:</strong> ${player.strHeight}</p>
              <p class="description hidden">${player.strDescriptionEN}</p>
              <div class="social-links">
                  ${socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}"><i class="fab fa-${link.name.toLowerCase()}"></i></a>`).join("")}
              </div>
          </div>
      `;

      const description = card.querySelector(".description");

      card.addEventListener("click", function () {
          description.classList.toggle("visible");
          if (!description.classList.contains("visible")) {
              card.style.marginBottom = "0";
          } else {
              card.style.marginBottom = "20px";
          }
      });

      return card;
  }



    // Función para mostrar los resultados de la búsqueda
    async function displaySearchResults(term) {
        try {
            const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${term}`);
            const data = await response.json();
            const players = data.player;
            randomPlayersContainer.innerHTML = ""; // Limpiamos los jugadores aleatorios
            players.forEach(player => {
                const card = createPlayerCard(player);
                randomPlayersContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al buscar jugadores:", error);
        }
    }

    // Llamamos a la función para mostrar los jugadores aleatorios al cargar la página
    renderRandomPlayers();

    // Event listener para realizar la búsqueda al hacer clic en el botón
    searchButton.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            displaySearchResults(searchTerm);
        }
    });

    // Event listener para realizar la búsqueda al presionar Enter en el campo de búsqueda
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== "") {
                displaySearchResults(searchTerm);
            }
        }
    });
});
