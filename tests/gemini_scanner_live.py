"""Optional Scanner v4 model-access smoke test.
Set GEMINI_API_KEY to a Google AI Studio key. The browser app itself exercises the Live WebSocket pipeline.
"""
import json, os, sys, urllib.request, urllib.error
key=os.environ.get('GEMINI_API_KEY','').strip()
if not key:
    print('SKIP live scanner model-access test: GEMINI_API_KEY not set')
    raise SystemExit(0)
model='gemini-3.1-flash-live-preview'
url=f'https://generativelanguage.googleapis.com/v1beta/models/{model}?key={key}'
try:
    with urllib.request.urlopen(url,timeout=20) as r:
        body=json.load(r)
except urllib.error.HTTPError as e:
    print('FAIL model access',e.code,e.read().decode('utf-8','replace'))
    raise SystemExit(1)
print('PASS model access:',body.get('name',model))
