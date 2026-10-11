PETRI HEIL PRO 2.4.0 – GESAMT-FUNKTIONSUPDATE
Stand: 11.10.2026

INSTALLATION
1. Vor dem Update eine externe Datensicherung erstellen, soweit möglich.
2. ZIP entpacken und die Dateien aus diesem Archiv in das GitHub-Repository
   4h7zm6hnjy-skizze/PetriHeil, Hauptverzeichnis, hochladen.
3. Bei gleichnamigen Dateien die vorhandenen ersetzen, bestehende andere
   Dateien und insbesondere die 228 Fisch-/Ausrüstungsbilder NICHT löschen.
4. GitHub-Pages-Veröffentlichung abwarten. Über update-rettung.html
   Server-Version 2.4.0 verifizieren und installieren.
5. Über Werkzeuge/Offline prüfen kontrollieren: Offline-Worker-Version 2.4.0,
   alle 51 Grunddateien sowie alle 228 Bilder vorhanden.
6. Auf iPhone und Android getrennt offline vorbereiten. Flugmodus testen.

NEU: Meine Angelzentrale (erweiterungen.html):
  1 Angeltrip-Planer mit Checklisten und Zuordnung von Pro-Fängen
  2 Digitales Gewässertagebuch
  3 Köder-Erfolgsanalyse (Fanghäufigkeit; keine berechenbare Fangquote)
  4 Ausrüstungsverwaltung mit lokalen Fotos und Wartungsterminen
  5 Fischarten-Vergleich mit lokal vorhandenen Bildern
  6 Praktische NRW-Prüfung mit Aufgaben-Checklisten
  7 Schonzeiten-Kalender NRW mit hinterlegten Grundregeln ab 03.07.2026
  8 Rekordbuch aus den vorhandenen Pro-Fängen
  9 Angel-Kostenrechner
 10 Offline-Gewässerkarten: private Bildkarte und Koordinaten-Skizze
 11 Verschlüsseltes Privat-Backup vor dem Import vergleichen (nur Lesemodus)
 12 Startseiten-Schnellzugriffe ein-/ausblenden und sortieren

Datenschutz: Erweiterungen enthalten keine externen API-Aufrufe.
Fänge aus der bestehenden Pro-Angelzentrale werden nur gelesen.
Neue Formulardaten werden getrennt unter petri240-personal-v1 gespeichert.
Lokale Kartenbilder/Ausrüstungsbilder in IndexedDB petri240-offline-map-v1.
Der bestehende verschlüsselte Backup-Export kann diese Daten (nach
Berechtigung/Verfügbarkeit des Browsers) mit erfassen.

OFFLINE-KARTEN SIND KEINE EXTERNEN LANDKARTEN. Ohne Internet und ohne
Weitergabe von Koordinaten können nur selbst importierte Kartenausschnitte,
Gewässerskizzen und eine Positionsskizze der eigenen Angelstellen bereitstehen.

Rechtsinformationen: Landesfischereiverordnung NRW, Fassung 03.07.2026,
§§ 1–3, recht.nrw.de/lrgv/rechtsverordnung/03072026-landesfischereiverordnung-lfischvo/
Örtlich können strengere Regeln, besondere Genehmigungen und Schongebiete
bestehen; bitte Erlaubnisschein und aktuelle amtliche Fassung prüfen.

TECHNISCHE GRENZEN:
- Der 4,5-MB-Hauptcode app.js bleibt unangetastet. Kein vollständiger E2E-Test.
- Keine echte Android- oder iPhone-Testinstallation in dieser Entwicklungsumgebung.
- Offline-Ressourcen können auf Mobilgeräten vom Betriebssystem bei Speichermangel
  entfernt werden; vor einer Angeltour Kontrolle wiederholen.
- Live-Wetter und externe Karten bleiben wegen des Privatmodus deaktiviert.
- Das Backup-Vergleichswerkzeug ändert keine Datensätze und führt keine
  automatische Zusammenführung aus. Der vorhandene Import kann überschreiben.
- Hosting über GitHub Pages erfordert beim Aufruf technisch Netzwerkdaten an
  den Webhost. Keine automatische Übertragung von Fangdaten oder Fotos.

Dieses ZIP enthält nur die aktualisierten und neuen Dateien, nicht das gesamte
Repository mit seinen vorhandenen Bildern/Programmdaten.
