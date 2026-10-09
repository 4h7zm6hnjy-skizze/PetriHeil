PETRI HEIL PRO – By Marcel Hentschel
Version 1.1.0 | Offlinefähige Web-App | Oktober 2026

DATEIEN
- index.html: Startseite
- app.js, data.js, style.css: App und Offline-Wissensdaten
- assets/: Logo und App-Symbole
- sw.js und manifest.webmanifest: installierbare Offline-Web-App (PWA)
- data/: Fisch-/Fragen-/Regeldateien als JSON zum Nachschlagen

INSTALLATION / START
1. Den vollständigen Inhalt dieser ZIP-Datei in einen Ordner entpacken.
2. Alle Dateien unter einer HTTPS-Adresse hochladen (z.B. auf eigenen Webspace oder einen statischen Webhosting-Dienst). Die Ordnerstruktur beibehalten.
3. index.html in Safari/Chrome öffnen und bei bestehender Internetverbindung die App einmal vollständig laden.
4. iPhone: Safari > Teilen > Zum Home-Bildschirm. Android: Browser-Menü > App installieren.
5. Danach stehen App, Fischlexikon, Lernen und persönliche Daten offline zur Verfügung.

WICHTIG: Ein Doppelklick auf index.html ohne Webserver ermöglicht keine installierbare Offline-PWA. Eine öffentlich zugängliche Live-URL ist in dieser ZIP nicht enthalten. Externe Navigation braucht eine Internetverbindung. GPS benötigt Berechtigungen und meist einen sicheren HTTPS-Kontext.

INHALT
- Angelschein-Training und Prüfungsmodus, insgesamt 110 selbst erstellte Übungsfragen.
- 162 Arten/Einträge aus deutschen Binnen- und Küstengewässern mit Hinweisen zu Lebensraum, Verzehr, Sicherheitsrisiken und Ködern.
- Geprüfte Auszüge zu Mindestmaßen/Schonzeiten für ausgewählte Arten in NRW und Bayern. Andere Bundesländer bewusst ohne ungeprüfte Zahlen. KEINE Vollständigkeit / Aktualitätsgarantie.
- Fangbuch mit Länge, optionalem Gewicht in kg oder g, Ort, GPS und bis zu sechs selbst hochgeladenen Fotos.
- Gold/Silber/Bronze Ranking nach Länge; Foto-Galerie im Fangdetail.
- Angelzeit-Stoppuhr mit Pause, Sessionprotokoll und Zeitstatistik Tag/Woche/Monat/Jahr.
- Gewichtsauswertungen Tag/Woche/Monat/Jahr sowie nach Art; nur gewogene Fische.
- Angelplätze mit optionalem GPS, externe Online-Routenplanung und GPX-Wegpunkt-Export.
- Vollständige JSON-Datensicherung inkl. Fotos. Import mit Zusammenführen oder Ersetzen.

DATENSICHERHEIT
Daten liegen ausschließlich auf deinem Gerät (IndexedDB, ggf. localStorage-Fallback), nicht in der Cloud. Browserdaten-Löschung kann sie unwiderruflich entfernen. Bitte regelmäßig JSON-Backups extern sichern. Import vorher mit einer Testdatei prüfen.

RECHTLICH
Die App ist kein Ersatz für den Fischereischein, die amtliche Fischerprüfung, eine Entnahmeerlaubnis, fachliche Artbestimmung oder die aktuellen lokalen Fischerei-/Naturschutzvorschriften. Schonzeiten und Fangmaße unterscheiden sich nach Bundesland, Gewässer, Schutzgebiet, Küste und EU-Vorgaben. Originalquellen aus Landesrecht sind in der App verlinkt. Insbesondere bei gefährdeten Arten keine Fang- oder Verzehrfreigabe aus einem nicht gefüllten Datensatz ableiten.

OFFLINE-GRENZEN
Erstinstallation, Online-Karten/Navigation sowie eine ggf. notwendige Standortberechtigung funktionieren nicht zwingend ohne Internet. Die App synchronisiert keine Rechtsaktualisierungen; Änderungen müssen vor Ort geprüft werden.
