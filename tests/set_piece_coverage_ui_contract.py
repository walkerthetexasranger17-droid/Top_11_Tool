from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
app=(ROOT/'js/app.js').read_text()
css=(ROOT/'css/app.css').read_text()
soup=BeautifulSoup(html,'html.parser')
checks=[]
def check(ok,msg): checks.append((bool(ok),msg))
check(soup.select_one('#setPieceCoverage') is not None,'automatic Set Piece coverage panel exists')
check(soup.select_one('#setPieceCoverageGrid') is not None,'coverage grid exists')
check(soup.select_one('#setPiecePicker') is None,'manual Set Piece picker removed')
check(soup.select_one('#setPieceCandidates') is None,'manual candidate list removed')
check(soup.select_one('#refreshSetPiecesBtn') is None,'manual refresh button removed')
check(soup.select_one('#clearSetPieceBtn') is None,'manual clear button removed')
check('renderSetPieceCoverage' in app,'coverage renderer wired')
check('data-set-piece-player' not in app,'manual player assignment click path removed')
check('setManualSetPiece(currentSetPieceState' not in app,'manual Set Piece state mutation removed from runtime UI')
check("plan?.setPieces?.assignments" in app,'UI reads the automatic Team Plan Set Piece assignments')
check("sources:Object.fromEntries(SET_PIECE_MODES.map(([key])=>[key,'auto']))" in app,'persisted UI state is reset to automatic coverage')
check('.set-piece-coverage-card' in css and '.set-piece-duty-list' in css,'coverage visual styling present')
failed=[msg for ok,msg in checks if not ok]
if failed:
    print('FAIL set-piece coverage UI contract')
    for msg in failed: print(' -',msg)
    raise SystemExit(1)
print(f'PASS set-piece coverage UI contract: {len(checks)} assertions')
