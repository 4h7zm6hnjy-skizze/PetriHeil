PETRI HEIL PRO 4.4.7 – UPDATE-PAKET

Dies ist ein UPDATE-GENERATOR, KEINE bereits auf GitHub installierte Version.
Der GitHub-Connector erlaubt Lesezugriff, aber keine Änderungen (HTTP 403).

Installation auf einem Rechner:
1. Die ORIGINAL-REPOSITORY-ZIP-Datei von
   https://github.com/4h7zm6hnjy-skizze/PetriHeil/archive/refs/heads/main.zip
   herunterladen. Nicht mit dem vorhandenen Update-Paket verwechseln.
2. Python 3 installieren, sofern es nicht vorhanden ist.
3. In einem Terminal ausführen:
   python update_petriheil.py PetriHeil-main.zip
4. Die erstellte Datei 'PetriHeilPro_4.4.7_Vollversion.zip' enthält
   ALLE bisherigen Repository-Dateien plus die geänderten Dateien.
5. Das aktualisierte Projekt in einen Git-Klon entpacken, dann committen
   und zu GitHub pushen. Eine ZIP als einzelnes GitHub-File hochzuladen
   aktualisiert die Website NICHT!

WICHTIG: Vor dem Update die persönlichen Daten der Web-App sichern.
Keine iPhone-Safari-Daten, Caches, Fotos oder Einstellungen löschen.
Externe Satellitenbilder benötigen eine Internetverbindung und können
in manchen Zoomstufen trotz Rückfallstufen fehlen.

Prüfung: Das Skript führt strikte Versions-/Ankerkontrollen aus und bricht
bei unerwarteten 4.4.6-Dateien ab, statt sie blind zu überschreiben.
Die eigentliche browserbasierte Funktion muss anschließend getestet werden.
