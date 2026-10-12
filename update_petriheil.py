#!/usr/bin/env python3
"""Petri Heil Pro 4.4.7 – conservative, non-destructive source updater.

Usage:
    python update_petriheil.py PetriHeil-main.zip
    python update_petriheil.py /path/to/cloned/PetriHeil

Reads the current 4.4.6 source; writes a new 4.4.7 FULL repository ZIP.
Original ZIP and original working tree are not modified.
No website storage, databases, photos, or application user data is touched.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from collections import OrderedDict
from datetime import date
from io import BytesIO

VERSION = '4.4.7'
BASE = '4.4.6'
HTML_PAGES = '''angelbegleiter.html angelschule.html angelstudio.html angelwerkzeuge.html datenschutz.html erweiterungen.html gewaesser.html gezeiten.html index.html installieren.html karte.html karten-detail.html kinderwelt.html lernspiele.html montagen.html offline-check.html petri370.html petri400.html petri410.html petri411-bilderpruefung.html petri420-quality.html petri420.html petri430-angeltag.html petri430-arten.html petri430-ausruestung.html petri430-beissindex.html petri430-fangbuch.html petri430-qualitaet.html petri430.html petri440.html praxis.html premium.html sicherung410.html system410.html update-rettung.html werkzeuge.html zentrale.html'''.split()


def once(src: str, a: str, b: str, path: str) -> str:
    hits = src.count(a)
    if hits != 1:
        raise ValueError(f'{path}: expecting exactly one source anchor, found {hits}: {a[:70]}')
    return src.replace(a, b, 1)


def edit_map_map(src: str) -> str:
    a, b = src.find('function tileHealth(force=false){'), src.find('function watchTiles(key){')
    if a < 0 or b <= a:
        raise ValueError('petri442-map.js: cannot locate tile-health function')
    health = '''function tileHealth(force=false){
 if(mode==='offline'||!visible())return;
 const tiles=[...tileNodes.values()];
 const ready=tiles.filter(i=>i.complete),loaded=ready.filter(i=>i.naturalWidth>0),failed=ready.filter(i=>i.naturalWidth===0);
 const lowres=loaded.some(i=>Number(i.dataset.parentLevel||0)>0);
 if(loaded.length){
   if(ready.length===tiles.length||force){if(p443Timer!==null)clearTimeout(p443Timer);p443Timer=null;}
   if(failed.length)tileBanner('Einzelne Kartenkacheln fehlen. Anderen Ausschnitt oder Kartenstil ausprobieren.',true);
   else if(lowres)tileBanner('Das Kartenbild stammt teilweise aus einer niedrigeren Zoomstufe und kann unscharf sein.',false);
   else if(ready.length===tiles.length)tileBanner('',false);
   return;
 }
 if(tiles.length&&(force||failed.length===tiles.length))fallbackTiles();
}
'''
    src = src[:a]+health+src[b:]
    a, b = src.find('function updateTile(key,url,left,top,opacity=1){'), src.find('function renderTiles(){')
    if a < 0 or b <= a:
        raise ValueError('petri442-map.js: cannot locate tile-update function')
    tile = '''function updateTile(key,url,left,top,opacity=1){
 const parts=key.split('/'),z=Number(parts[1]),x=Number(parts[2]),y=Number(parts[3]),kind=parts[0]==='osm'?'standard':'satellite';
 let node=tileNodes.get(key);
 if(!node){
   node=new Image();node.alt='';node.draggable=false;node.decoding='async';node.loading='eager';
   node.referrerPolicy='strict-origin-when-cross-origin';node.className='p442-tile';node.style.opacity=String(opacity);
   node.addEventListener('load',()=>{if(node.isConnected)tileHealth(false)});
   node.addEventListener('error',()=>{
     if(!node.isConnected)return;
     const level=Number(node.dataset.parentLevel||0)+1;
     if(level<=2&&z-level>=4){
       node.dataset.parentLevel=String(level);
       const factor=2**level,sx=x%factor,sy=y%factor;
       node.style.setProperty('width',(factor*R)+'px','important');
       node.style.setProperty('height',(factor*R)+'px','important');
       node.style.clipPath=`inset(${sy*R}px ${(factor-sx-1)*R}px ${(factor-sy-1)*R}px ${sx*R}px)`;
       const m=node.dataset.offset?.split(',').map(Number)||[0,0];
       node.style.transform=`translate3d(${Math.round(m[0]-sx*R)}px,${Math.round(m[1]-sy*R)}px,0)`;
       node.src=tileUrls[kind](z-level,Math.floor(x/factor),Math.floor(y/factor));
       return;
     }
     node.dataset.failed='yes';failures++;node.removeAttribute('src');tileHealth(false);
     if(failures>=3)notice('Kartenbilder konnten beim Anbieter nicht geladen werden. Offline-Karte oder anderen Stil wählen.',true);
   });
   tilesEl.append(node);tileNodes.set(key,node);node.src=url;
 }
 node.dataset.offset=left+','+top;
 const factor=2**Number(node.dataset.parentLevel||0),sx=x%factor,sy=y%factor;
 node.style.transform=`translate3d(${Math.round(left-sx*R)}px,${Math.round(top-sy*R)}px,0)`;
 return node;
}
'''
    src = src[:a]+tile+src[b:]
    return src.replace('/* Petri Heil Pro 4.4.4','/* Petri Heil Pro 4.4.7',1)


def patch(d: dict[str, bytes]) -> tuple[dict[str, bytes], list[str]]:
    out = d.copy()
    changed: list[str] = []
    def read(path: str) -> str:
        if path not in out:
            raise ValueError(f'Missing required 4.4.6 source file: {path}')
        return out[path].decode('utf-8-sig')
    def write(path: str, s: str) -> None:
        out[path] = s.encode('utf-8')
        if path not in changed: changed.append(path)
    ver = json.loads(read('version.json'))
    if ver.get('version') != BASE:
        raise ValueError(f"Required source version {BASE}, found {ver.get('version')}. Refusing to overwrite an unverified repository.")
    for path in HTML_PAGES:
        html = read(path)
        if path in ('index.html','petri440.html'):
            html = html.replace(BASE, VERSION)
            if f'name="petri-app-version" content="{VERSION}"' not in html:
                raise ValueError(f'{path}: app version marker missing')
        else:
            if 'petri445-nav.js' in html: raise ValueError(f'{path}: unexpected existing back navigation')
            html = once(html, '</head>', '<script defer src="./petri445-nav.js?v=4.4.7"></script></head>', path)
        if html.count('petri445-nav.js') != 1:
            raise ValueError(f'{path}: expected one back navigation reference')
        write(path, html)

    nav = read('petri445-nav.js').replace(BASE,VERSION)
    old = "function goBack(){if(validReferrer()&&history.length>1){history.back();return}location.assign(localUrl(fallback()))}"
    new = "function goBack(){if(pageName()==='petri440.html'&&location.hash&&location.hash!=='#start'){location.hash='#start';return}if(validReferrer()&&history.length>1){history.back();return}location.assign(localUrl(fallback()))}"
    write('petri445-nav.js', once(nav, old, new, 'petri445-nav.js'))

    css = read('petri442-map.css')
    css = once(css,'.p442-tile{display:block;position:absolute;', '.p442-tile{display:block;position:absolute;left:0;top:0;', 'petri442-map.css')
    css += '\n/* 4.4.7: child tiles use a geospatially aligned lower-zoom substitute when needed. */\n'
    write('petri442-map.css', css)
    write('petri442-map.js', edit_map_map(read('petri442-map.js')))

    app = read('petri440-app.js')
    old = re.search(r'function offlineCheck\(\)\{[^\n]*\}', app)
    if not old: raise ValueError('petri440-app.js: offlineCheck not found')
    new = "function offlineCheck(){if(!('caches'in window))throw Error('Cache Storage nicht verfügbar');$('offlineText').textContent='Offline-Dateien werden geprüft …';const r=await fetch('./petri-core-v4.4.7.json',{cache:'no-store'});if(!r.ok)throw Error('Versionsmanifest HTTP '+r.status);const m=await r.json();if(m.version!=='4.4.7'||!Array.isArray(m.files))throw Error('Versionsmanifest nicht verfügbar');let ok=0;for(const path of m.files){const url=new URL(path,location.href).href;if(await caches.match(url,{ignoreSearch:true}))ok++}$('offlineText').textContent=`Kern: ${ok}/${m.files.length} gecacht. Dies prüft Dateien, keinen echten Flugmodus. Bilder und eigene Daten getrennt sichern.`}"
    write('petri440-app.js', app.replace(old.group(0),new,1))

    core = json.loads(read('petri-core-v4.4.6.json'))
    if core.get('version')!=BASE: raise ValueError('Source core manifest version does not match')
    core['version']=VERSION;core['base']=BASE;core['cache']='petri-core-4.4.7'
    core['files']=[name.replace(BASE,VERSION) for name in core['files']]
    if len(core['files'])<120 or len(core['files'])!=len(set(core['files'])):
        raise ValueError('Incomplete or duplicate offline core assets')
    core['notes']='All regular app pages have in-flow back navigation; map zoom retry, offline check and cache updated; no data migration.'
    write('petri-core-v4.4.7.json',json.dumps(core,ensure_ascii=False,indent=2)+'\n')
    write('petri-offline-v4.4.7.js',read('petri-offline-v4.4.6.js').replace(BASE,VERSION))
    write('sw.js',read('sw.js').replace(BASE,VERSION))

    worker = read('petri-sw.js').replace(BASE,VERSION)
    m = re.search(r'const CHANGED=new Set\((\[[^\n]*\])\);',worker)
    if not m: raise ValueError('petri-sw.js: offline changed-file set missing')
    original = json.loads(m.group(1))
    force = list(dict.fromkeys(original+HTML_PAGES+list(changed)+['version.json','petri-sw.js','sw.js','petri-core-v4.4.7.json','petri-offline-v4.4.7.js']))
    worker = worker.replace(m.group(0),'const CHANGED=new Set('+json.dumps(force,ensure_ascii=False,separators=(',',':'))+');',1)
    write('petri-sw.js',worker)

    ver = {'version':VERSION,'releaseDate':'2026-10-12','name':'Petri Heil Pro','serviceWorker':'sw.js',
      'changes':['Zurück-Schaltfläche auf 37 App-Seiten im normalen Dokumentfluss.',
      'Gewässerkarten: bei fehlerhaften Bildkacheln maßstabsgetreue Ersatzdarstellung aus bis zu zwei niedrigeren Zoomstufen.',
      'Offline-Prüfung im Angelcockpit auf 4.4.7 korrigiert.',
      'PWA-Offline-Cache und neue Versionsdateien aktualisiert; vorhandene Nutzerdaten werden nicht migriert oder gelöscht.'],
      'limitations':['Satelliten-/Straßenkarten erfordern Internet und Zustimmung; die Anbieter können einzelne Zoomstufen sperren.',
      'Keine amtlichen Tiefendaten: nur eigene Mess-/Schätzpunkte.',
      'Kein vollständiger iPhone-Browsertest; vor Installation ein persönliches Backup erstellen.']}
    write('version.json',json.dumps(ver,ensure_ascii=False,indent=2)+'\n')
    write('petri447-release.json',json.dumps({'version':VERSION,'baseVersion':BASE,'date':'2026-10-12','scope':'map-zoom, navigation, offline-check','dataMigration':False,'backNavigationPages':len(HTML_PAGES),'offlineAssets':len(core['files'])},ensure_ascii=False,indent=2)+'\n')
    write('PRUEFBERICHT-4.4.7.txt',f'''PETRI HEIL PRO {VERSION} – TECHNISCHER PRÜFBERICHT
Basis: GitHub main {BASE}, Quelle 01531b10261a651ef2712fc7138ad66a009b667f.

Geänderte App-Unterseiten: {len(HTML_PAGES)}. Alle haben genau einen Zurück-Script-Verweis.
Offline-Core-Einträge: {len(core['files'])}; keine doppelten Dateinamen.
Neue SW-/Version-/Offline-Manifest-Bezeichner stimmen überein.
Keine Migration, keine Löschung persönlicher Daten oder vorhandener Medien.

Nicht geprüft: echte iPhone-Laufzeit, Provider-Bildverfügbarkeit, reale Netzwerk-/GPS-Bedingungen,
Funktion jedes Altmoduls. Unscharfe Kartenbilder bei Anbieterbeschränkungen möglich.
''')
    return out, changed


def load_source(path: Path) -> dict[str,bytes]:
    if path.is_dir():
        return {p.relative_to(path).as_posix():p.read_bytes() for p in path.rglob('*') if p.is_file() and '.git' not in p.parts}
    if not zipfile.is_zipfile(path): raise ValueError('Please select a GitHub repository ZIP, not a patch ZIP')
    with zipfile.ZipFile(path,'r') as z:
        files=[x for x in z.infolist() if not x.is_dir()]
        if len(files)>5000 or sum(x.file_size for x in files)>700_000_000:raise ValueError('Source archive is unexpectedly large')
        names=[x.filename for x in files]
        prefixes={n.partition('/')[0] for n in names if '/' in n}
        prefix=next(iter(prefixes))+'/' if len(prefixes)==1 and all(n.startswith(next(iter(prefixes))+'/') for n in names) else ''
        d={}
        for item in files:
            name=item.filename[len(prefix):]
            if not name or name.startswith('/') or '..' in Path(name).parts:raise ValueError('Unsafe ZIP entry')
            if name in d:raise ValueError('Duplicate ZIP entry '+name)
            d[name]=z.read(item)
        return d


def main():
    parser=argparse.ArgumentParser(description='Build Petri Heil Pro 4.4.7 from a local copy of 4.4.6')
    parser.add_argument('source',type=Path,help='Original PetriHeil repo ZIP or checkout folder')
    parser.add_argument('-o','--output',type=Path,default=Path.cwd()/'PetriHeilPro_4.4.7_Vollversion.zip')
    args=parser.parse_args()
    try:
        original=load_source(args.source)
        updated,changed=patch(original)
        with zipfile.ZipFile(args.output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
            for name,data in updated.items():z.writestr(name,data)
        print(f'OK {VERSION}: {len(changed)} source files modified/added, {len(updated)} total files preserved')
        print('Output:',args.output.resolve())
    except (OSError,ValueError,json.JSONDecodeError,zipfile.BadZipFile) as e:
        print('Update aborted without modifying source:',str(e),file=sys.stderr)
        return 2
    return 0

if __name__=='__main__':sys.exit(main())
