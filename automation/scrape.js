const { chromium } = require('playwright');

// Funktion zum Download von PDF
async function downloadPdf(page) {
    // Tableau-URL anpassen
    const tableauUrl = 'https://public.tableau.com/views/Kickbase_Matchup_Tool_v1/Kickbase_Matchup_Tool?%3Adisplay_static_image=y&%3AbootstrapWhenNotified=true&%3Aembed=true&%3Alanguage=de-DE&:embed=y&:showVizHome=n&:apiID=host0#navType=0&navSrc=Parse';
    console.log(`Öffne URL: ${tableauUrl}`);
    
    // Navigiere zur Tableau-Seite
    await page.goto(tableauUrl);

    // Warten, bis die Seite vollständig geladen ist
    try {
        await page.waitForLoadState('load');
        console.log('Seite vollständig geladen.');
    } catch (e) {
        console.log('Seite konnte nicht vollständig geladen werden.');
    }

    // Viewport setzen um alle 18 Teams auf das PDF zu bekommen
    await page.setViewportSize({ width: 1920, height: 1080 });

    // **2. Download Layout öffnen**
    try {
        await page.waitForSelector('//*[@id="download"]', { timeout: 5000 });
        console.log('Download Button');
        await page.click('//*[@id="download"]');
        console.log('Download Layout geöffnet');
    } catch (e) {
        console.log('Download Layout konnte nicht gefunden oder geöffnet werden!');
    }

    // **3. Klick auf PDF Button**
    try {
        await page.waitForSelector('//*[@id="viz-viewer-toolbar-download-menu"]/div[2]/div/div/span[1]', { timeout: 5000 });
        console.log('Download Layout gefunden');
        await page.click('//*[@id="viz-viewer-toolbar-download-menu"]/div[2]/div/div/span[1]', { timeout: 7000 });
        console.log('PDF Button geklickt');
    } catch (e) {
        console.log('Download Layout konnte nicht gefunden oder PDF Button nicht geklickt werden!');
    }

    // **4. Download-Button klicken und auf den Download warten**
    try {
        await page.waitForSelector('//*[@id="export-pdf-dialog-Dialog-Body-Id"]/div/div[4]/button', { timeout: 5000 });
        console.log('Download Button gefunden');

        // Auf den Download warten und dann klicken
        const [download] = await Promise.all([
            page.waitForEvent('download'), // Warte auf den Download
            page.click('//*[@id="export-pdf-dialog-Dialog-Body-Id"]/div/div[4]/button', { timeout: 7000 })
        ]);

        // Speichern der Datei in den gewünschten Ordner
        const filePath = `automation/pdf/test.pdf`;
        await download.saveAs(filePath);
        console.log(`Download erfolgreich: ${filePath}`);
    } catch (e) {
        console.log('Download Button konnte nicht gefunden oder geklickt werden!');
    }
}

// Browser und Page Setup
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Funktion zum PDF-Download ausführen
    await downloadPdf(page);

    // Browser schließen
    await browser.close();
})();
