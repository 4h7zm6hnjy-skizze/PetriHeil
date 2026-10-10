#!/usr/bin/env python3
"""Patches an existing full Petri Heil Pro 2.0.4 app directory in place.
Never modifies saved user data in the browser. Make a copy of the original first.
Usage: python aktualisieren.py PATH_TO_UNZIPPED_GITHUB_REPO
"""
from pathlib import Path
import sys,shutil,json,re
HERE=Path(__file__).resolve().parent
DEST=Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else None
if DEST is None or not DEST.is_dir():raise SystemExit('Aufruf: python aktualisieren.py PFAD_ZUR_VOLLSTAENDIGEN_APP')
if DEST==HERE:raise SystemExit('Nicht den Patch-Ordner als Ziel wählen.')
NEEDED=['index.html','app.js','data.js','style.css','sw.js','version.json']
miss=[x for x in NEEDED if not (DEST/x).is_file()]
if miss:raise SystemExit('Original-App unvollständig: '+', '.join(miss))
v=json.loads((DEST/'version.json').read_text(encoding='utf-8'))
if v.get('version') not in ('2.0.4','2.0.5'):
    raise SystemExit('Version '+str(v.get('version'))+' wird nicht automatisch überschrieben. Erwartet: 2.0.4.')
page=(DEST/'index.html').read_text(encoding='utf-8')
worker=(DEST/'sw.js').read_text(encoding='utf-8')
if not re.search(r'<script[^>]+src=[\'"]app\.js',page):raise SystemExit('Keine gültige PetriHeil index.html gefunden.')
if '</body>' not in page:raise SystemExit('</body> fehlt – Abbruch ohne Änderungen.')
match=re.search(r'(const IMAGES\s*=\s*\[)(.*?)(\]\s*;)',worker,re.S)
if not match:raise SystemExit('Offline-Bilderliste in sw.js fehlt – Abbruch ohne Änderungen.')
# All checks succeeded: now modify only the known app files.
for name in ['giebel', 'goldfisch', 'dreistachliger-stichling', 'schwarzmundgrundel', 'stint', 'sterlet', 'bachneunauge', 'petermaennchen', 'europaeischer-hummer', 'chinesische-wollhandkrabbe']:
    source=HERE/'assets'/'ki-bilder'/(name+'.webp')
    if not source.is_file():raise SystemExit('Neues Bild fehlt: '+str(source))
    target=DEST/'assets'/'ki-bilder'/(name+'.webp')
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,target)
shutil.copy2(HERE/'species-images-v2.0.5.js',DEST/'species-images-v2.0.5.js')
if 'species-images-v2.0.5.js' not in page:
    page=page.replace('</body>','<script src="species-images-v2.0.5.js?v=2.0.5"></script>\n</body>')
page=page.replace('2.0.4','2.0.5')
(DEST/'index.html').write_text(page,encoding='utf-8')
app=DEST/'app.js';source=app.read_text(encoding='utf-8')
if '2.0.4' in source:app.write_text(source.replace('2.0.4','2.0.5'),encoding='utf-8')
style=DEST/'style.css';source=style.read_text(encoding='utf-8')
if '2.0.4' in source:style.write_text(source.replace('2.0.4','2.0.5'),encoding='utf-8')
worker=worker.replace('2.0.4','2.0.5').replace('v2-0-4','v2-0-5')
match=re.search(r'(const IMAGES\s*=\s*\[)(.*?)(\]\s*;)',worker,re.S)
old=match.group(2)
new=[json.dumps('./assets/ki-bilder/'+n+'.webp') for n in ['giebel', 'goldfisch', 'dreistachliger-stichling', 'schwarzmundgrundel', 'stint', 'sterlet', 'bachneunauge', 'petermaennchen', 'europaeischer-hummer', 'chinesische-wollhandkrabbe'] if (n+'.webp') not in old]
worker=worker[:match.start(3)]+(',' if old.strip() and new else '')+','.join(new)+worker[match.start(3):]
core=re.search(r'(const CORE\s*=\s*\[)(.*?)(\]\s*;)',worker,re.S)
if core and 'species-images-v2.0.5.js' not in core.group(2):
    worker=worker[:core.start(3)]+',"./species-images-v2.0.5.js?v=2.0.5"'+worker[core.start(3):]
(DEST/'sw.js').write_text(worker,encoding='utf-8')
v['version']='2.0.5';v['releaseDate']='2026-10-10';v['changes']=[
  '10 zusätzliche lokal gebündelte KI-Artenbilder zu den 70 bisherigen Bildern.',
  'Automatische Zuordnung in Fisch- und Krebskunde und offlinefähige WebP-Dateien.',
  'Update suchen prüft version.json getrennt von großen App-Dateien.',
  'Versions- und Cache-Aktualisierung auf 2.0.5.'
]
v['notes']='KI-Abbildungen sind keine wissenschaftlich geprüften Bestimmungsfotos. Nicht allein für Entnahme-/Verzehrentscheidungen verwenden.'
(DEST/'version.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('OK: PetriHeil 2.0.5 im Ordner '+str(DEST))
print('10 Bilder, Offline-Cache, Versionsprüfung integriert. Alle Projektdateien veröffentlichen.')
