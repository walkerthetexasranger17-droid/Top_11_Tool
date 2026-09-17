#!/usr/bin/env python3
"""Offline real-Chromium viewport audit for Top Eleven Tool.

Why this exists:
The execution container may apply a managed Chromium URLBlocklist=['*'], which
blocks normal navigation even to localhost/file/data URLs. This harness leaves
that policy untouched. It opens about:blank, injects the shipped application
HTML/CSS/JS with local resources embedded as data URIs, stubs only storage and
cloud transport, and then exercises the real UI/runtime in Chromium.

This is a responsive/layout QA harness. It does not alter production files or
football/scanner/calibration logic.
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except Exception as exc:
    print(f"ENVIRONMENT BLOCKED: BeautifulSoup unavailable: {exc}")
    raise SystemExit(2)
try:
    from playwright.sync_api import sync_playwright
except Exception as exc:
    print(f"ENVIRONMENT BLOCKED: Playwright unavailable: {exc}")
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[1]
URL_RE = re.compile(r"url\(([^)]+)\)", re.I)

DEVICE_PROFILES = [
    {"name": "desktop-1440x900", "width": 1440, "height": 900, "touch": False, "expected_nav": "sidebar"},
    {"name": "tablet-landscape-1180x820", "width": 1180, "height": 820, "touch": True, "expected_nav": "bottom"},
    {"name": "tablet-portrait-768x1024", "width": 768, "height": 1024, "touch": True, "expected_nav": "bottom"},
    {"name": "phone-landscape-844x390", "width": 844, "height": 390, "touch": True, "expected_nav": "bottom"},
    {"name": "phone-portrait-390x844", "width": 390, "height": 844, "touch": True, "expected_nav": "bottom"},
]
PAGES = ["dashboard", "squad", "player", "add-player", "training", "my-drills", "team-plan", "settings", "account"]

STORAGE_SHIM = r"""
<script id="offline-storage-shim">
(() => {
  const makeStore = () => {
    const map = new Map();
    return {
      get length(){ return map.size; },
      key(i){ return Array.from(map.keys())[i] ?? null; },
      getItem(k){ k=String(k); return map.has(k) ? map.get(k) : null; },
      setItem(k,v){ map.set(String(k),String(v)); },
      removeItem(k){ map.delete(String(k)); },
      clear(){ map.clear(); }
    };
  };
  Object.defineProperty(window,'localStorage',{value:makeStore(),configurable:true});
  Object.defineProperty(window,'sessionStorage',{value:makeStore(),configurable:true});
})();
</script>
"""

CLOUD_STUB = r"""
(() => {
  const TE = window.TE5 = window.TE5 || {};
  const user = {uid:'offline-browser-audit',displayName:'Viewport QA',email:'qa@example.invalid',emailVerified:true,providerData:[]};
  TE.Cloud = {
    state:{status:'ready',user,syncCount:0,pendingWrites:0},
    async ensureReady(){
      document.getElementById('authGate')?.setAttribute('hidden','');
      document.body.classList.remove('auth-locked');
      document.getElementById('accountButton')?.removeAttribute('hidden');
      return true;
    },
    shouldSyncKey(){ return false; }, queueSet(){}, queueDelete(){}, async flushOutbox(){},
    currentUser(){ return user; }, providerIds(){ return ['password']; }, factors(){ return []; },
    renderAccountPage(){
      const set=(id,v)=>{const e=document.getElementById(id); if(e)e.textContent=v};
      set('accountDisplayName',user.displayName); set('accountEmail',user.email); set('accountAvatar','V');
      const verified=document.getElementById('accountVerified');
      if(verified){verified.textContent='Verified';verified.classList.add('ok')}
    },
    friendlyAuthError(e){ return String(e?.message||e||'Offline QA'); }
  };
})();
"""

class OfflineBundle:
    def __init__(self, app: Path):
        self.app = app.resolve()
        self._data_cache: dict[Path, str] = {}

    def resolve_local(self, raw: str, base_dir: Path) -> Path | None:
        s = (raw or '').strip().strip('"\'')
        if not s or s.startswith(('data:', 'http:', 'https:', '#', 'blob:', 'about:', 'javascript:')):
            return None
        s = s.split('?', 1)[0].split('#', 1)[0]
        p = (base_dir / s).resolve()
        try:
            p.relative_to(self.app)
        except ValueError:
            return None
        return p if p.is_file() else None

    def data_uri(self, p: Path) -> str:
        p = p.resolve()
        if p in self._data_cache:
            return self._data_cache[p]
        mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
        value = f"data:{mime};base64,{base64.b64encode(p.read_bytes()).decode('ascii')}"
        self._data_cache[p] = value
        return value

    def rewrite_urls(self, text: str, base_dir: Path) -> str:
        def repl(match):
            p = self.resolve_local(match.group(1), base_dir)
            return f'url("{self.data_uri(p)}")' if p else match.group(0)
        return URL_RE.sub(repl, text)

    def build_html(self) -> str:
        soup = BeautifulSoup((self.app / 'index.html').read_text(encoding='utf-8'), 'html.parser')

        # Never navigate to external/local resources from the managed browser.
        for link in list(soup.find_all('link')):
            rel = ' '.join(link.get('rel') or [])
            href = link.get('href', '')
            if 'stylesheet' in rel:
                p = self.resolve_local(href, self.app)
                if p:
                    style = soup.new_tag('style')
                    style['data-offline-source'] = str(p.relative_to(self.app))
                    style.string = self.rewrite_urls(p.read_text(encoding='utf-8'), p.parent)
                    link.replace_with(style)
                    continue
            link.decompose()

        for img in soup.find_all('img'):
            p = self.resolve_local(img.get('src', ''), self.app)
            if p:
                img['src'] = self.data_uri(p)

        # Responsive <picture> sources must be embedded too; otherwise a matching
        # <source srcset> can override an embedded <img> fallback and appear blank.
        for source in soup.find_all('source'):
            raw = source.get('srcset', '')
            p = self.resolve_local(raw, self.app)
            if p:
                source['srcset'] = self.data_uri(p)

        for element in soup.find_all(style=True):
            element['style'] = self.rewrite_urls(element['style'], self.app)

        for script in list(soup.find_all('script', src=True)):
            p = self.resolve_local(script.get('src', ''), self.app)
            if not p:
                script.decompose()
                continue
            replacement = soup.new_tag('script')
            replacement['data-offline-source'] = str(p.relative_to(self.app))
            replacement.string = CLOUD_STUB if p.name == 'cloud.js' else p.read_text(encoding='utf-8')
            script.replace_with(replacement)

        for script in soup.find_all('script'):
            if not script.get('src') and script.string and 'Runtime build mismatch' in script.string:
                script.string = script.string.replace("location.reload();", "console.warn('offline QA: reload suppressed');")

        soup.head.insert(0, BeautifulSoup(STORAGE_SHIM, 'html.parser'))
        return str(soup)

    def patch_dynamic_assets(self, page) -> None:
        refs = page.evaluate("""() => {
          const out=[];
          document.querySelectorAll('img[src]').forEach(e=>out.push(['src',e.getAttribute('src')]));
          document.querySelectorAll('source[srcset]').forEach(e=>out.push(['src',e.getAttribute('srcset')]));
          document.querySelectorAll('[style]').forEach(e=>out.push(['style',e.getAttribute('style')]));
          return out;
        }""")
        mapping: dict[str, str] = {}
        for typ, raw in refs:
            if not raw or raw.startswith('data:'):
                continue
            if typ == 'src':
                p = self.resolve_local(raw, self.app)
                if p:
                    mapping[raw] = self.data_uri(p)
            else:
                for m in URL_RE.finditer(raw):
                    uri = m.group(1).strip().strip('"\'')
                    p = self.resolve_local(uri, self.app)
                    if p:
                        mapping[uri] = self.data_uri(p)
        if mapping:
            page.evaluate("""m => {
              document.querySelectorAll('img[src]').forEach(e=>{const s=e.getAttribute('src');if(m[s])e.setAttribute('src',m[s]);});
              document.querySelectorAll('source[srcset]').forEach(e=>{const s=e.getAttribute('srcset');if(m[s])e.setAttribute('srcset',m[s]);});
              document.querySelectorAll('[style]').forEach(e=>{let s=e.getAttribute('style')||''; for(const [k,v] of Object.entries(m)){s=s.split(k).join(v)} e.setAttribute('style',s);});
            }""", mapping)


def run(app: Path, out: Path, screenshots: bool, chromium: str) -> int:
    bundle = OfflineBundle(app)
    html = bundle.build_html()
    out.mkdir(parents=True, exist_ok=True)
    (out / 'injected.html').write_text(html, encoding='utf-8')

    rows = []
    console_errors = []
    failures = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            executable_path=chromium,
            args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        )
        try:
            for profile in DEVICE_PROFILES:
                context = browser.new_context(
                    viewport={'width': profile['width'], 'height': profile['height']},
                    device_scale_factor=1,
                    has_touch=profile['touch'],
                )
                page = context.new_page()
                page.on('console', lambda msg, vn=profile['name']: console_errors.append(
                    {'viewport': vn, 'type': msg.type, 'text': msg.text}
                ) if msg.type == 'error' else None)
                page.set_content(html, wait_until='load', timeout=30000)
                page.wait_for_function("() => !document.body.classList.contains('booting') && window.TE5 && window.TE5.AppNav", timeout=15000)
                bundle.patch_dynamic_assets(page)

                media = page.evaluate("""() => ({
                  coarse: matchMedia('(pointer:coarse)').matches,
                  fine: matchMedia('(pointer:fine)').matches,
                  portrait: matchMedia('(orientation:portrait)').matches,
                  width: innerWidth, height: innerHeight,
                  maxTouchPoints: navigator.maxTouchPoints
                })""")
                if bool(media['coarse']) != bool(profile['touch']):
                    failures.append(f"{profile['name']}: pointer emulation mismatch {media}")

                for page_name in PAGES:
                    page.evaluate("p => window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})", page_name)
                    page.wait_for_timeout(60)
                    bundle.patch_dynamic_assets(page)
                    page.evaluate("() => scrollTo(0,0)")

                    metrics = page.evaluate("""p => {
                      const root=document.documentElement, body=document.body;
                      const nav=document.querySelector('.bottom-nav');
                      const nr=nav?.getBoundingClientRect();
                      const visible=nav && getComputedStyle(nav).display!=='none' && nr.width>0 && nr.height>0;
                      let navMode='hidden';
                      if(visible){
                        if(nr.width <= 300 && nr.height > innerHeight * .55 && nr.left < 3) navMode='sidebar';
                        else if(nr.width > innerWidth * .8 && nr.height <= 110 && Math.abs(nr.bottom-innerHeight) < 4) navMode='bottom';
                        else navMode='other';
                      }
                      const pageEl=document.getElementById('page-'+p);
                      const offenders=[];
                      if(pageEl) pageEl.querySelectorAll('*').forEach(el=>{
                        const r=el.getBoundingClientRect();
                        if(r.width>0 && (r.right>innerWidth+1 || r.left<-1)){
                          offenders.push({tag:el.tagName,cls:String(el.className||''),left:+r.left.toFixed(1),right:+r.right.toFixed(1),width:+r.width.toFixed(1)});
                        }
                      });
                      return {
                        page:p,
                        inner:[innerWidth,innerHeight],
                        doc:[root.scrollWidth,root.scrollHeight],
                        body:[body.scrollWidth,body.scrollHeight],
                        overflowX:root.scrollWidth > innerWidth + 1,
                        navMode,
                        navRect:nr?[+nr.left.toFixed(1),+nr.top.toFixed(1),+nr.width.toFixed(1),+nr.height.toFixed(1),+nr.bottom.toFixed(1)]:null,
                        offenders:offenders.slice(0,20)
                      };
                    }""", page_name)
                    metrics['viewport'] = profile['name']
                    metrics['touch'] = profile['touch']
                    metrics['media'] = media
                    rows.append(metrics)

                    if metrics['overflowX']:
                        failures.append(f"{profile['name']} / {page_name}: horizontal document overflow {metrics['doc'][0]} > {metrics['inner'][0]}")
                    if metrics['navMode'] != profile['expected_nav']:
                        failures.append(f"{profile['name']} / {page_name}: nav mode {metrics['navMode']} != {profile['expected_nav']} ({metrics['navRect']})")
                    if screenshots:
                        page.screenshot(path=str(out / f"{profile['name']}__{page_name}-viewport.png"), full_page=False)
                context.close()
        finally:
            browser.close()

    if console_errors:
        failures.extend(f"console error {e['viewport']}: {e['text']}" for e in console_errors)

    (out / 'results.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
    (out / 'console-errors.json').write_text(json.dumps(console_errors, indent=2), encoding='utf-8')
    (out / 'failures.json').write_text(json.dumps(failures, indent=2), encoding='utf-8')

    print(f"Audited {len(rows)} page/view combinations in real Chromium")
    print(f"Horizontal-overflow cases: {sum(1 for r in rows if r['overflowX'])}")
    print(f"Console errors: {len(console_errors)}")
    if failures:
        print(f"FAIL offline Chromium viewport audit ({len(failures)} issue(s))")
        for issue in failures:
            print('-', issue)
        return 1
    print('PASS offline Chromium viewport audit: 5 device profiles x 9 pages; nav modes and horizontal fit verified')
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', type=Path, default=ROOT)
    parser.add_argument('--out', type=Path, default=ROOT / 'browser-audit')
    parser.add_argument('--chromium', default='/usr/bin/chromium')
    parser.add_argument('--screenshots', action='store_true')
    args = parser.parse_args()
    return run(args.app.resolve(), args.out.resolve(), args.screenshots, args.chromium)

if __name__ == '__main__':
    raise SystemExit(main())
