from pathlib import Path
from math import sin,cos,pi
OUT=Path(__file__).resolve().parents[1]/'frontend/public/art'
OUT.mkdir(parents=True,exist_ok=True)
H='''<defs>
 <linearGradient id="metal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fdfefa"/><stop offset=".48" stop-color="#a7b8ab"/><stop offset="1" stop-color="#476e55"/></linearGradient>
 <linearGradient id="dark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#466a4e"/><stop offset=".47" stop-color="#254b32"/><stop offset="1" stop-color="#112b20"/></linearGradient>
 <linearGradient id="charcoal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#4d5452"/><stop offset="1" stop-color="#181e1b"/></linearGradient>
 <linearGradient id="clay" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5b696"/><stop offset="1" stop-color="#8b6a50"/></linearGradient>
 <linearGradient id="sand" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#faf4e5"/><stop offset="1" stop-color="#d4d3bd"/></linearGradient>
 <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dcf0df" stop-opacity=".9"/><stop offset="1" stop-color="#81aa95" stop-opacity=".75"/></linearGradient>
 <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eeffba" stop-opacity=".6"/><stop offset="1" stop-color="#f2ffce" stop-opacity="0"/></linearGradient>
 <filter id="shadow" x="-50%" y="-50%" width="200%" height="250%"><feGaussianBlur stdDeviation="16"/></filter>
 <filter id="tinyshadow" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#1c3024" flood-opacity=".26"/></filter>
 </defs>'''
def svg(content,view='0 0 650 590',canvas=None):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="650" height="590" viewBox="{view}" role="img">{H}<ellipse cx="325" cy="524" rx="220" ry="29" fill="#344635" opacity=".18" filter="url(#shadow)"/>{content}</svg>'
def stem_leaf(x,y,s=1,rot=0,shade='#477d46'):
 return f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><path d="M0 0 Q-28 -70 -6 -124" fill="none" stroke="#2a623d" stroke-width="7" stroke-linecap="round"/><path d="M-8 -117 C-89 -172 -94 -101 -13 -82 Z" fill="{shade}"/><path d="M-8 -114 C57 -196 75 -109 -8 -88 Z" fill="#77ae59"/><path d="M-13 -83 C-110 -115 -98 -28 -8 -55 Z" fill="#497e48"/><path d="M-6 -79 C80 -126 104 -36 -7 -50 Z" fill="#6caa52"/><path d="M-4 -124 C-49 -230 60 -219 -4 -124 Z" fill="#84b95d"/><path d="M-5 -124 L-5 -207" stroke="#b4d38e" stroke-width="2" opacity=".52"/></g>'
def pot(x=275,y=368,w=110,h=143,leaf=True,scale=1):
 content=f'<g transform="translate({x} {y}) scale({scale})" filter="url(#tinyshadow)">'
 if leaf:
  content+=stem_leaf(w*.5,12,.69,3)
 content+=f'<path d="M0 14 L{w} 14 L{w-9} {h} Q{w//2} {h+16} 9 {h} Z" fill="url(#charcoal)"/><ellipse cx="{w/2}" cy="15" rx="{w/2}" ry="14" fill="#263027" stroke="#788575" stroke-width="6"/><ellipse cx="{w/2}" cy="17" rx="{w*.37}" ry="8" fill="#544638"/><path d="M12 30 L18 {h-9} M{w-14} 30 L{w-19} {h-8}" stroke="#d6e0cc" stroke-width="2" opacity=".13"/></g>'
 return content
def panel(x=126,y=106,scale=1):
 dots=''.join(f'<circle cx="{u}" cy="{v}" r="5" fill="{col}" opacity=".95"/>' for j,v in enumerate(range(91,260,21)) for i,u in enumerate(range(90,350,23)) for col in ['#eef4cf' if (i+j)%5 else '#edc9b1'])
 return f'<g transform="translate({x} {y}) scale({scale})" filter="url(#tinyshadow)"><path d="M104 13 L115 -35 M345 13 L333 -35" stroke="#536d59" stroke-width="5" fill="none"/><rect x="40" y="35" width="363" height="242" rx="16" fill="#667a69"/><rect x="53" y="47" width="337" height="217" rx="11" fill="#f9faef" stroke="#b9c5b2" stroke-width="5"/>{dots}<path d="M56 74 H385" stroke="#dfe7d5" stroke-width="4" opacity=".5"/></g>'
