PETRIHEIL PRO 2.0.7 – Update von der vorhandenen GitHub-Version 2.0.6
10 neue Fischbilder • jetzt 30 ergänzende KI-Bilder • bisherige 70 eingebettete Bilder bleiben erhalten

WICHTIG: Dieses Paket ergänzt das GitHub-Projekt; es ist NICHT das vollständige App-Projekt.
Eine ZIP im GitHub-Hauptordner entpackt sich NICHT automatisch. Dateien einzeln hochladen.

VERÖFFENTLICHUNG
1. ZIP lokal entpacken.
2. Auf https://github.com/4h7zm6hnjy-skizze/PetriHeil im Branch main
   die zehn neuen .webp-Dateien in den HAUPTORDNER hochladen.
3. Ebenso die drei Dateien species-images-v2.0.5.js, sw.js und version.json
   hochladen und die bestehenden Dateien ersetzen (GitHub: Änderungen committen).
4. ARTENZUORDNUNG.json ist nur zu Kontrollzwecken und muss nicht auf GitHub.
5. App https://4h7zm6hnjy-skizze.github.io/PetriHeil/ online mehrfach neu laden,
   anschließend Fischkunde und die Version unter Mehr prüfen.
6. Nachdem das Laden abgeschlossen ist, im Flugmodus die Bildanzeige testen.

Bestehende app.js, data.js, index.html, style.css, Bilder und Fangdaten nicht löschen.
Bitte NICHT den Safari-Websitespeicher löschen: Er enthält möglicherweise persönliche Daten.
Die neue Service-Worker-Datei injiziert das aktualisierte Bildskript in die bestehende
index.html, die weiterhin aus der Basisversion stammt. Beim ersten Laden ist deshalb
unter Umständen noch eine alte Versionsnummer sichtbar, bis der neue Worker aktiv ist.

HINWEIS ZUR SACHLICHEN KORREKTHEIT
KI-generierte Darstellungen können anatomische Merkmale falsch abbilden. Daher
keine sichere Fischbestimmung oder Fang-/Entnahmeentscheidung allein damit treffen.
Die bestehende Appdatenbank verwendet bei zwei Störarten wissenschaftliche und
umgangssprachliche Namen in möglicherweise widersprüchlicher Kombination;
diese Arten sollten vor Einsatz als Bestimmungsreferenz fachlich geprüft werden.

NEUE ARTENBILDER:
  - Meerforelle [f25]: meerforelle-neu.webp
  - Atlantischer Stör [f71]: atlantischer-stoer-neu.webp
  - Europäischer Stör [f72]: europaeischer-stoer.webp
  - Donau-Neunauge [f89]: donau-neunauge.webp
  - Stintdorsch [s19]: stintdorsch.webp
  - Kleines Petermännchen [s36]: kleines-petermaennchen.webp
  - Lippfisch (Goldmaid) [s39]: lippfisch-goldmaid.webp
  - Gefleckter Lippfisch [s41]: gefleckter-lippfisch.webp
  - Meeräsche (Dicklippige) [s56]: meeraesche-dicklippige.webp
  - Meeräsche (Dünnlippige) [s57]: meeraesche-duennlippige.webp
