PetriHeil Pro – Ergänzungsupdate 2.0.10

WICHTIG: Dies ist ein Patch für das aktuell auf GitHub veröffentlichte PetriHeil 2.0.9.
Nicht die ZIP-Datei selbst hochladen: erst entpacken.

Enthalten sind fünf NEUE WebP-Artenbilder (nicht zehn), die aufgrund einer Sichtprüfung
plausibel den vorhandenen App-Einträgen zugeordnet werden können:
 - s62 Dornhai (Squalus acanthias) => dornhai.webp
 - s64 Heringshai (Lamna nasus) => heringshai.webp
 - s65 Nagelrochen (Raja clavata) => nagelrochen.webp
 - s66 Sternrochen (Amblyraja radiata) => sternrochen.webp
 - s67 Glattrochen (Dipturus batis) => glattrochen.webp

Fünf der zuletzt erzeugten Bilder werden bewusst NICHT eingebaut,
weil deren dargestellte Arten nicht zu bisher unbebilderten App-Arteinträgen passen
oder bereits vorhanden sind:
 - blauer_hai_im_seitenprofil.png: Blauhai – nicht Hundshai (Galeorhinus galeus)
 - fuchshai_mit_langem_peitschenschwanz.png: Fuchshai – kein solcher Arteintrag im Lexikon
 - marmorierter_engelhai_auf_weissem_hintergrund.png: Engelhai – kein solcher Arteintrag im Lexikon
 - symmetrischer_adlerrochen_auf_weissem_hintergrund.png: Adlerrochen – nicht Kuckucksrochen (Leucoraja naevus)
 - gefleckter_katzenhai_im_seitenprofil.png: Kleingefleckter Katzenhai – Arteintrag s61 besitzt bereits ein eigenes Bild

INSTALLATION:
1. ZIP entpacken.
2. Die 5 .webp-Dateien direkt in den Hauptordner des GitHub-Repositories hochladen.
3. Dort die drei Dateien sw.js, species-images-v2.0.5.js und version.json ersetzen.
4. index.html, app.js, data.js, style.css und die bereits vorhandenen Bilder NICHT löschen.
5. Änderungen auf GitHub speichern. Bei bestehender Home-Screen-App in Safari neu laden,
   damit der aktualisierte Service-Worker aktiv wird. Nicht den iPhone-Website-Speicher löschen:
   Fangdaten können sonst verloren gehen.
6. Die fünf neuen Bilder erst online und anschließend nach dem Cachen offline kontrollieren.

App: https://4h7zm6hnjy-skizze.github.io/PetriHeil/

Die Artmerkmale sind KI-generiert und nicht wissenschaftlich bestätigt.
Nicht zur verbindlichen Bestimmung, Gefahreneinschätzung oder Entnahmeentscheidung nutzen.
GitHub-Veröffentlichung und iPhone-Lauftest müssen nach manuellem Upload geprüft werden.