def tent(x=168,y=58,w=335,h=450,scale=1):
 return f'<g transform="translate({x} {y}) scale({scale})" filter="url(#tinyshadow)"><path d="M0 50 L{int(w*.89)} 0 L{w} 48 L{w} {h} L0 {h} Z" fill="url(#charcoal)" stroke="#697c6a" stroke-width="6"/><path d="M22 62 L{int(w*.84)} 22 L{int(w*.84)} {h-22} L22 {h-22} Z" fill="#9dbaa1" stroke="#bacfc2" stroke-width="4"/><path d="M35 80 L{int(w*.81)} 42 L{int(w*.81)} {h-42} L35 {h-42} Z" fill="#dce7d8"/><path d="M{int(w*.83)} 25 L{w-9} 53 L{w-9} {h-15} L{int(w*.83)} {h-25} Z" fill="#293b34"/><path d="M{int(w*.83)} 25 L{int(w*.83)} {h-25}" stroke="#879b8e" stroke-width="3"/><path d="M22 62 L{int(w*.84)} 22 M22 {h-22} L{int(w*.84)} {h-22}" stroke="#829989" stroke-width="5"/><path d="M43 98 L{int(w*.73)} 64 L{int(w*.73)} {h-64} L43 {h-58} Z" fill="#ecf0e5" opacity=".6"/></g>'
def grow_tent_full():
 a=tent(148,65,365,445)
 a+='<path d="M230 173 L440 173 L451 235 L219 235 Z" fill="#e3efc8" opacity=".45"/>'
 a+='<g transform="translate(225 150) scale(.58)">'+panel(0,0,.73)+'</g>'
 a+=pot(216,330,94,157,True,.8)+pot(333,327,106,161,True,.87)
 return a
def bag(x=168,y=140,w=300,h=355,title='SOIL',tone='sand'):
 return f'<g filter="url(#tinyshadow)"><path d="M{x+20} {y} Q{x+w/2} {y+17} {x+w-20} {y} L{x+w} {y+45} L{x+w-10} {y+h} Q{x+w/2} {y+h+28} {x+9} {y+h} L{x} {y+42} Z" fill="url(#{tone})" stroke="#aaad97" stroke-width="3"/><path d="M{x+15} {y+83} H{x+w-15} V{y+238} H{x+15} Z" fill="#325b3c"/><text x="{x+w/2}" y="{y+129}" font-family="Arial" font-size="14" letter-spacing="4" fill="#d4e8bf" text-anchor="middle">GROWLAB</text><text x="{x+w/2}" y="{y+181}" font-family="Arial" font-size="43" font-weight="900" fill="white" text-anchor="middle">{title}</text><path d="M{x+36} {y+275} H{x+w-36}" stroke="#496a50" stroke-width="4"/><text x="{x+w/2}" y="{y+314}" font-family="Arial" font-size="16" fill="#406d48" text-anchor="middle">BOTANICAL SUPPLY</text></g>'
def bottle(x=243,y=125,w=170,h=347):
 return f'<g filter="url(#tinyshadow)"><rect x="{x+w*.35}" y="{y}" width="{w*.3}" height="55" rx="8" fill="#292c29"/><rect x="{x+w*.29}" y="{y+42}" width="{w*.42}" height="25" rx="5" fill="#87927b"/><path d="M{x+25} {y+73} Q{x+25} {y+59} {x+57} {y+62} L{x+w-57} {y+62} Q{x+w-25} {y+59} {x+w-25} {y+73} L{x+w-11} {y+111} L{x+w-11} {y+h-18} Q{x+w-11} {y+h} {x+w-35} {y+h} H{x+35} Q{x+11} {y+h} {x+11} {y+h-18} V{y+111} Z" fill="url(#charcoal)"/><rect x="{x+17}" y="{y+139}" width="{w-34}" height="155" rx="4" fill="#ebefdb"/><rect x="{x+17}" y="{y+139}" width="{w-34}" height="48" rx="4" fill="#2f6541"/><text x="{x+w/2}" y="{y+169}" font-size="14" font-weight="700" font-family="Arial" text-anchor="middle" fill="white">GROWLAB</text><path d="M{x+w/2} {y+209} C{x+w/2-70} {y+222} {x+w/2-13} {y+269} {x+w/2} {y+248} C{x+w/2+56} {y+267} {x+w/2+57} {y+214} {x+w/2} {y+209} Z" fill="#7caa73"/><text x="{x+w/2}" y="{y+279}" font-size="12" font-family="Arial" text-anchor="middle" fill="#406146">NUTRIENTS</text></g>'
