PETRI HEIL PRO 4.4.9 — INSTALLATION UND PRUEFBERICHT
====================================================
Stand: 12.10.2026
Originalbasis: GitHub main / Version 4.4.8

WICHTIG: 4.4.9 IST DURCH DIESES PAKET NOCH NICHT VEROEFFENTLICHT.

EINFACHE INSTALLATION (NUR EINE DATEI HOCHLADEN)
1. GitHub öffnen: https://github.com/4h7zm6hnjy-skizze/PetriHeil
2. NUR die Datei petriheil-449.yml hochladen.
3. Falls sie im Repository-Hauptordner erscheint, GitHub-Editor öffnen und
   den Dateinamen oben umbenennen in:
       .github/workflows/petriheil-449.yml
4. "Commit changes" bestätigen.
5. GitHub Actions prüft daraufhin den tatsächlichen Repository-Bestand.
   Bei Erfolg erstellt die Aktion eine vollständige Projekt-ZIP, einen QA-Bericht
   und veröffentlicht die geprüften Änderungen im main-Zweig.
6. Nach grünem Workflow GitHub Pages abwarten. In der App "Version prüfen";
   falls Worker noch 4.4.8 meldet, "Update installieren" wählen.
   VORHER ein privates Backup erstellen.

WAS WIRD BEHOBEN
- Das Angelcockpit prüft nicht mehr fest petri-core-v4.4.7.json, sondern das
  Offline-Manifest passend zur aktuell geladenen Version.
- Kern-Cache wird versionsgebunden und ohne Fehlmeldungen durch Alt-Caches geprüft.
- App/Server/Offline-Worker werden sauber verglichen, alte Version wird gemeldet.
- Der wirkungslose automatische PREFETCH_IMAGES-Befehl entfällt. Die explizite
  Bild-Offline-Vorbereitung über die vorhandene Schaltfläche bleibt bestehen.
- Fangbuch-/Angeltag-Exportdateinamen zeigen 4.4.9; das JSON-Datenformat bleibt
  aus Kompatibilitätsgründen weiterhin 4.4.0.
- 37 Seiten-Metadaten, Nav-/Offline-/Service-Worker-Revisionsdateien aktualisiert.
- Alle vorhandenen Fänge, Bilder, Orte und andere lokale Daten bleiben unangetastet.

BEWUSST NICHT UMGESETZT
- Das ca. 4,48 MB große app.js nicht in Module aufgeteilt; dies erfordert echte
  Browser-Regressionstests, um keine bestehenden Funktionen zu beschädigen.
- Kein automatisches Offline-Laden von 228 Bildern ohne Nutzeraktion.
- Keine Verifikation jeder einzelnen Funktion unter realen iPhone-, GPS-,
  Satelliten- oder Netzausfall-Bedingungen.

GETESTET VOR AUSLIEFERUNG
- Python-Kompilierung des eingebetteten Patches
- YAML syntaktisch geparst (8 GitHub-Actions-Schritte)
- eingebetteter Python-Code bytegenau mit Einzeldatei verglichen
- Testdurchlauf in nachgebildetem Repository: Patch 48 Dateien, QA 0 Fehler,
  0 Warnungen, zweite Ausführung sicher gesperrt
- NICHT im originalen Repo ausgeführt; GitHub Actions macht die Original-Prüfung.

KOMPONENTEN IM ZIP
- petriheil-449.yml: die EINZIGE notwendige GitHub-Upload-Datei
- petri449_patch.py: optionales separates Python-Skript für Fachleute
- README-4.4.9.txt: diese Anleitung

Der Github-Workflow veröffentlicht nur nach bestandenen Prüfungen.
