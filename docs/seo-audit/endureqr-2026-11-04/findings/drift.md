# SEO Drift: endureqr.com (2026-11-04)

**Result: 0 CRITICAL / 0 WARNING / 1 INFO. No regressions found.**

- Compared against: baseline #2 for `https://endureqr.com/`, captured 2026-11-02T19:37:58Z (after the last deploy)
- Comparison run: 2026-11-04T00:30:24Z, `drift_compare.py --skip-cwv` (baseline #2 has no CWV data, so CWV and performance-score rules could not run)
- No new baseline was saved. The run added one comparison record to the drift DB; that is the tool's normal behaviour.
- No project files were edited.

## Baseline availability

| URL | Baselines | Compared |
|---|---|---|
| `/` | #1 (2026-11-02 19:25Z), #2 (2026-11-02 19:37Z) | Yes, against #2 |
| `/pricing` | None | No |
| `/qr-code-generator` | None | No |
| `/dynamic-qr-code-generator` | None | No |
| `/guides/what-is-a-qr-code` | None | No |

Trailing-slash versions of the four inner pages were also checked. None have baselines. You can't compare these pages until baselines exist for them.

## Homepage: all 17 rules

| Rule | Severity | Triggered | Old value (baseline #2) | New value (current) |
|---|---|---|---|---|
| content_hash_changed | INFO | **Yes** | `a5e163171d39...` | `9f2ceca4d42a...` |
| status_code_error | CRITICAL | No | 200 | 200 |
| title_removed / title_changed | CRITICAL / WARNING | No | EndureQR: Dynamic QR codes that never stop working | unchanged |
| meta_description_changed | WARNING | No | Create dynamic QR codes you can edit after printing, with unlimited scans and real analytics. Cancel any time: your code... | unchanged |
| canonical_changed / canonical_removed | CRITICAL | No | `https://endureqr.com` | `https://endureqr.com` |
| noindex_added | CRITICAL | No | no robots meta | no robots meta |
| h1_removed / h1_changed | CRITICAL | No | "QR codes that never stop working." | 100% similar |
| schema_removed / schema_modified / schema_added | CRITICAL / WARNING / INFO | No | 3 blocks, hash `b114b0745e0d...` | 3 blocks, same hash |
| og_tags_removed | WARNING | No | 9 tags (og:title, og:description, og:site_name, og:type, og:image + width/height/type/alt) | none removed |
| h2_structure_changed | INFO | No | 10 H2s | 10 H2s |
| cwv_regressed / perf_score_dropped | WARNING | Skipped | no CWV in baseline | n/a |

### Notes on the one INFO finding

- **Content hash changed (INFO).** This was expected. Since baseline #2, commits added the AdSense `<head>` snippet on public pages and the Contact "who answers" copy, and changed the industry pages. Any of these can change the homepage HTML (for example, shared layout or footer markup). No SEO-relevant element changed. Action: none.
- The other commits don't affect the homepage drift rules. The CSP `connect-src data:` change is a response header, `ads.txt` is a separate file, and the README isn't served.

### Tool artefact (not a site issue)

The drift DB stores the H1 as `QRcodesthatneverstopworking.` in both baselines. In `src/components/sections/hero.tsx`, each word sits in nested `<span>`s with `" "` text nodes between them. The extractor strips whitespace-only nodes when it pulls the H1 text, so the spaces disappear. The rendered H1 reads "QR codes that never stop working." This is the same in the baseline and current state, so it doesn't count as drift. No action is needed on the site.

## Cross-skill recommendations

None are required, because there are no CRITICAL or WARNING findings. Optional follow-ups:
- The industry pages lost their shared steps and FAQs. If those pages had FAQPage schema, check that it was removed cleanly or updated: `/seo schema https://endureqr.com/industries/<slug>`. These pages have no baselines, so drift could not check them.
- AdSense in `<head>` adds third-party JS. Capture a CWV-enabled baseline so future runs can catch performance regressions: `/seo google psi https://endureqr.com`.

## Next steps (not done, per instructions)

1. Save new baselines for `/`, preferably without `--skip-cwv` so CWV is included. Also save first baselines for `/pricing`, `/qr-code-generator`, `/dynamic-qr-code-generator`, `/guides/what-is-a-qr-code`, and one industry page.
2. An HTML report can be generated with `drift_report.py` if stakeholders need one.

## Structured findings (audit-data.json, category "SEO Drift")

```json
{
  "category": "SEO Drift",
  "run_at": "2026-11-04T00:30:24Z",
  "baseline": {"url": "https://endureqr.com/", "id": 2, "captured_at": "2026-11-02T19:37:58Z", "has_cwv": false},
  "summary": {"rules": 17, "critical": 0, "warning": 0, "info": 1},
  "findings": [
    {
      "id": "drift-content-hash",
      "url": "https://endureqr.com/",
      "rule": "content_hash_changed",
      "severity": "info",
      "old": "a5e163171d39...",
      "new": "9f2ceca4d42a...",
      "note": "Expected after AdSense head snippet / copy commits; no SEO element changed.",
      "action": "none"
    }
  ],
  "coverage_gaps": [
    {"url": "https://endureqr.com/pricing", "reason": "no baseline"},
    {"url": "https://endureqr.com/qr-code-generator", "reason": "no baseline"},
    {"url": "https://endureqr.com/dynamic-qr-code-generator", "reason": "no baseline"},
    {"url": "https://endureqr.com/guides/what-is-a-qr-code", "reason": "no baseline"},
    {"url": "https://endureqr.com/", "reason": "CWV/perf rules skipped: baseline has no CWV data"}
  ]
}
```
