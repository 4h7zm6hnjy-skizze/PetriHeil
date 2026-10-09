PETRI HEIL PRO 2.0.2 – BILDER-REPARATUR
========================================

URSACHE
Im veröffentlichten GitHub-Repository fehlten Bilddateien im Ordner
assets/ki-bilder. Der Browser zeigte darum defekte Bildsymbole an.

DIESE VERSION BENÖTIGT DIESE BILDDATEIEN NICHT MEHR!
Die 70 bisher erzeugten KI-Bilder sind direkt in app.js eingebettet.
Fischkunde und Ausrüstung können sie ohne weitere Bildordner anzeigen.
Das App-Logo ist in index.html eingebettet.

GITHUB UPLOAD
1. Erstelle in der bisherigen App ein BACKUP deiner Fangdaten.
2. Entpacke die ZIP-Datei auf deinem Gerät.
3. Lade mindestens folgende Dateien in den HAUPTORDNER deines
   GitHub-Repositories hoch und ersetze gleichnamige Dateien:
   - index.html
   - app.js
   - data.js
   - style.css
   - sw.js
   - version.json
   - manifest.webmanifest
   Weitere assets-Dateien kannst du ebenfalls hochladen.
   WICHTIG: GitHub ZIP-Datei nicht ungeöffnet ablegen.
4. GitHub Pages braucht etwas Zeit bis zur Veröffentlichung.
5. Öffne die App online, wähle Mehr > Update suchen,
   und aktualisiere. Alternativ die GitHub-Pages-Adresse in Safari
   mit ?v=2.0.2 aufrufen (URL-Parameter an die Basisadresse anhängen).

ZUM TESTEN
App-Fischkunde: Hecht, Zander, Flussbarsch, Kaulbarsch. Die
Bilder funktionieren nun auch ohne assets/ki-bilder.
Alte installierte Web-App auf dem Home-Bildschirm ggf. komplett
beenden und erneut über Safari starten; persönliche Daten nicht löschen.

HINWEIS: KI-Bilder sind illustrative Darstellungen, keine sicheren
Bestimmungsfotos. Schonzeiten und Fischereirecht gesondert prüfen.
