from pathlib import Path
from bs4 import BeautifulSoup
import re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
js='\n'.join((p.read_text(encoding='utf-8') for p in (ROOT/'js').glob('*.js')))

def camel(data_key:str)->str:
    parts=data_key.removeprefix('data-').split('-')
    return parts[0]+''.join(x[:1].upper()+x[1:] for x in parts[1:])

def ref_present(needle:str)->bool:
    return needle in js

unwired=[]
for i,b in enumerate(soup.find_all('button')):
    bid=str(b.get('id') or '').strip()
    text=' '.join(b.stripped_strings).strip()[:80]
    bound=False
    if b.has_attr('onclick'):
        bound=True
    if bid:
        patterns=(f"#{bid}",f"getElementById('{bid}')",f'getElementById("{bid}")',f"'{bid}'",f'"{bid}"')
        if any(ref_present(x) for x in patterns): bound=True
    for key in [k for k in b.attrs if str(k).startswith('data-')]:
        ds=camel(str(key))
        if ref_present(f'[{key}]') or ref_present(f'.dataset.{ds}') or ref_present(f'dataset.{ds}'):
            bound=True
    if str(b.get('type') or '').lower()=='submit':
        form=b.find_parent('form')
        fid=str(form.get('id') or '').strip() if form else ''
        if fid and (ref_present(f'#{fid}') or ref_present(fid)): bound=True
    if not bound:
        classes=[c for c in (b.get('class') or []) if c]
        if any(ref_present(f'.{c}') for c in classes): bound=True
    if not bound and b.has_attr('disabled'):
        # Permanently disabled buttons do not require an action binding.
        bound=True
    if not bound:
        unwired.append(f'button[{i}] id={bid!r} text={text!r} attrs={dict(b.attrs)!r}')

if unwired:
    print(f'FAIL button binding contract — {len(unwired)} unwired controls')
    for row in unwired: print('-',row)
    sys.exit(1)
print(f'PASS button binding contract: {len(soup.find_all("button"))} buttons have an action/navigation binding')
