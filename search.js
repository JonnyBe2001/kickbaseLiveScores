let league;
let token;

// API-Konfiguration
const maxResults = 5;
const apiUrl = `https://api.kickbase.com/v4/competitions/1/players/search`;

let timeout;

// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = async function() {
  token = localStorage.getItem('token');
  league = localStorage.getItem('league');
  if (token && league) {
    try {
    }
    catch {
      window.location.href = "index.html";
    }
  }
  else {
    window.location.href = "index.html";
  }
}

// Warten bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("mainContent");
  if (searchInput) {
    searchInput.focus();  // Fokussiert das Eingabefeld
  }

  if (!searchInput || !searchResults) {
    console.error("DOM-Elemente konnten nicht gefunden werden!");
    return;
  }

  // Event-Listener für die Suche
  searchInput.addEventListener("input", async function (event) {
    const query = event.target.value.trim();

    // Verhindere unnötige API-Calls mit einem Timeout
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (query.length > 0) {
        const playersArray = await searchPlayers(query);
        displayPlayers(playersArray);
      } else {
        searchResults.innerHTML = ""; // Leere Ergebnisse, wenn das Suchfeld leer ist
      }
    }, 300); // Wartezeit (300ms) für bessere Performance
  });

  // Funktion: Spieler suchen
  async function searchPlayers(query) {
    try {
    const response = await fetch(`${apiUrl}?leagueId=${league}&max=${maxResults}&query=${query}&start=0`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
        }
    });

    if (!response.ok) {
        throw new Error(`API-Error: ${response.status}`);
    }

    const data = await response.json();
    const playersArray = data.it.map(item => item.pi);

    return playersArray; // Spielerobjekte zurückgeben
    } 
    catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        return [];
    }
  }
});

async function displayPlayers(playersArray) {
    console.log(playersArray);
    const searchResults = document.getElementById("mainContent");

    // Wir leeren das searchResults-Div zu Beginn, damit keine alten Ergebnisse angezeigt werden
    searchResults.innerHTML = "";

    // Erstelle die Tabelle
    const table = document.createElement("table");
    table.classList.add("player-table");

    // Erstelle den Tabellenkopf mit den Spaltennamen
    const headerRow = document.createElement("tr");

    // Gehe durch jedes Element im playersArray
    for (const playerId of playersArray) {
        const url = `https://api.kickbase.com/v4/competitions/1/playercenter/${playerId}?leagueId=${league}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const plCenterData = await response.json(); // PlayerCenter Data

            // Hole die Spielerinformationen
            let name = plCenterData.n;
            let points = plCenterData.p;
            let team = plCenterData.tid;
            let pColor;

            if (points === undefined) {
                points = 0; // Standardwert, falls keine Punkte verfügbar sind
            }

            if (points<0) {
                pColor = "#f94c1f";
            }
            else if (points===0) {
                pColor = "#7e8187";
            }
            else if (points>0 && points<100) {
                pColor = "#ee8728";
            }
            else if (points>=100 && points<200) {
                pColor = "#9ddd49";
            }
            else if (points>=200 && points<400) {
                pColor = "#24dc84";   
            }
            else if (points>=400) {
                pColor = "#e1bc37";
            }
            else {
                pColor = "#a8a8aa";
            }

            // Erstelle eine neue Tabellenzeile für den Spieler
            const playerRow = document.createElement("tr");
            playerRow.innerHTML = `
                <td><img src="https://cdn.kickbase.com/files/teams/${team}/9"></td>
                <td style="padding-right: 50px;">${name}</td>
                <td style="text-align: right; color: ${pColor};"><strong>${points}</strong></td>
            `;
            playerRow.onclick = function() {
              handleRowClick(playerId); // Deine Funktion aufrufen
          };
            table.appendChild(playerRow);

        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }

    // Füge die Tabelle zum searchResults-Div hinzu
    searchResults.appendChild(table);
}

function handleRowClick (selectedPlayerId) {
  localStorage.setItem("player", selectedPlayerId);
  window.location.href = "player.html";
}
