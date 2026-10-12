PETRI HEIL PRO 4.4.8 – INSTALLATION UND PRÜFUNGEN
12. Oktober 2026

AUSGANGSLAGE
Die aktuell veröffentlichte GitHub-Version war zum Prüfzeitpunkt 4.4.7.
Die Datei petriheil-448.yml in diesem Paket ist ein vollständig vorbereitetes
GitHub-Actions-Update. Sie enthält den Update-Code und die Qualitätstests direkt.

EINE DATEI AUF GITHUB ANLEGEN
1. Öffne das Repository https://github.com/4h7zm6hnjy-skizze/PetriHeil
2. Nutze "Add file" > "Create new file".
3. Setze als KOMPLETTEN Dateipfad:
      .github/workflows/petriheil-448.yml
4. Kopiere den kompletten Inhalt der Datei petriheil-448.yml aus diesem Paket
   in die neue GitHub-Datei und speichere mit "Commit changes" auf main.
5. Öffne danach https://github.com/4h7zm6hnjy-skizze/PetriHeil/actions
   und warte auf den Lauf "Petri Heil Pro 4.4.8 ...".
6. NUR wenn der Lauf erfolgreich endet, werden die geprüften Änderungen auf
   main geschrieben. Die Vollversions-ZIP erscheint unter "Artifacts".

NICHT die ZIP-Datei einfach ins Repository-Hauptverzeichnis hochladen.
Das würde nur die ZIP-Datei speichern und KEIN Update durchführen.

WAS GEÄNDERT WIRD
- Falsche Warnung "Eine neuere Version 4.4.7 ist gemeldet" verschwindet.
- Veralteter Update-Status wird zugunsten der bestätigten Versionsprüfung entfernt.
- Versions-Metadaten werden auf 37 Unterseiten vereinheitlicht.
- Tote Linkziele detailkarte.html werden auf karten-detail.html korrigiert.
- Neuer Cache, Service Worker und Offline-Kern für 4.4.8.
- Prüfbericht, GitHub-Workflow mit Abbruch bei Fehlern.

WAS GEPRÜFT WIRD
- JavaScript-Syntax aller JS-Dateien des ORIGINAL-Repositorys (Node).
- Gültigkeit der JSON-Dateien, Webmanifest und des Offline-Kerns.
- HTML-Verweise, Navigation und Version aller 37 normalen App-Seiten.
- Bild-Dateiköpfe für PNG und WebP, ursprüngliche Bildanzahl.
- Bestehende offlinefähige Dateien und Versionsbezüge.

SCHUTZ DER NUTZERDATEN
Der Patch verändert kein persönliches Fangbuch, keine IndexedDB,
keine eigenen Orte, keine Fotos, kein localStorage und keine privaten Backups.
Diese Daten liegen normalerweise auf dem jeweiligen Gerät und sind NICHT
Teil des GitHub-Repositorys. Vor einem größeren App-Update trotzdem in
der Anwendung eine eigene Datensicherung erstellen.

WICHTIGER TESTHINWEIS
Ein lokaler Probelauf auf einem NACHGEBILDETEN Projekt war erfolgreich.
Die vollständige Prüfung aller Originaldateien erfolgt erst beim GitHub-Lauf.
Eine 100-prozentige Fehlerfreiheit ist nicht garantiert. Echte iPhone-Tests,
Netz-/GPS-Bedingungen, iOS-Datenspeicher und Kartenanbieter werden durch diese
Tests nicht ersetzt. Bei Fehler im Qualitätscheck wird NICHT veröffentlicht.
