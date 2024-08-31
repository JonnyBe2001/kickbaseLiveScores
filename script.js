

// Globale Variable für das aktuell geöffnete Team
let currentOpenDropdown = null;

// Funktion zum Öffnen und Schließen von Dropdowns
function toggleDropdown(event) {
    const dropdownContent = event.currentTarget.nextElementSibling;

    // Wenn ein anderes Dropdown geöffnet ist, schließen
    if (currentOpenDropdown && currentOpenDropdown !== dropdownContent) {
        currentOpenDropdown.classList.remove('show');
    }

    // Toggle current dropdown
    dropdownContent.classList.toggle('show');

    // Aktualisieren der offenen Dropdown-Referenz
    currentOpenDropdown = dropdownContent.classList.contains('show') ? dropdownContent : null;
}

// Funktion zum Login
async function login() {
    // Eingabewerte holen
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password,
        ext: false
    };

    try {
        const response = await fetch('https://api.kickbase.com/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error(`Login fehlgeschlagen! Status: ${response.status}`);
        }

        const data = await response.json();
        let loginToken = data.token;
        localStorage.setItem('token', loginToken);

        token = localStorage.getItem('token');
        document.getElementById('loginForm').classList.add('hidden'); // Verstecke das Login-Formular
        fetchLeagues();  // Fetch leagues after login

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}

// Funktion zum Abrufen der Ligen
async function fetchLeagues() {
    if (!token) {
        console.error('Token ist nicht verfügbar.');
        return;
    }

    try {
        const response = await fetch('https://api.kickbase.com/leagues/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Ligen! Status: ${response.status}`);
        }

        const data = await response.json();
        leagueId = data.leagues[0]?.id;
        console.log('League ID:', leagueId);

        // Fetch league lineup after fetching leagues
        fetchLeagueLineup();

    } catch (error) {
        console.error('Fehler beim Abrufen der Ligen:', error);
    }
}

// Funktion zum Abrufen der Liga-Aufstellung und Ausgabe der Spielernamen und Live-Punkte
async function fetchLeagueLineup() {
    if (!leagueId) {
        console.error('League ID ist nicht verfügbar.');
        return;
    }

    try {
        const url = `https://api.kickbase.com/leagues/${leagueId}/live`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Liga-Livepunkte! Status: ${response.status}`);
        }

        const data = await response.json();
        const teams = data.u;

        // Leeren des bisherigen Inhalts
        document.getElementById('lineUpOutput').innerHTML = '';

        // Erstellen der Dropdowns für jedes Team
        teams.forEach(team => {
            createDropdown(team.n, team.pl);
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Livepunkte:', error);
    }
}

// Funktion zum Erstellen von Dropdowns
function createDropdown(teamName, players) {
    const container = document.getElementById('lineUpOutput');
    
    // Team Header
    const teamHeader = document.createElement('div');
    teamHeader.className = 'team-header';
    teamHeader.textContent = teamName;
    teamHeader.addEventListener('click', toggleDropdown);

    // Dropdown Content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `<tr><th>Name</th><th>Position</th><th>Punkte</th></tr>`;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${player.n}</td><td>${getPositionLabel(player.p)}</td><td>${player.t}</td>`;
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    dropdownContent.appendChild(table);

    container.appendChild(teamHeader);
    container.appendChild(dropdownContent);
}

// Funktion zum Ermitteln der Position
function getPositionLabel(position) {
    switch (position) {
        case 1:
            return 'TW'; // Torwart
        case 2:
            return 'ABW'; // Abwehr
        case 3:
            return 'MF'; // Mittelfeld
        case 4:
            return 'ST'; // Stürmer
        default:
            return 'Unbekannt'; // Unbekannt
    }
}
