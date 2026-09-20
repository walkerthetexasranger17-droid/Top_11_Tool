#!/usr/bin/env python3
"""Build-30527 formation rule enumerator.

Rules are reconstructed from SquadUtil.GetIllegalFormationStatusKey / GetIrregularFormationStatusKey
and matching shipped localisation. This script is a research/calculation tool, not game code.
"""
from itertools import product
from collections import Counter

ROLES = ['DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST']
MAX = {'DL':1,'DC':3,'DR':1,'DMC':2,'ML':1,'MC':3,'MR':1,'AML':1,'AMC':2,'AMR':1,'ST':3}


def hard_legal(c):
    return (
        sum(c.values()) == 10 and
        c['DL'] + c['DC'] + c['DR'] >= 3 and
        sum(c[r] for r in ['DMC','ML','MC','MR','AML','AMC','AMR']) >= 2 and
        c['DMC'] + c['MC'] + c['AMC'] >= 1 and
        abs((c['DL']+c['ML']+c['AML']) - (c['DR']+c['MR']+c['AMR'])) <= 2 and
        c['AML'] + c['AMC'] + c['AMR'] + c['ST'] >= 1 and
        c['DC'] + c['DMC'] >= 1 and
        all(c[r] <= MAX[r] for r in ROLES)
    )


def warning_free(c):
    return (
        c['ST'] + c['AMC'] >= 1 and
        c['DL'] + c['ML'] + c['AML'] >= 1 and
        c['DR'] + c['MR'] + c['AMR'] >= 1 and
        c['DC'] >= 1 and
        c['DMC'] + c['MC'] >= 1 and
        c['MC'] + c['AMC'] >= 1
    )


def symmetric(c):
    return c['DL'] == c['DR'] and c['ML'] == c['MR'] and c['AML'] == c['AMR']

ADVISORY_GROUPS = {
    'attacking_presence': ['ST','AMC'],
    'left_flank': ['DL','ML','AML'],
    'right_flank': ['DR','MR','AMR'],
    'central_defender': ['DC'],
    'defensive_midfield': ['DMC','MC'],
    'offensive_midfield': ['MC','AMC'],
}

def one_slot_advisory_resilient(c):
    # Companion robustness check: every advisory group starts with >=2 occupants,
    # so losing one relevant outfield slot still leaves the shipped warning satisfied.
    return all(sum(c[r] for r in rs) >= 2 for rs in ADVISORY_GROUPS.values())


def enumerate_counts():
    out=[]
    for values in product(*(range(MAX[r]+1) for r in ROLES)):
        c=dict(zip(ROLES,values))
        if hard_legal(c): out.append(c)
    return out

if __name__ == '__main__':
    allc=enumerate_counts()
    wf=[c for c in allc if warning_free(c)]
    sym=[c for c in wf if symmetric(c)]
    resilient=[c for c in sym if one_slot_advisory_resilient(c)]
    print('hard_legal',len(allc))
    print('warning_free',len(wf))
    print('warning_free_symmetric',len(sym))
    print('warning_free_symmetric_one_slot_resilient',len(resilient))
    for c in resilient: print(c)
