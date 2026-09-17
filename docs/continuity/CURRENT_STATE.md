# CURRENT DESIGN OVERLAY — v0.6.13-dev-pass13

v0.6.13 is the first explicit **design-fidelity correction pass** after the v0.6.12 browser QA work. A real-device Home screenshot showed that responsive fit alone was not sufficient proof that the implementation matched the approved v0.6 references.

Pass 13 is Home-only. The production Home now uses the approved dark navy / neon lime / cyan cinematic composition: dedicated football hero crops derived from the existing production football scene, desktop search/header treatment, Cloud/manager chrome, four stat cards, Recent Players, Training Builder, Team Plan Snapshot, Performance Insights, Quick Actions, and the approved five-item touch navigation (`Home / Squad / Training / Team Plan / More`). Desktop retains direct Drills + Settings in the sidebar.

The Home desktop/mobile approved images in `docs/design/reference/v060/` are the visual contract for this pass. The v0.6.12 real-Chromium harness remains the responsive QA mechanism and must not be removed.

Frozen decision/calibration base remains v0.5.17. No scanner, Training, Formation, Tactics, Mentor, Team Plan, Best-in-Slot or canonical strategy logic is intentionally changed by this pass.

**Next fixed design unit after Pass 13:** v0.6.14 Squad design-fidelity pass against `approved-squad-desktop-v2.webp` / stored Squad references, unless real-device Home review exposes a blocking Home defect first.
