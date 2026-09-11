"""Optional live acceptance test for Scanner v3.
Set GEMINI_API_KEY to a FREE-TIER Google AI Studio key. No fallback is used.
"""
from pathlib import Path
import os,sys,json,base64,urllib.request,urllib.error
ROOT=Path(__file__).resolve().parents[1]
key=os.getenv('GEMINI_API_KEY','').strip()
if not key:
    print('SKIP live Gemini scanner: GEMINI_API_KEY not set')
    sys.exit(0)
exp=json.loads((ROOT/'tests/scanner_v3_expected.json').read_text())['expected']
img=base64.b64encode((ROOT/'tests/scanner-fixtures/david-andrews-multi-sa.jpg').read_bytes()).decode()
ps=base64.b64encode((ROOT/'assets/scanner/playstyles-reference.png').read_bytes()).decode()
sa=base64.b64encode((ROOT/'assets/scanner/special-abilities-reference.jpg').read_bytes()).decode()
prompt='''Read this Top Eleven Skills screenshot exactly. Do not alter numbers to fit totals. Match playstyle name+level against reference image 1. Inspect the ENTIRE Special ability row and return EVERY visible icon against reference image 2; never stop after the first. Return JSON only with name, age, ovr, roles, layout, totals, skills, playstyle{name,levelName}, specialAbilities. For this regression all 15 displayed outfield skills must be read.'''
payload={'contents':[{'role':'user','parts':[{'text':prompt},{'inline_data':{'mime_type':'image/jpeg','data':img}},{'text':'REFERENCE IMAGE 1'},{'inline_data':{'mime_type':'image/png','data':ps}},{'text':'REFERENCE IMAGE 2'},{'inline_data':{'mime_type':'image/jpeg','data':sa}}]}],'generationConfig':{'responseMimeType':'application/json','maxOutputTokens':6000}}
url='https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent'
req=urllib.request.Request(url,data=json.dumps(payload).encode(),headers={'Content-Type':'application/json','x-goog-api-key':key},method='POST')
try:
    with urllib.request.urlopen(req,timeout=120) as r: body=json.load(r)
except urllib.error.HTTPError as e:
    if e.code==429:
        print('SKIP live Gemini scanner: free-tier quota/rate limit reached (429); no paid fallback')
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
if got.get('playstyle',{}).get('levelName')!=exp['playstyle']['levelName']: errs.append(('playstyle level',got.get('playstyle'),exp['playstyle']))
if got.get('specialAbilities')!=exp['specialAbilities']: errs.append(('specialAbilities',got.get('specialAbilities'),exp['specialAbilities']))
if errs:
    print('FAIL live Gemini scanner')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS live Gemini scanner: David Andrews exact text/numbers + Box-to-Box Standard + both special abilities')
