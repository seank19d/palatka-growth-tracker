# Shopping flow review

## Findings and changes

- Shopping was missing from primary desktop navigation and labeled “The house” elsewhere. The main header action and mobile/footer navigation now say “Shop essentials.”
- Homepage products appeared below multiple editorial sections. Essentials now appear after the market snapshot, with a link to the full catalog.
- The shopping landing page primarily routed visitors into guides. It now shows the existing catalog with category filters, text search, result counts, and an empty-state reset. Optional guides remain available.
- Product links said only “Amazon.” Full-card links now include the existing item benefit, “See options on Amazon,” and price/availability comparison guidance.
- Guide packs used a separate, sparse product treatment. They now share the same product cards, and generic quizzes no longer duplicate starter products when a pack is already shown.
- Affiliate disclosure precedes product links, and the page explains that items are purchased separately on Amazon in a new tab.
- Existing affiliate URLs and tracking endpoint are preserved. Click logging falls back to fetch when sendBeacon declines to queue the request.

## Remaining purchase friction and measurement

The catalog contains affiliate product categories, not owned inventory with a checkout. Links intentionally open tagged Amazon searches because previous ASIN mappings could lead to unrelated products. Visitors still need to select an exact item on Amazon. Replacing those searches requires verified product mappings; this change does not invent them.

Existing click records measure outbound interest, not completed purchases. Compare shopping-page visits and outbound clicks before/after release, then use Amazon Associates ordered-item and commission reports to assess actual sales. No conversion uplift is claimed without those results.

## Validation

TypeScript, production build, existing tests, and browser checks of search, filters, empty-state recovery, affiliate link attributes, and desktop layout. Responsive styles were reviewed in code; mobile-device browser testing remains outstanding.