def meter(x=228,y=106):
 return f'<g filter="url(#tinyshadow)"><rect x="{x}" y="{y}" width="189" height="367" rx="32" fill="url(#charcoal)" stroke="#708378" stroke-width="6"/><rect x="{x+22}" y="{y+45}" width="144" height="118" rx="8" fill="#d7eacc"/><text x="{x+95}" y="{y+128}" font-family="Arial" font-size="62" font-weight="700" text-anchor="middle" fill="#264436">6.5</text><text x="{x+34}" y="{y+72}" font-family="Arial" font-size="13" fill="#4c7b52">pH</text><circle cx="{x+95}" cy="{y+237}" r="33" fill="#a5d378" stroke="#598b60" stroke-width="8"/><path d="M{x+45} {y+304} H{x+142}" stroke="#889589" stroke-width="6" stroke-linecap="round"/><path d="M{x+58} {y+329} H{x+130}" stroke="#889589" stroke-width="4" stroke-linecap="round"/></g>'
def fan(x=178,y=134):
 blades=''.join(f'<path d="M0 -17 Q20 -128 73 -105 Q99 -56 13 -2 Z" fill="url(#charcoal)" transform="rotate({a})" />' for a in range(0,360,90))
 return f'<g filter="url(#tinyshadow)"><rect x="{x+105}" y="{y+210}" width="155" height="40" rx="9" fill="#45584c"/><circle cx="{x+185}" cy="{y+125}" r="152" fill="#2f3c32" stroke="#6c8170" stroke-width="15"/><circle cx="{x+185}" cy="{y+125}" r="129" fill="#98ad9a"/><g transform="translate({x+185} {y+125})">{blades}<circle r="31" fill="#4e7255"/><circle r="14" fill="#b0cb9b"/></g><circle cx="{x+185}" cy="{y+125}" r="137" fill="none" stroke="#3c5c42" stroke-width="8"/>{''.join(f'<path d="M{x+185} {y+125} L{x+185+137*cos(i*pi/8):.1f} {y+125+137*sin(i*pi/8):.1f}" stroke="#34503d" stroke-width="5"/>' for i in range(16))}</g>'
def tool():
 return '<g filter="url(#tinyshadow)" transform="rotate(-26 280 280)"><rect x="245" y="205" width="55" height="263" rx="24" fill="url(#metal)"/><path d="M231 125 L230 45 L255 45 L266 119 L275 144 L285 119 L297 45 L325 45 L324 128 Q310 197 283 217 Q240 203 231 125 Z" fill="url(#charcoal)" stroke="#737e71" stroke-width="5"/><circle cx="273" cy="412" r="12" fill="#364d3d"/></g><g transform="translate(95 60) rotate(28 300 300)" opacity=".8"><rect x="345" y="242" width="34" height="210" rx="13" fill="url(#clay)"/><path d="M320 221 L352 94 L379 101 L383 222 Z" fill="url(#metal)"/></g>'
