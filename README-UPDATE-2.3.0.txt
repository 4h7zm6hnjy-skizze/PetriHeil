PETRI HEIL PRO – UPDATE 2.3.0
=============================

EINRICHTUNG
1. Sicherung der bisherigen Fänge/Backups erstellen. Die installierte App NICHT löschen.
2. Inhalt dieses ZIP entpacken und ALLE enthaltenen Dateien (ohne Unterordner)
   in das Wurzelverzeichnis des GitHub-Repositories PetriHeil hochladen.
3. Nach der Veröffentlichung die bisherige App öffnen.
4. Mehr -> Update-Reparatur öffnen; Serverversion 2.3.0 abwarten und installieren.
5. Wenn die Reparaturseite nicht erreichbar ist, die bekannte GitHub-Pages-Adresse
   der App mit /update-rettung.html am Ende in Safari/Chrome öffnen.
6. Die neue Seite "Werkzeuge & Privat-Backup" öffnen.
7. Dort Systemcheck starten. Danach in "Offline prüfen" fehlende Bilder ergänzen.
8. Erst bei vollständigem Status im Flugmodus die Kernfunktionen prüfen.

WAS IST NEU?
- Eigene Seite werkzeuge.html: Offline-/Speicher-/Versionsdiagnose,
  Export eines technischen Berichts ohne persönliche Inhalte.
- Verschlüsseltes Privat-Backup mit AES-256-GCM, PBKDF2 (210.000 Iterationen):
  bewusster lokaler Export und manueller Import.
- Bis zu 8 Zusatzfotos je Fang aus dem Pro-Fangbuch; lokal in IndexedDB.
- Häufigkeitsstatistik der Arten aus dem Pro-Fangbuch.
- Abhakbare Schritt-für-Schritt-Rutenmontage für die 10 praktischen NRW-Aufgaben.
- Überarbeiteter Offline-Worker mit 48 eindeutigen Pflichtressourcen und
  Cache-Erhalt, wenn ein neues Update fehlschlägt.
- Verbesserte Touchflächen, Mobil-Darstellung und Ladeverhalten von Listenbildern.
- Kein automatischer Daten-Upload, keine Cloud-Synchronisierung, keine
  Übermittlung von Fängen, Fotos oder GPS-Punkten an Drittanbieter.

PRIVAT-BACKUP: WICHTIGE HINWEISE
- Ein mindestens 12-stelliges Backup-Passwort ist erforderlich.
- Wer das Passwort vergisst, kann die verschlüsselte Datei NICHT entschlüsseln.
- Die Browserdatei muss vom Benutzer selbst auf einem sicheren Medium aufbewahrt werden.
- Beim Import werden gleichnamige Daten überschrieben. Vor Import IMMER Backup anlegen.
- Datenbank-Importe sind nicht vollständig atomar, besonders bei Speicherproblemen.
- Nur lokal lesbare Petri-Datenbanken und lokale Web-App-Speicher werden gesichert;
  bei Browserbeschränkungen können einzelne Datenspeicher fehlen.
- Zusatzfotos sind an die IDs im Pro-Fangbuch gebunden und erscheinen in Werkzeuge,
  nicht automatisch im alten Standard-Fangformular.
- iPhone und Android besitzen GETRENNTE lokale Datenspeicher; kein stiller Abgleich.

OFFLINE-GRENZEN
- Für den ersten Download, Versionsprüfung und Updates muss der Webhost erreichbar sein.
- Für die 228 vorhandenen Bilder einmalig "Offline prüfen" -> vorbereiten durchführen.
- Live-Wetter, externe Karten und aktuelle externe Informationen sind im
  Privatmodus nicht verfügbar.
- Browser können Offline-Daten unter Speicherdruck entfernen. Regelmäßig prüfen.
- Es ist KEIN Komplett-Export des GitHub-Repositories: die unveränderten ca.
  330 Dateien inkl. der bisherigen Bilder bleiben im Repository bestehen.

TESTSTATUS
- Statische Syntaxprüfung der neuen JS-Dateien erfolgreich.
- Simulierter Service-Worker-Installationslauf für 48 Kernressourcen erfolgreich.
- Fehlende Bild-/Startseite in der Installation simuliert: Vorversion bleibt erhalten.
- AES-GCM-/PBKDF2-Verschlüsselungstest und falsches Passwort erfolgreich.
- Echtgerät-Tests für Safari, Android Chrome, Kamera, GPS und großen Backup-Import offen.
- app.js (ca. 4.5 MB) ist unverändert und nicht vollumfänglich auditiert.
