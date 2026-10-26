# Performance (CWV) (score 88)

## What works
- Tool and guide pages: Lighthouse 100
- CLS 0 everywhere

## Findings
### Medium: Homepage main-thread cost
Lighthouse mobile 83, TBT 412 ms from the 3D hero; LCP 3.13 s.

**Fix:** Defer the 3D scene further on mobile.
