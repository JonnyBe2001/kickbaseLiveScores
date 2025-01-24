// refresh.js
let touchStart = 0;
let touchEnd = 0;

document.addEventListener('touchstart', (e) => {
  touchStart = e.changedTouches[0].screenY;
});

document.addEventListener('touchmove', (e) => {
  touchEnd = e.changedTouches[0].screenY;

  // Wenn der Benutzer nach unten zieht, lade die Seite neu
  if (touchEnd - touchStart > 100) { // Ein Threshold von 100px
    window.location.reload();
  }
});