PetriHeil Pro - Bilderupdate 2.0.9

Lieferumfang:
- 10 neue, je einem Arteintrag zugewiesene WebP-Bilder mit weißem Hintergrund
- species-images-v2.0.5.js (bestehender Loader; erweitert auf 50 neue Artenbilder)
- sw.js (Offline-Cache für alle 50 zusätzlichen Artenbilder, Version 2.0.9)
- version.json (2.0.9)
- ARTENZUORDNUNG.json und BILDVORSCHAU.html (Kontrolle, optional)

INSTALLATION (NICHT die ZIP als eine Datei ins GitHub-Repository legen):
1. ZIP entpacken.
2. Alle zehn *.webp-Dateien ins Hauptverzeichnis deines PetriHeil-GitHub-Repositories hochladen.
3. DIESE DREI DATEIEN des Repositories ersetzen: sw.js, species-images-v2.0.5.js, version.json.
4. Vorhandene Dateien index.html, app.js, data.js, style.css und alle älteren WebP-Dateien behalten.
5. Änderungen committen. Die App online starten: https://4h7zm6hnjy-skizze.github.io/PetriHeil/
6. Seite nach Aktivierung des neuen Service Workers erneut laden; Artbilder und Version prüfen.
7. In der App Flugmodus testen, nachdem alle Bilder online einmal geladen wurden.

WICHTIG:
Das ist ein Ergänzungspaket für die bestehende App-Version 2.0.8 (keine vollständige App-ZIP).
Es wurde nicht automatisch in das Repository geschrieben; direkter Schreibzugriff ist gesperrt.
Lokale Fangdaten liegen im Browser. Website-Speicher nicht löschen, ohne vorher ein Backup anzulegen.
Der direkte iPhone-Betrieb lässt sich erst nach Veröffentlichung prüfen.
Die KI-Abbildungen sind nicht wissenschaftlich validiert. Ähnlich aussehende Grundel- und Seenadelarten anhand fachlich bestätigter Fotos/Diagnosemerkmale prüfen.

ARTENZUORDNUNG:
s48: Kleine Seenadel (Syngnathus rostellatus) -> kleine-seenadel.webp
s49: Schlangennadel (Entelurus aequoreus) -> schlangennadel.webp
s51: Seepferdchen (Kurzschnäuziges) (Hippocampus hippocampus) -> seepferdchen-kurzschnauziges.webp
s52: Schwarzgrundel (Gobius niger) -> schwarzgrundel.webp
s53: Sandgrundel (Pomatoschistus minutus) -> sandgrundel.webp
s54: Strandgrundel (Pomatoschistus microps) -> strandgrundel.webp
s55: Fleckengrundel (Pomatoschistus pictus) -> fleckengrundel.webp
s58: Goldstrieme (Sarpa salpa) -> goldstrieme.webp
s59: Meerbrasse (Pagellus bogaraveo) -> meerbrasse.webp
s61: Hai (Kleingefleckter Katzenhai) (Scyliorhinus canicula) -> hai-kleingefleckter-katzenhai.webp
