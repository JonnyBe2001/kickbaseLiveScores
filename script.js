let token;
let league;


// Funktion zum Login
async function login() {
    // Eingabewerte holen
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        em: email,
        ext: false,
        loy: false,
        pass: password,
        rep:{},
    };

    try {
        const response = await fetch('https://api.kickbase.com/v4/user/login', {
            method: 'POST',
            mode: 'cors', // CORS hinzufügen
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
        let loginToken = data.tkn;
        localStorage.setItem("token", loginToken);
        token = loginToken;

        leagueId = data.srvl[0]?.id; //get first league
        localStorage.setItem("league", leagueId);
        league = leagueId;

        hideLoginForm();
        myeleven();

    } catch (error) {
        console.error('Fehler beim Login:', error);
        alert("Falsche Anmeldedaten!");
    }
}

async function myeleven() {
    const url = `https://api.kickbase.com/v4/leagues/${league}/teamcenter/myeleven`;
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
        const myelevenData = await response.json(); // Teamcenter Data

        let pointsHTML = `
                <table class="custom-table">
                    <thead>
                        <tr class="custom-header" style="border-top: 1px solid blue">
                            <th class="custom-cell" style="text-align: left; padding-right: 20px;">Team</th>
                            <th></th>
                            <th></th>
                            <th class="custom-cell">${myelevenData.p}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        console.log(myelevenData);

        for (let i = 0; i < 11; i++) {
            if (myelevenData.lp[i]) { // Sicherstellen, dass das Element existiert
                let points = myelevenData.lp[i].p; // Punkte des jeweiligen Elements
                const name = myelevenData.lp[i].n; // Name des jeweiligen Elements
                let time; 
                const statusNumber = myelevenData.lp[i].st;
                let status;
                let pColor;
                let tColor;

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


                if (myelevenData.lp[i].mtd){
                    time = myelevenData.lp[i].mtd;
                }
                else {
                    time = "0";
                }

                if (time<1 || time>89){
                    tColor = "#7e8187";
                }
                else {
                    tColor = "#ffffff";
                }


                if (statusNumber === 5){
                    status = `<i class="fa-regular fa-thumbs-up" style="color: #25dc84;"></i>`;
                }
                else if (statusNumber === 3) {
                    status = `<i class="fa-solid fa-chair" style="color: #a8a8aa;"></i>`;
                }
                else if (statusNumber === 0) {
                    status = "";
                }
                else (
                    status = `<i class="fa-regular fa-thumbs-down" style="color: #f94c1f;"></i>`
                )

                if (points === undefined) {
                    points = "0";
                }

                if (myelevenData.lp[i].k) {
                    if (myelevenData.lp[i].k.includes(9)) {
                        status = `<i class="fa-solid fa-arrow-down" style="color: #f94c1f;"></i>`;
                    }
                    else if (myelevenData.lp[i].k.includes(8)) {
                        status = `<i class="fa-solid fa-arrow-up" style="color: #25dc84;"></i>`;
                    }
                    else {
                    }
                }
                else {
                }
                    

                pointsHTML += `
                    <tr onclick="handleRowClick(${myelevenData.lp[i].i});" style="cursor: pointer;">
                        <td class="custom-cell" style="padding-right: 20px; padding-top: 15px;">${name}</td>
                        <td class="custom-cell" style="padding-right: 20px">${status}</td>
                        <td class="custom-cell" style="color: ${tColor}; padding-right: 20px; font-size: 14px">${time}'</td>
                        <td class="custom-cell" style="color: ${pColor}; text-align: right"><strong>${points}</strong></td>
                    </tr>
                `;
            } else {
                pointsHTML += `
                    <tr>
                        <td class="custom-cell">Spieler ${i + 1}</td>
                        <td class="custom-cell">Keine Daten verfügbar</td>
                    </tr>
                `;
            }
        }

        pointsHTML += `
                    </tbody>
                </table>

        `;

        // Ausgabe der Tabelle
        document.getElementById("mainContent").innerHTML = pointsHTML;


    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        document.getElementById("mainContent").innerHTML = "Ein Fehler ist aufgetreten. Bitte melde dich bei Jonas";
    }
}



// Funktion zum Anzeigen des Login-Formulars
function showLoginForm() {
    document.getElementById('loginForm').style.display = '';  // Entfernt den Inline-Stil
}

function hideLoginForm() {
    document.getElementById('loginForm').classList.add('hidden');  // Zeige das Login-Formular

}

function handleRowClick (selectedPlayerId) {
    localStorage.setItem("player", selectedPlayerId);
    window.location.href = "player.html";
}


// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    if (token && league) {
        try {
            myeleven();
        }
        catch {
            showLoginForm();
        }
    }
    else {
        showLoginForm();
    }
}