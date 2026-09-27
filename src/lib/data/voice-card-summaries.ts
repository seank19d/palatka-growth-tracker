/** Inviteful card summaries pinned so automation digests cannot re-bot them. */
export const VOICE_CARD_SUMMARIES: {
  slug: string;
  latestSummary: string;
  unitsNote?: string;
}[] = [
  {
    slug: "gilbert-road-tract",
    latestSummary:
      "News mentions of a Gilbert Road tract show up beside data-center ordinance coverage. Not a confirmed residential PUD on this site until a county case number lands. Watch list only.",
  },
  {
    slug: "nobles-crossing",
    latestSummary:
      "Nobles Crossing is a Century Complete community on Newcastle Road in Palatka. Builder shows inventory on Newcastle Road and Fenham Court — some ready, some still building. Advertised asks have been low-to-mid $300s; verify live. This is a different product from The Collection at Palatka (508 N. 17th Street, also Century Complete, advertised from the low $200,000s).",
    unitsNote:
      "Century Complete lists Nobles Crossing as an active Palatka community on Newcastle Road with single-story plans. Inventory and advertised prices change — verify on the builder page. Separate from The Collection at Palatka (508 N. 17th Street).",
  },
  {
    slug: "beverlys-crossing",
    latestSummary:
      "Beverly's Crossing shows up as custom new construction on Peniel Church Road in Palatka. Florida Sunbiz lists Beverly's Crossing Homeowner's Association, Inc. as active (document N25000010683, formed August 15, 2025). Multiple MLS-style listings advertise build packages from about $385,000 on well/septic lots — prices and plans change; verify on the live listing. This is a different product from Century Complete's Collection and Nobles Crossing.",
    unitsNote:
      "Custom new-construction lots on Peniel Church Road listed as Beverly's Crossing. Listings describe build packages advertised from about $385,000 — verify live on any listing and with the seller. Not Century Complete Collection/Nobles.",
  },
];

export const GILBERT_ROAD_LATEST_SUMMARY =
  VOICE_CARD_SUMMARIES.find((r) => r.slug === "gilbert-road-tract")!.latestSummary;
