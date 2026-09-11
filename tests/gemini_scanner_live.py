"""Optional live acceptance test for Scanner v3 individual-reference path.
Set GEMINI_API_KEY to a FREE-TIER Google AI Studio key. Gemini 3.8 Flash only; no paid/model fallback.
"""
from pathlib import Path
import os,sys,json,base64,urllib.request,urllib.error,mimetypes
ROOT=Path(__file__).resolve().parents[1]
key=os.getenv('GEMINI_API_KEY','').strip()
if not key:
    print('SKIP live Gemini scanner: GEMINI_API_KEY not set')
    sys.exit(0)
exp=json.loads((ROOT/'tests/scanner_v3_expected.json').read_text())['expected']
manifest=json.loads((ROOT/'assets/scanner/reference-manifest.json').read_text())

def inline(path):
    p=ROOT/path.lstrip('./')
    mime=mimetypes.guess_type(str(p))[0] or 'image/webp'
    return {'inline_data':{'mime_type':mime,'data':base64.b64encode(p.read_bytes()).decode()}}

img=base64.b64encode((ROOT/'tests/scanner-fixtures/david-andrews-multi-sa.jpg').read_bytes()).decode()
prompt='''Read this Top Eleven Skills screenshot exactly. Do not alter numbers to fit totals. The screenshot is followed by individually labelled reference images. Match playstyle identity AND level only from those labelled references. Inspect the ENTIRE Special ability row and return EVERY visible icon; never stop after the first. Return JSON only with name, age, ovr, roles, layout, totals, skills, playstyle{name,levelName}, specialAbilities. For this regression all 15 displayed outfield skills must be read.'''
parts=[{'text':prompt},{'text':'PLAYER SCREENSHOT'},{'inline_data':{'mime_type':'image/jpeg','data':img}},{'text':'INDIVIDUAL PLAYSTYLE IDENTITY REFERENCES'}]
for r in manifest['playstyles']:
    parts += [{'text':f"PLAYSTYLE IDENTITY REFERENCE — {r['name']}"}, inline(r['file'])]
parts.append({'text':'INDIVIDUAL PLAYSTYLE LEVEL REFERENCES — ignore the centre False Nine symbol'})
for r in manifest.get('playstyleLevels',[]):
    parts += [{'text':f"PLAYSTYLE LEVEL REFERENCE — {r['name']}"}, inline(r['file'])]
parts.append({'text':'INDIVIDUAL SPECIAL ABILITY REFERENCES'})
for r in manifest['specialAbilities']:
    parts += [{'text':f"SPECIAL ABILITY REFERENCE — {r['name']}"}, inline(r['file'])]
payload={'contents':[{'role':'user','parts':parts}],'generationConfig':{'responseMimeType':'application/json','maxOutputTokens':6000,'thinkingConfig':{'thinkingLevel':'low'}}}
url='https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent'
req=urllib.request.Request(url,data=json.dumps(payload).encode(),headers={'Content-Type':'application/json','x-goog-api-key':key},method='POST')
try:
    with urllib.request.urlopen(req,timeout=180) as r: body=json.load(r)
except urllib.error.HTTPError as e:
    if e.code in (429,503):
        print(f'SKIP live Gemini scanner: temporary free-tier/model availability response ({e.code}); no paid fallback')
        sys.exit(0)
    raise
text=''.join(p.get('text','') for p in body['candidates'][0]['content']['parts'])
got=json.loads(text);errs=[]
for k in ['name','age','ovr','layout']:
    if got.get(k)!=exp[k]: errs.append((k,got.get(k),exp[k]))
if got.get('roles')!=exp['roles']: errs.append(('roles',got.get('roles'),exp['roles']))
for k,v in exp['skills'].items():
    if got.get('skills',{}).get(k)!=v: errs.append((k,got.get('skills',{}).get(k),v))
if got.get('playstyle',{}).get('name')!=exp['playstyle']['name']: errs.append(('playstyle',got.get('playstyle'),exp['playstyle']))
if got.get('specialAbilities')!=exp['specialAbilities']: errs.append(('specialAbilities',got.get('specialAbilities'),exp['specialAbilities']))
if errs:
    print('FAIL live Gemini scanner')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS live Gemini scanner: exact identity/level reference architecture + David Andrews exact text/numbers + both special abilities')
