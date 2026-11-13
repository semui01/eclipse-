import sys, json, numpy as np
sys.path.insert(0, '/root/.claude/skills/synced/d2b73c59-10cc-465e-b3c6-2cb6b574d3d5_2e752f92-3bdd-49e5-9740-a35b2d979c94/script-to-motion-video/scripts')
from soundkit import *
EV = json.load(open('stills/ev/events.json')); DUR = 76
sk = Kit(DUR)
Am = [45, 52, 57, 60, 64]; F = [41, 53, 57, 60, 65]; C = [48, 52, 55, 60, 64]; G = [43, 50, 55, 59, 62]; Dm = [50, 53, 57, 62, 65]; Em = [40, 52, 55, 59, 64]
S = EV['scene']; tSeason = 34.7; tPair = 51.7; tEnd = S[3]
# intro: sparse, starry
sk.pad([33, 45], 0, S[0] + 1.5, .5, bright=320, att=2)
sk.pad(Am, 0, 4.6, .5, bright=1300); sk.pad(F, 4.2, S[0] - 4.2 + 1.4, .5, bright=1300)
for k in range(9): sk.bell([76, 81, 84, 88, 79][k % 5], .9 + k * .8, .05, pan=np.sin(k * 1.3) * .7)
# tilt + calendar: pulse enters
sk.progression([Am, F, C, G], S[0], S[2], bpm=84, kick_from=S[1], bright=1500)
# nodes: more mysterious, hats build
sk.progression([Am, Em, F, Dm], S[2], tSeason, bpm=84, kick_from=S[2], hats_from=28.4, bright=1700)
# season + half lap: brighter
sk.progression([F, C, G, Am], tSeason, tPair, bpm=84, kick_from=tSeason, hats_from=tSeason, bright=2100)
# the pair explained: full, rising
sk.progression([Am, F, C, G], tPair, tEnd, bpm=84, kick_from=tPair, hats_from=tPair, bright=2500, pad_g=.58)
arp = [69, 72, 76, 79, 81, 79, 76, 72]; beat = 60 / 84
for k in range(int((EV['lunar'][0] - EV['travel'][0]) / (beat / 2))): sk.bell(arp[k % 8] + (12 if k > 14 else 0), EV['travel'][0] + k * beat / 2, .04 + .002 * k, pan=np.sin(k * .7) * .6, d=1.6)
# finale
sk.pad([33, 45, 52, 57, 60, 64, 69], tEnd, DUR - tEnd, .75, bright=2300, att=.4, rel=4)
sk.pad([21, 33], tEnd, DUR - tEnd, .6, bright=260, att=.3, rel=4)
for k in range(9): sk.bell([81, 76, 84, 72, 88, 81, 76, 69, 81][k], tEnd + .8 + k * .7, .06, pan=np.sin(k) * .7, d=3)

# ---- sfx
for t in S: sk.whoosh(t, .9, .45)
sk.boom(EV['sunIcon'][0] + .3, .5); sk.sparkle(EV['sunIcon'][0] + .9, 1.0, 60, .02)
sk.bell(74, EV['moonIcon'][0], .2, buf='sfx'); sk.whoosh(EV['moonIcon'][0] + 1, 1.2, .2, up=False)
sk.blip(EV['question'][0], .25, 660); sk.blip(EV['question'][0] + .12, .25, 880)
for t in EV['miss']: sk.whoosh(t - .1, .5, .25); sk.blip(t, .2, 330, .2); sk.blip(t + .1, .2, 247, .25)
sk.click(EV['tilt'][0], .3)
sk.click(EV['cal12'][0], .45); sk.bell(81, EV['cal12'][0], .2, buf='sfx')
h0, h1 = EV['hop0'][0], EV['cal28'][0]
for k in range(15): sk.click(h0 + (h1 - h0) * k / 15, .16, 2600 + 60 * k, pan=-.4 + k * .05)
sk.click(h1 + .1, .45); sk.bell(69, h1 + .1, .2, buf='sfx')
for i, t in enumerate(EV['node']): sk.blip(t, .3, 990 + 330 * i, .3, pan=-.5 + i); sk.click(t, .3)
t = EV['noEclipse'][0] + .3; sk.blip(t, .25, 330, .22); sk.blip(t + .12, .25, 233, .3)
sk.whoosh(EV['zoomOut'][0] + .7, 1.6, .5, up=False)
sk.rumble(EV['zoomOut'][0] + .5, EV['align'][0], .5); sk.boom(EV['align'][0], .9); sk.bell(88, EV['align'][0], .25, buf='sfx'); sk.sparkle(EV['align'][0], 1.2, 90, .025)
sk.whoosh(EV['arcs'][0] + .4, 1.0, .3)
c0, c1 = EV['count']
for k in range(35): sk.click(c0 + (c1 - c0) * (k / 34), .13, 3000, pan=.4)
sk.blip(c1, .3, 1320, .25)
sk.whoosh(EV['zoomIn'][0] + .8, 1.6, .5)
a, b = EV['half']; sk.ticks(a, b, .1, .2, .97); sk.whoosh((a + b) / 2, b - a, .22); sk.blip(b, .3, 1320, .25)
r0, r1 = EV['rewind']; sk.tape(r0, r1 - r0, .14, rev_from=True, src_span=(r0 - 3, r0))
sk.boom(EV['solar'][0], 1.0); sk.bell(81, EV['solar'][0], .3, buf='sfx'); sk.sparkle(EV['solar'][0], 1.0, 80, .025)
sk.whoosh((EV['travel'][0] + EV['travel'][1]) / 2, EV['travel'][1] - EV['travel'][0], .18)
for k in range(3): sk.blip(EV['still'][0] + k * .22, .2, 1568, .1, pan=.4)
sk.rumble(EV['lunar'][0] - 2.2, EV['lunar'][0], .45); sk.boom(EV['lunar'][0], 1.0); sk.bell(69, EV['lunar'][0], .3, buf='sfx'); sk.sparkle(EV['lunar'][0], 1.3, 90, .025)
sk.boom(EV['stamp'][0], .9, 1.8); sk.click(EV['stamp'][0], .5, 1800)
sk.whoosh(EV['endcard'][0], 1.0, .3); sk.bell(81, EV['endcard'][0] + .2, .2, buf='sfx')
sk.mix('vo_full.wav', 'mix.wav'); sk.mix(None, 'mix_novo.wav')
