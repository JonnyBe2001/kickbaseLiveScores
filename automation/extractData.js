const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Mapping der Teamnamen zu ihren IDs basierend auf der JSON-Ausgabe
const teamIds = {
    "VfL Bochum": 24,
    "SC Freiburg": 5,
    "VfB Stuttgart": 9,
    "TSG Hoffenheim": 14,
    "FC Heidenheim": 50,
    "FC Union Berlin": 40,
    "FC StPauli": 39,
    "SV Werder Bremen": 10,
    "KSV Holstein": 51,
    "FC Bayern München": 2,
    "FC Augsburg": 13,
    "Bayer 04 Leverkusen": 7,
    "Borussia Mönchengladbach": 15,
    "Borussia Dortmund": 3,
    "RB Leipzig": 43,
    "Eintracht Frankfurt": 4,
    "FSV Mainz 05": 18,
    "VfL Wolfsburg": 11
};

// Funktion zum Parsen einer einzelnen PDF-Datei
async function parsePDF(fileName) {
    let dataBuffer = fs.readFileSync(path.join('automation/pdf', fileName));
    let data = await pdf(dataBuffer);
    let text = data.text;
    let lines = text.split('\n').slice(2, 20);  // Relevante Zeilen extrahieren

    let rank = 18;
    let results = [];

    lines.forEach(line => {
        line = line.replace(/\.\t/g, '').replace(/\t/g, ' ');
        let nameMatch = line.match(/^\d+\s*(.*)$/);
        if (nameMatch) {
            let name = nameMatch[1].trim();
            let teamId = teamIds[name] || null;
            results.push({ rank: rank, name: name, teamId: teamId });
            rank--;
        }
    });

    return results;
}

// Hauptfunktion zum Parsen aller PDFs und Speichern der Ergebnisse
async function parseAllPDFs() {
    let categories = ['torwart', 'abwehr', 'mittelfeld', 'sturm'];
    let allResults = {};

    for (let category of categories) {
        let results = await parsePDF(`${category}.pdf`);
        allResults[category] = results;
    }

    // Ergebnisse in JSON-Datei speichern
    fs.writeFileSync('automation/json/results.json', JSON.stringify(allResults, null, 2), 'utf8');
}

// Ausführung der Hauptfunktion
parseAllPDFs().catch(error => {
    console.error('Fehler beim Parsen der PDF-Dateien:', error);
});