arts={
 'kit':grow_tent_full()+panel(365,135,.38),
 'outdoor':pot(160,320,160,170,True,1.0)+pot(338,349,120,155,True,.76)+'<path d="M151 507 Q335 466 481 514" fill="none" stroke="#8eac76" stroke-width="11" opacity=".25"/>',
 'hydro':'<rect x="150" y="337" width="349" height="162" rx="24" fill="url(#dark)" filter="url(#tinyshadow)"/><rect x="164" y="321" width="321" height="35" rx="17" fill="#819d78"/>'+''.join(stem_leaf(215+i*74,335,.56,(-1)**i*9) for i in range(4))+'<path d="M170 425 H482" stroke="#a6d9d7" stroke-width="12" opacity=".36"/>',
 'light':panel(88,118,1.03),
 'uv':panel(94,126,1.0)+'<circle cx="525" cy="156" r="32" fill="#c2acef" opacity=".55"/><path d="M522 155 l-7 -29 l27 23 l-30 13" fill="#996fcb" opacity=".5"/>',
 'tent':grow_tent_full(),
 'fan':fan(),
 'pot':pot(205,220,240,284,True,1.0),
 'pots':pot(111,290,174,204,True,.78)+pot(286,279,191,225,True,.86),
 'tray':'<g filter="url(#tinyshadow)"><path d="M95 345 L474 270 L546 399 L153 496 Z" fill="url(#charcoal)"/><path d="M113 343 L471 285 L523 394 L164 470 Z" fill="#687b65"/>'+''.join(f'<ellipse cx="{190+c*72+r*17}" cy="{346+r*38-c*9}" rx="24" ry="14" fill="#26362a" stroke="#9dab91" stroke-width="6"/>' for r in range(3) for c in range(4))+'</g>'+''.join(stem_leaf(207+i*76,334-i*5,.28,0) for i in range(4)),
 'soil':bag(),
 'bottle':bottle(),
 'water':'<g filter="url(#tinyshadow)"><rect x="164" y="340" width="330" height="146" rx="23" fill="url(#dark)"/><path d="M180 353 L498 287" fill="none" stroke="#516953" stroke-width="25"/><path d="M479 281 L515 253" stroke="#333e36" stroke-width="15"/><path d="M518 256 L575 248" fill="none" stroke="#66979a" stroke-width="6"/><rect x="191" y="393" width="275" height="18" rx="8" fill="#8dbf9b" opacity=".7"/></g>'+''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#80aab0" opacity=".7"/>' for x,y,r in [(568,263,5),(589,285,8),(551,298,5)]),
 'timer':'<g filter="url(#tinyshadow)"><rect x="174" y="146" width="315" height="352" rx="34" fill="#e6e7df" stroke="#6c8472" stroke-width="10"/><rect x="212" y="194" width="237" height="131" rx="11" fill="#c7dcc0"/><text x="332" y="288" font-size="78" font-family="Arial" font-weight="700" fill="#3d6247" text-anchor="middle">12:00</text><rect x="270" y="357" width="117" height="30" rx="8" fill="#436b4e"/><circle cx="254" cy="427" r="15" fill="#93bd7c"/><circle cx="328" cy="427" r="15" fill="#93bd7c"/><circle cx="404" cy="427" r="15" fill="#93bd7c"/></g>',
 'meter':meter(),
 'tools':tool(),
 'seedling':'<g opacity=".75">'+pot(225,307,182,200,True,.85)+'</g><path d="M130 120 L517 120 L517 489 L130 489 Z" stroke="#c69d58" stroke-width="15" stroke-dasharray="22 13" fill="none" opacity=".72"/><circle cx="487" cy="169" r="38" fill="#f3deb6"/><text x="487" y="182" font-family="Arial" font-size="37" fill="#b58946" font-weight="700" text-anchor="middle">!</text>',
}
for name,body in arts.items():
 (OUT/(name+'.svg')).write_text(svg(body),encoding='utf-8')
# Logo-like editorial hero: sophisticated botanical terrarium with clean geometric forms.
hero=f'''<svg xmlns="http://www.w3.org/2000/svg" width="760" height="680" viewBox="0 0 760 680">{H}
<ellipse cx="382" cy="582" rx="285" ry="47" fill="#001a13" opacity=".26" filter="url(#shadow)"/>
<circle cx="392" cy="288" r="270" fill="#c2e9ad" opacity=".055"/>
<circle cx="392" cy="288" r="190" fill="#c2e9ad" opacity=".058"/>
<path d="M135 463 Q198 383 281 455" stroke="#bde89b" stroke-width="7" opacity=".35" fill="none"/>
<g transform="translate(35 0)">{tent(155,110,390,470,.93)}</g>
<path d="M259 261 L568 230 L568 476 L260 478 Z" fill="#a7d9ac" opacity=".24"/>
<g transform="translate(220 130) scale(.58)">{panel(75,96,.93)}</g>
<g transform="translate(47 42)">{pot(282,339,177,181,True,.86)}</g>
<g transform="translate(-72 82)">{pot(260,320,137,151,True,.76)}</g>
<g transform="translate(145 82)">{pot(260,317,124,150,True,.7)}</g>
<g transform="translate(80 180)">{meter(237,128)}</g>
<circle cx="594" cy="154" r="6" fill="#c3f0a2"/><circle cx="624" cy="201" r="4" fill="#c3f0a2" opacity=".65"/>
</svg>'''
(OUT/'hero.svg').write_text(hero,encoding='utf-8')
print('generated',len(list(OUT.glob('*.svg'))),'SVG product assets in',OUT)
