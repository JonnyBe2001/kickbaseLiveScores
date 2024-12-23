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
    const response = await fetch(`${apiUrl}?leagueId=${league}&max=${maxResults}&query=${query}&start=1`, {
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


function displayPlayers(playersArray){
    console.log(playersArray);
}
