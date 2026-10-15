from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import subprocess, html
ROOT=Path(__file__).resolve().parents[1]
FONT=TTFont('/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf'); GS=FONT.getGlyphSet(); CM=FONT.getBestCmap()
PINK='#FF3EA5'; LIME='#C6FF3D'; WHITE='#F2F0EA'; BG='#0C0C0D'
def letters(s,x,y,h,color,width=None):
 scale=h/729; advance=sum(FONT['hmtx'][CM[ord(c)]][0] for c in s)*scale
 sx=scale*(width/advance if width else 1); out=[]
 for c in s:
  g=CM[ord(c)]; p=SVGPathPen(GS); tp=TransformPen(p,(sx,0,0,-scale,x,y+h)); GS[g].draw(tp)
  out.append(f'<path d="{p.getCommands()}" fill="{color}"/>'); x+=FONT['hmtx'][g][0]*sx
 return ''.join(out)
def wordmark(color=WHITE):
 # Open M notch and separate lime A stroke mirror the approved business-card concept.
 return f'<path fill="{color}" d="M0 100V0H25L60 44 95 0H120V100H93V43L60 83 27 43V100Z"/><path fill="{LIME}" d="M126 100 168 0H196L154 100Z"/><path fill="{color}" d="M186 35 213 100H184L172 69Z"/>'+letters('GNETIC',221,0,100,color,679)+letters('EVENTS',0,123,100,PINK,640)
def svg(w,h,body,label='Magnetic Events'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{label}"><title>{label}</title>{body}</svg>'
def write(path,data): (ROOT/path).write_text(data)
def render(path,out,width=None):
 args=['inkscape',str(ROOT/path),'--export-type=png','--export-filename='+str(ROOT/out)]
 if width: args+=['--export-width='+str(width)]
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
write('assets/logo.svg',svg(900,223,wordmark()))
write('branding/logo-light.svg',svg(900,223,wordmark(BG)))
icon=f'<rect width="128" height="128" rx="24" fill="{BG}"/><g transform="translate(15 26) scale(.8)"><path fill="{WHITE}" d="M0 100V0H25L60 44 95 0H120V100H93V43L60 83 27 43V100Z"/><path fill="{LIME}" d="M80 100 119 0H132L93 100Z"/></g>'
write('favicon.svg',svg(128,128,icon)); render('favicon.svg','favicon.png')
from PIL import Image
Image.open(ROOT/'favicon.png').save(ROOT/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
profile=f'<rect width="1080" height="1080" fill="{BG}"/><g transform="translate(110 410) scale(.955)">{wordmark()}</g>'
write('branding/instagram-profile.svg',svg(1080,1080,profile));render('branding/instagram-profile.svg','branding/instagram-profile.png')
def text(x,y,s,size=32,color=WHITE):
 return f'<text x="{x}" y="{y}" font-family="DejaVu Sans" font-size="{size}" fill="{color}">{html.escape(s)}</text>'
def graphic(title,lines,n,total,accent=PINK):
 b=f'<rect width="1080" height="1350" fill="{BG}"/><g transform="translate(72 68) scale(.68)">{wordmark()}</g>'
 b+=text(72,300,'TECHNICKÉ ZAJIŠTĚNÍ AKCÍ / MORAVA',22)
 b+='<path d="M72 330H1008" stroke="#2A2A2F"/>'
 y=455
 for t in title:
  b+=letters(t,72,y-77,77,accent if t==title[-1] else WHITE,min(930,len(t)*53));y+=100
 b+=f'<rect x="72" y="{max(y+25,720)}" width="936" height="300" rx="24" fill="{accent}"/>'
 yy=max(y+25,720)+72
 for line in lines:b+=text(105,yy,line,31,BG);yy+=49
 b+=text(72,1190,'POŠLETE NÁM ZADÁNÍ',23,accent)+text(72,1260,'magneticevents.cz',25)
 b+=text(960,1260,f'{n}/{total}',20)
 return svg(1080,1350,b)
posts=[('01-uvod',[(['VAŠE AKCE.','NAŠE TECHNIKA.'],['Stany, pódia a vybavení','pro obce i firmy.'])]),('02-stany',[(['PROSTOR','PRO VAŠI AKCI.'],['Párty stany • pagody • nůžkové stany','Podlahy, stoly, židle a osvětlení.'])]),('03-vybaveni',[(['TECHNICKÉ','ZÁZEMÍ AKCE.'],['Prolistujte přehled vybavení.','Vybereme řešení podle zadání.']),(['PÓDIA','A ZASTŘEŠENÍ.'],['Zázemí pro program vaší akce.','Rozsah doladíme podle místa.']),(['STOLY, ŽIDLE,','PIVNÍ SETY.'],['Místo pro setkání i odpočinek.','Doplníme podlahu a osvětlení.']),(['OPLOCENÍ','A TOALETY.'],['Praktické vybavení areálu.','Podle počtu hostů a využití.']),(['ELEKTRO.','TECHNIKA.'],['Elektro a technická produkce.','Napište, co potřebujete doplnit.'])]),('04-sezona',[(['PLÁNUJETE','SEZONU 2027?'],['Den obce, slavnosti, firemní setkání.','Pošlete termín, místo a vybavení.'])]),('05-postup',[(['OD ZADÁNÍ','K REALIZACI.'],['1. Pošlete termín, místo a vybavení.','2. Připravíme a doladíme nabídku.','3. Partner zajistí realizaci.'])]),('06-checklist',[(['CO POSLAT','DO POPTÁVKY?'],['Pět údajů pro konkrétní nabídku.','Prolistujte a uložte si checklist.']),(['01 / TERMÍN','VAŠÍ AKCE.'],['Datum a čas akce.','Připojte čas na přípravy.']),(['02 / MÍSTO','A POVRCH.'],['Adresa nebo poloha areálu.','Tráva, asfalt nebo dlažba?']),(['03 / POČET','NÁVŠTĚVNÍKŮ.'],['Kolik lidí očekáváte?','Jak budete prostor využívat?']),(['04 / SEZNAM','VYBAVENÍ.'],['Stany, pódia, nábytek a další.','Napište i to, co už máte.']),(['05 / MONTÁŽ','A DEMONTÁŽ.'],['Kdy je možný příjezd a odjezd?','Přidejte fotku místa nebo plánek.'])])]
for name,slides in posts:
 for i,(title,lines) in enumerate(slides,1):
  path=f'assets/instagram/{name}-{i:02}.svg';write(path,graphic(title,lines,i,len(slides),PINK if i%2 else LIME));render(path,path[:-4]+'.png')
og=f'<rect width="1200" height="630" fill="{BG}"/><g transform="translate(80 80) scale(1.1)">{wordmark()}</g>'+text(80,460,'TECHNICKÉ ZAJIŠTĚNÍ AKCÍ',39)+text(80,545,'STANY / PÓDIA / VYBAVENÍ',27,LIME)
write('branding/og.svg',svg(1200,630,og));render('branding/og.svg','assets/og.png')

