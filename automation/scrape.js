const { chromium } = require('playwright');

(async () => {
    // Starten des Browsers im Headless-Modus
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Tableau-URL anpassen
    const tableauUrl = 'https://public.tableau.com/app/profile/michael.mauthe/viz/Kickbase_Matchup_Tool_v1/Kickbase_Matchup_Tool';
    console.log(`Öffne URL: ${tableauUrl}`);
    
    // Navigiere zur Tableau-Seite
    await page.goto(tableauUrl);

    // **1. Cookies akzeptieren**
    try {
        await page.waitForSelector('//*[@id="onetrust-accept-btn-handler"]', { timeout: 5000 });
        await page.click('//*[@id="onetrust-accept-btn-handler"]');
        console.log('Cookie-Banner akzeptiert.');
    } catch (e) {
        console.log('Cookie-Banner nicht gefunden oder bereits akzeptiert.');
    }

    // Warten, bis die Seite vollständig geladen ist
    try {
        await page.waitForLoadState('load');
        console.log('Seite vollständig geladen.');
    } catch (e) {
        console.log('Seite konnte nicht vollständig geladen werden.');
    }

    // **2. Download Layout öffnen**
    try {
        await page.waitForSelector('//*[@id="downloadIcon"]', { timeout: 5000 });
        console.log('Download Layout gefunden');
        await page.click('//*[@id="downloadIcon"]');
        console.log('Download Layout geöffnet');
    } catch (e) {
        console.log('Download Layout konnte nicht gefunden oder geöffnet werden!');
    }

    // Browser schließen
    await browser.close();
})();
