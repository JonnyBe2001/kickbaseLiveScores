const { chromium } = require('playwright');

// Browser und Page Setup und trigger des Tests
(async () => {
    console.log("------- STEP-1 Torhüter -------");
    await downloadTor();
    console.log("------- STEP-2 Abwehr ---------");
    await downloadAbw();
    console.log("------- STEP-3 Mittelfeld -----");
    await downloadMf();
    console.log("------- STEP-4 Sturm ----------");
    await downloadSt();
    console.log("------- FINISHED --------------");
})();


async function downloadTor() {
    const position = 'torwart';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Funktionen zum Öffnen von Tableau und öffnen der PosWahl und entfernen von PosFilter
    await openPage(page);
    await removePosFilter(page);
    
    try {
        // Warten bis die "Torhüter" Checkbox sichtbar ist
        await page.waitForSelector('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_3"]/div[2]/input', { visible: true });
        // Klicke die Checkbox für "Torhüter"
        await page.click('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_3"]/div[2]/input', { timeout: 5000 });
        console.log('Checkbox "Torhüter" erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf "Torhüter" Checkbox:');
    }
    
    // Falls notwendig, warte erneut auf eine Aktion nach dem Klick
    await page.waitForTimeout(5000);
    
    try {
        // Warten bis die "(All)" Checkbox sichtbar ist
        await page.keyboard.press('Escape', { timeout: 5000 });
        console.log('ESC gedrückt');
    } catch (error) {
        console.log('Fehler beim ESC drücken!');
    }
    await page.waitForTimeout(1000);


    // Funktion zum PDF-Download ausführen
    await downloadPdf(page, position);

    // Browser schließen
    await browser.close();
}

async function downloadAbw() {
    const position = 'abwehr';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Funktionen zum Öffnen von Tableau und öffnen der PosWahl und entfernen von PosFilter
    await openPage(page);
    await removePosFilter(page);
    
    try {
        // Warten bis die "Abwehr" Checkbox sichtbar ist
        await page.waitForSelector('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_0"]/div[2]/input', { visible: true });
        // Klicke die Checkbox für "Abwehr"
        await page.click('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_0"]/div[2]/input', { timeout: 5000 });
        console.log('Checkbox "Abwehr" erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf "Abwehr" Checkbox:');
    }
    
    // Falls notwendig, warte erneut auf eine Aktion nach dem Klick
    await page.waitForTimeout(5000);
    
    try {
        // Warten bis die "(All)" Checkbox sichtbar ist
        await page.keyboard.press('Escape', { timeout: 5000 });
        console.log('ESC gedrückt');
    } catch (error) {
        console.log('Fehler beim ESC drücken!');
    }
    await page.waitForTimeout(1000);


    // Funktion zum PDF-Download ausführen
    await downloadPdf(page, position);

    // Browser schließen
    await browser.close();
}

async function downloadMf() {
    const position = 'mittelfeld';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Funktionen zum Öffnen von Tableau und öffnen der PosWahl und entfernen von PosFilter
    await openPage(page);
    await removePosFilter(page);
    
    try {
        // Warten bis die "Mittelfeld" Checkbox sichtbar ist
        await page.waitForSelector('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_1"]/div[2]/input', { visible: true });
        // Klicke die Checkbox für "Mittelfeld"
        await page.click('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_1"]/div[2]/input', { timeout: 5000 });
        console.log('Checkbox "Mittelfeld" erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf "Mittelfeld" Checkbox:');
    }
    
    // Falls notwendig, warte erneut auf eine Aktion nach dem Klick
    await page.waitForTimeout(5000);
    
    try {
        // Warten bis die "(All)" Checkbox sichtbar ist
        await page.keyboard.press('Escape', { timeout: 5000 });
        console.log('ESC gedrückt');
    } catch (error) {
        console.log('Fehler beim ESC drücken!');
    }
    await page.waitForTimeout(1000);


    // Funktion zum PDF-Download ausführen
    await downloadPdf(page, position);

    // Browser schließen
    await browser.close();
}

