Petri Heil Pro 2.1.7 – Update-Reparatur

1. Eine Sicherung deiner Fangdaten erstellen, sofern die App erreichbar ist.
2. Alle 8 Dateien aus dieser ZIP direkt im GitHub-Repositorium PetriHeil im Hauptverzeichnis hochladen.
   Vorhandene Dateien mit identischem Namen ersetzen. Keine anderen Dateien loeschen.
3. Warten, bis GitHub Pages die Dateien veroeffentlicht hat.
4. Die bisherige Petri-Heil-App auf dem iPhone mit Internetverbindung oeffnen.
5. Unter "Mehr" / "Backup & Einstellungen" auf "Update-Reparatur oeffnen" tippen.
6. "Aktuelle Version installieren & App oeffnen" waehlen und die Fortschrittsanzeige beobachten.
7. Nach erfolgreicher Installation: App vollstaendig schliessen und neu oeffnen; Version 2.1.7 pruefen.

WICHTIG: App nicht deinstallieren. Keine Website-Daten, LocalStorage, IndexedDB oder Caches manuell loeschen.
Alte Cache-Versionen bleiben erhalten; beim fehlgeschlagenen Download bleibt der alte Worker aktiv.

Ursache in 2.1.6: Die Ressource petri-hero-uebersicht-v2.1.6.webp stand im gleichen
Cache.addAll mehrfach. Die Updateinstallation konnte dadurch als InvalidStateError scheitern.
2.1.7 entdupliziert alle Pfade und zeigt bei Dateifehlern den betroffenen Dateinamen.
