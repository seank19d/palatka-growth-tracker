import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Mirror of src/lib/seo.ts truncateMetaDescription — keep in sync. */
function truncateMetaDescription(text, max = 158) {
  const t = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  let cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  if (sp >= Math.floor(max * 0.7)) cut = cut.slice(0, sp);
  return cut.replace(/[\s.,;:!?]+$/g, "").trimEnd();
}

test("seo.ts exports truncateMetaDescription and uses it in seo()", () => {
  const src = readFileSync(join(root, "src/lib/seo.ts"), "utf8");
  assert.match(src, /export function truncateMetaDescription/);
  assert.match(src, /META_DESCRIPTION_MAX = 158/);
  assert.match(src, /truncateMetaDescription\(description\)/);
  assert.doesNotMatch(src, /\.slice\(\s*0\s*,\s*160\s*\)/);
});

test("developments/\$slug no longer blind-slices meta at 160", () => {
  const src = readFileSync(join(root, "src/routes/developments/$slug.tsx"), "utf8");
  assert.doesNotMatch(src, /\.slice\(\s*0\s*,\s*160\s*\)/);
  assert.match(src, /truncateMetaDescription/);
  assert.match(src, /fairway-estates/);
  assert.match(src, /Plat Book 7 \/ Page 17/);
  assert.match(src, /2025-R-32/);
});

test("truncateMetaDescription cuts on word boundaries under 158", () => {
  const fairwayLong =
    "Fairway Estates is a City of Palatka subdivision. City Commission accepted the final plat on March 27, 2025 (Resolution 2025-R-32). The Putnam clerk shows Fairway Estates at Plat Book 7, Page 17 (section 13, township 10, range 26). Covenant docs in that Commission packet name A&M Home Builders, LLC.";
  const blind160 = fairwayLong.slice(0, 160);
  assert.match(blind160, /Fairw$/);

  const cut = truncateMetaDescription(fairwayLong);
  assert.ok(cut.length <= 158);
  assert.notEqual(cut, blind160);
  assert.doesNotMatch(cut, /Fairw$/);
  assert.match(cut, /[A-Za-z0-9)]$/);

  const beverly =
    "Beverly's Crossing shows up as custom new construction on Peniel Church Road in Palatka. Florida Sunbiz lists Beverly's Crossing Homeowner's Association, Inc. as active (document N25000010683, formed August 15, 2025). Multiple MLS-style listings advertise build packages from about $385,000.";
  const bBlind = beverly.slice(0, 160);
  assert.match(bBlind, /\ba$/);
  const bCut = truncateMetaDescription(beverly);
  assert.ok(bCut.length <= 158);
  assert.doesNotMatch(bCut, /\ba$/);
  assert.match(bCut, /[A-Za-z0-9)]$/);

  const eastRiver =
    "Community reports in 2025–2026 describe a second D.R. Horton subdivision of about 189 homes near Putnam County Boulevard and East River Road in East Palatka. Unlike Alford Farms, this report has not yet tied the report to a published PUD ordinance.";
  const erCut = truncateMetaDescription(eastRiver);
  assert.ok(erCut.length <= 158);
  assert.notEqual(erCut, eastRiver.slice(0, 160));
  assert.match(erCut, /[A-Za-z0-9)]$/);

  const riverfront =
    "Palatka’s historic riverfront is a different animal from East Palatka’s greenfield PUDs: smaller lots, older buildings, floodplain and historic-district constraints, and city rather than county process. There is no single 500-lot filing.";
  assert.ok(truncateMetaDescription(riverfront).length <= 158);
  assert.match(truncateMetaDescription(riverfront), /[A-Za-z0-9)]$/);

  const american =
    "American Gardens is an existing East Palatka neighborhood, not a greenfield subdivision. MLS and public-record compilations describe on the order of 200 homes with a very wide age range. It is on this report so buyers comparing East Palatka to Alford Farms can tell established streets from entitled dirt.";
  assert.ok(truncateMetaDescription(american).length <= 158);
  assert.match(truncateMetaDescription(american), /[A-Za-z0-9)]$/);

  assert.equal(truncateMetaDescription("Short meta."), "Short meta.");
});

test("hub SERP title stays within 60 chars before brand suffix", () => {
  const src = readFileSync(join(root, "src/routes/developments/index.tsx"), "utf8");
  const m = src.match(/title:\s*"([^"]+)"/);
  assert.ok(m);
  assert.ok(m[1].length <= 60, `title length ${m[1].length}: ${m[1]}`);
  assert.match(m[1], /Palatka new construction/);
});

test("404 title and Collection redirects are wired", () => {
  const err = readFileSync(join(root, "src/lib/error-component.tsx"), "utf8");
  assert.match(err, /Page not found \| \$\{APP_NAME\}/);

  const vercel = readFileSync(join(root, "vercel.json"), "utf8");
  assert.match(vercel, /the-collection-at-17th-street/);
  assert.match(vercel, /collection-at-17th-street/);
  assert.match(vercel, /the-collection-at-palatka/);
  assert.match(vercel, /collection-at-palatka/);
  assert.match(vercel, /"permanent":\s*true/);

  const slug = readFileSync(join(root, "src/routes/developments/$slug.tsx"), "utf8");
  assert.match(slug, /statusCode:\s*301/);
  assert.match(slug, /COLLECTION_SLUG_ALIASES/);
});

test("decide meta no longer promises a kit hub", () => {
  const src = readFileSync(join(root, "src/routes/decide.tsx"), "utf8");
  const desc = src.match(/description:\s*"([^"]+)"/);
  assert.ok(desc);
  assert.doesNotMatch(desc[1], /first-week kit/i);
  assert.match(desc[1], /\/house/);
});
