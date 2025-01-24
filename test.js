async function test () {
    const url = `https://api.kickbase.com/v4/live/eventtypes`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // Authentifizierung mit Bearer-Token
        }
    });
}


// Funktion zum Überprüfen des Tokens beim Laden der Seite
window.onload = function() {
    token = localStorage.getItem('token');
    league = localStorage.getItem('league');
    if (token && league) {
        try {
            test();
        }
        catch {
            showLoginForm();
        }
    }
    else {
        showLoginForm();
    }
}