async function downloadSt() {
    const position = 'sturm';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Funktionen zum Öffnen von Tableau und öffnen der PosWahl und entfernen von PosFilter
    await openPage(page);
    await removePosFilter(page);
    
    try {
        // Warten bis die "Sturm" Checkbox sichtbar ist
        await page.waitForSelector('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_2"]/div[2]/input', { visible: true });
        // Klicke die Checkbox für "Sturm"
        await page.click('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_2"]/div[2]/input', { timeout: 5000 });
        console.log('Checkbox "Sturm" erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf "Sturm" Checkbox:');
    }
    
    // Falls notwendig, warte erneut auf eine Aktion nach dem Klick
    await page.waitForTimeout(5000);
    
    try {
        // Warten bis die "(All)" Checkbox sichtbar ist
        await page.keyboard.press('Escape', { timeout: 5000 });
        console.log('ESC gedrückt');
    } catch (error) {
        console.log('Fehler beim ESC drücken!');
    }
    await page.waitForTimeout(1000);


    // Funktion zum PDF-Download ausführen
    await downloadPdf(page, position);

    // Browser schließen
    await browser.close();
}


//** Positionsauswahl öffnen und Positionsfilter entfernen */
async function removePosFilter (page) {
    try {
        // Klicke Position
        await page.wait
        await page.waitForSelector('//*[@id="tableau_base_widget_LegacyCategoricalQuickFilter_1"]/div/div[3]/span/div[1]', { visible: true });
        await page.click('//*[@id="tableau_base_widget_LegacyCategoricalQuickFilter_1"]/div/div[3]/span/div[1]', { timeout: 5000 });
        console.log('Position erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf Position');
    }

    try {
        // Klicke die Checkbox für "(All)"
        await page.wait
        await page.waitForSelector('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_(Alle)"]/div[2]/input', { visible: true });
        await page.click('//*[@id="FI_federated.1h995zk13cukhd13qkcd91wnq4wd,none:Position:nk15566219379631039534_3142159161780403884_(Alle)"]/div[2]/input', { timeout: 5000 });
        console.log('Checkbox "(All)" erfolgreich geklickt.');
    } catch (error) {
        console.error('Fehler beim Klicken auf "(All)" Checkbox');
    }
    
    // Warte kurz, damit das UI Zeit zum Aktualisieren hat
    await page.waitForTimeout(500);
}

//** Tableau Öffnen */
async function openPage (page) {
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
     return page;
}

//** Funktion zum Download von PDF */ 
async function downloadPdf(page, position) {

    // Download Layout öffnen
    try {
        await page.waitForSelector('//*[@id="download"]', { timeout: 5000 });
        console.log('Download Button');
        await page.click('//*[@id="download"]');
        console.log('Download Layout geöffnet');
    } catch (e) {
        console.log('Download Layout konnte nicht gefunden oder geöffnet werden!');
    }

    // 3. Klick auf PDF Button
    try {
        await page.waitForSelector('//*[@id="viz-viewer-toolbar-download-menu"]/div[2]/div/div/span[1]', { timeout: 5000 });
        console.log('Download Layout gefunden');
        await page.click('//*[@id="viz-viewer-toolbar-download-menu"]/div[2]/div/div/span[1]', { timeout: 7000 });
        console.log('PDF Button geklickt');
    } catch (e) {
        console.log('Download Layout konnte nicht gefunden oder PDF Button nicht geklickt werden!');
    }

    // Download-Button klicken und auf den Download warten
    try {
        await page.waitForSelector('//*[@id="export-pdf-dialog-Dialog-Body-Id"]/div/div[4]/button', { timeout: 5000 });
        console.log('Download Button gefunden');

        // Auf den Download warten und dann klicken
        const [download] = await Promise.all([
            page.waitForEvent('download'), // Warte auf den Download
            page.click('//*[@id="export-pdf-dialog-Dialog-Body-Id"]/div/div[4]/button', { timeout: 7000 })
        ]);

        // Speichern der Datei in den gewünschten Ordner
        const filePath = `automation/pdf/${position}.pdf`;
        await download.saveAs(filePath);
        console.log(`Download erfolgreich: ${filePath}`);
    } catch (e) {
        console.log('Download Button konnte nicht gefunden oder geklickt werden!');
    }
}