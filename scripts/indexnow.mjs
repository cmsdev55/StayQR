// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every URL in the live sitemap.
// Usage after a deploy: node scripts/indexnow.mjs [https://endureqr.com]
// The key below is public by design: it must be readable at https://endureqr.com/<key>.txt
const KEY = "a1c13608465f3a199446374fd4d85e12";
const site = (process.argv[2] ?? "https://endureqr.com").replace(/\/$/, "");
const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
