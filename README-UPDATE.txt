PetriHeil Pro – Zusatzbilder-Update auf Version 2.0.8

INHALT:
- 10 neu generierte Artenbilder (WebP), einzeln mit weißem Hintergrund
- species-images-v2.0.5.js (Bestandsdatei, auf 40 zusätzliche Arten erweitert)
- sw.js (Cache-Generation 2.0.8: offline-Pufferung aller 40 zusätzlichen Artenbilder)
- version.json (Version 2.0.8)
- ARTENZUORDNUNG.json (Kontrolldatei; kann mit hochgeladen werden)
- BILDVORSCHAU.html (lokale Galerie zur Bildprüfung; optional)

UPLOAD IN DAS BESTEHENDE GITHUB-REPOSITORY
1. ZIP entpacken. Nicht die ZIP allein auf GitHub ablegen – sie wird dort nicht automatisch entpackt.
2. Die 10 .webp-Dateien in den GitHub-Hauptordner hochladen.
3. Die drei bestehenden Dateien sw.js, species-images-v2.0.5.js, version.json mit den Versionen hier ersetzen.
4. 'Commit changes' in GitHub bestätigen. Bestehende index.html, app.js, data.js, style.css und Bilder NICHT löschen.
5. Über HTTPS starten: https://4h7zm6hnjy-skizze.github.io/PetriHeil/
6. App online neu laden; ggf. nach Aktivierung des neuen Service Workers ein weiteres Mal öffnen.
7. Fischkunde der 10 neuen Arten prüfen. Danach Flugmodus einschalten und Offline-Bilder testen.

FISCHBILDER (APP-ID -> DATEI):
- s37 Seehase -> seehase.webp
- s38 Seewolf (Gestreifter) -> seewolf-gestreifter.webp
- s40 Kuckuckslippfisch -> kuckuckslippfisch.webp
- s42 Großer Scheibenbauch -> grosser-scheibenbauch.webp
- s43 Europäischer Butterfisch -> europaeischer-butterfisch.webp
- s44 Aalmutter -> aalmutter.webp
- s45 Seestichling -> seestichling.webp
- s46 Grasnadel -> grasnadel.webp
- s47 Große Seenadel -> grosse-seenadel.webp
- s50 Seepferdchen (Langschnäuziges) -> seepferdchen-langschnauziges.webp

WICHTIG
Diese ZIP ist ein Ergänzungspaket, NICHT die vollständige Web-App. Es kann nicht automatisch in das GitHub-Repository eingespielt werden, wenn die GitHub-Schreibberechtigung der Integration blockiert ist.
Die persönliche Fangdatenbank liegt im Browser-Speicher; den Website-Speicher nicht löschen.
KI-generierte Abbildungen sind nicht verlässlich genug für eindeutige Artbestimmung oder Entscheidungen über Fang/Entnahme. Besonders Seestichling, Seenadeln und Scheibenbauch sollten fachlich überprüft werden.
