import type { GuidePage } from "@/lib/types";

export const SEED_GUIDES: Omit<GuidePage, "lastRefreshedAt">[] = [
  {
    slug: "moving-checklist",
    title: "Moving to Palatka & East Palatka checklist",
    navLabel: "Moving checklist",
    excerpt:
      "A practical sequence for people actually relocating — not a brochure. Utilities, schools, insurance, and the first two weeks.",
    affiliateCategory: "moving",
    sortOrder: 1,
    sections: [
      {
        callout: {
          title: "The truck is a different list",
          body: "Boxes, tape, and the first night are on the moving list on this site. This checklist is the calls — appraiser, schools, electric — before the keys.",
        },
      },
      {
        heading: "Eight weeks out",
        paragraphs: [
          "Decide whether you are buying in Palatka city limits, unincorporated East Palatka, or further out in Putnam County. Those three choices change your water, sewer, trash, school assignment, and flood story. A listing photo of “Palatka” is not a legal address.",
          "Get a Florida insurance quote early. Carriers and premiums move. Wind-mitigation inspections and elevation certificates take time. Do not wait until the week of closing.",
        ],
        list: [
          "Confirm the parcel’s city vs unincorporated status with the Putnam County Property Appraiser.",
          "Pull a FEMA flood map for the exact parcel, not the neighborhood name.",
          "If you have kids, use Putnam County School District’s locator — not a Facebook group.",
          "Ask the title company about outstanding assessments or PUD bonds on new construction.",
        ],
      },
      {
        heading: "Four weeks out",
        paragraphs: [
          "Start utility connects before the truck rolls. Clay Electric and FPL both operate here; the wrong call center cannot start the other company’s service. For internet, Spectrum coverage is decent in town and uneven in rural pockets — have a Starlink or hotspot fallback if you work remotely from a dirt-road lot.",
        ],
        list: [
          "Electric: Clay Electric (Palatka district) or FPL — look up the address.",
          "Water/sewer: City of Palatka, a county system, or well/septic.",
          "Trash: county franchise (often Gottago in Putnam) or city sanitation.",
          "Change of address with USPS, banks, and Florida DHSMV if you are coming from out of state.",
        ],
      },
      {
        heading: "The week you arrive",
        paragraphs: [
          "Florida summers are hot and wet. Unpack beds, window coverings, and the kitchen before decorative boxes. If the house has been vacant, run the A/C, check for moisture in closets, and flush every trap.",
          "Register vehicles and update your driver license within the Florida window if you are becoming a resident. Putnam County Tax Collector handles plates.",
        ],
        list: [
          "Photograph the meter, A/C model, well equipment, and any builder punch-list items the first morning.",
          "Find the nearest grocery (Publix and Walmart in Palatka) and the hospital (HCA Florida Putnam Hospital on Zeagler Drive).",
          "Put hurricane season on the calendar if you arrive between June and November.",
        ],
      },
      {
        heading: "What this checklist is not",
        paragraphs: [
          "It is not a promise that Alford Farms, or any other pipeline project, will be ready when your lease ends. Match your move date to a house that exists.",
        ],
      },
    ],
  },
  {
    slug: "utilities",
    title: "Palatka utilities: Clay Electric, water, sewer",
    navLabel: "Utilities",
    excerpt:
      "Clay Electric vs FPL, city water vs well, Palatka Gas, and trash in Putnam County. Look up the street — not the city name.",
    affiliateCategory: "home-setup",
    sortOrder: 2,
    sections: [
      {
        callout: {
          title: "Call these numbers",
          body: "Clay Electric Cooperative — (386) 328-1432 · Outages 1-888-434-9844 · Office 300 N. State Road 19, Palatka. FPL — 1-800-226-3545. Look up the exact street on each site; territory is by line, not by city name.",
        },
      },
      {
        heading: "Electric",
        paragraphs: [
          "Two providers cover Putnam County: Clay Electric Cooperative and Florida Power & Light. Territory is by line, not by city name. East Palatka lots can go either way.",
        ],
        list: [
          "Clay Electric Cooperative — Palatka district office, 300 N. State Road 19, Palatka. Main: (386) 328-1432. Outages: 1-888-434-9844. Member-owned co-op.",
          "Florida Power & Light — 1-800-226-3545. Use FPL’s address lookup.",
          "Florida PSC has a statewide utility-territory map if both sites are unclear.",
        ],
        callout: {
          title: "Co-op vs IOU",
          body: "Clay Electric is a cooperative. You typically pay a membership and get capital credits over time. FPL is an investor-owned utility. Neither is “better” in the abstract; your street is already assigned.",
        },
      },
      {
        heading: "Water, sewer, well, septic",
        paragraphs: [
          "Inside the City of Palatka, expect municipal water and sewer — confirm with city utilities. Unincorporated East Palatka and much of the county still rely on private wells and septic systems, especially on older lots and acreage.",
          "New PUDs (Alford Farms class) usually propose central water/wastewater as part of the engineering. That infrastructure is one of the reasons permitting takes a year or more after rezoning. Until the system is built and accepted, a lot on a plat is not a turn-key city tap.",
        ],
        list: [
          "City of Palatka utilities — palatka-fl.gov",
          "Putnam County Public Works / utilities staff for unincorporated systems",
          "SJRWMD for well and environmental permits on new development",
          "Have well water tested if you buy an existing rural home",
        ],
      },
      {
        heading: "Gas, trash, internet",
        paragraphs: [
          "Palatka Gas Authority serves parts of the city. Many homes, especially newer all-electric packages, have no gas. Do not assume a grill stub.",
          "Trash in unincorporated Putnam is typically a franchise hauler (Gottago of Putnam County is commonly listed). City residents follow Palatka sanitation rules.",
          "Internet: Spectrum is the default cable option in town. Rural addresses may see fixed wireless, DSL leftovers, or satellite. If your job needs upload, test the exact address — “Palatka has fiber” is not a coverage map.",
        ],
      },
    ],
  },
  {
    slug: "home-setup",
    title: "Palatka home setup: humidity, storms, and bugs",
    navLabel: "Home setup",
    excerpt:
      "First-week Palatka house setup: run the A/C, waterproof the mattresses, watch west glass, and treat standing water before you unpack.",
    affiliateCategory: "home-setup",
    sortOrder: 3,
    sections: [
      {
        callout: {
          title: "Storm season is June through November",
          body: "You can close in September and still sit through a hurricane the first month. The storm list on this site is water, lights, and who to call for the house you’re in.",
        },
      },
      {
        heading: "Climate first, furniture second",
        paragraphs: [
          "Palatka is humid subtropical. Interior moisture, west-facing glass, and afternoon storms will trash unprotected mattresses, cardboard, and particleboard. Deal with air, light, and water before the sectional.",
        ],
        list: [
          "Run A/C continuously the first week in a vacant house.",
          "Waterproof mattress protectors on every bed.",
          "A dehumidifier for interior closets if you see condensation.",
          "Window film or proper blinds on west glass — cheaper than fighting the compressor.",
        ],
      },
      {
        heading: "Outdoor living",
        paragraphs: [
          "A usable porch or lanai is half the point of being here. Outdoor rugs, a ceiling fan rated for damp locations, and a grill get more use than a formal dining set. Check any PUD or HOA rules before you pour a patio.",
          "Screen the porch. Treat standing water. You are on the St. Johns, next to wetlands, and dusk is mosquito hour.",
        ],
      },
      {
        heading: "New construction vs old Florida house",
        paragraphs: [
          "Builder homes (when Alford Farms or similar actually sell) come with a warranty, builder-grade appliances, and HOA design rules. Downtown and East Palatka cottages come with charm, possibly well/septic, possibly knob-and-tube stories, and no warranty. Budget a tool kit and a licensed HVAC/electrical look on anything built before the 1990s.",
        ],
      },
    ],
  },
  {
    slug: "schools",
    title: "Palatka FL schools and Putnam County assignment",
    navLabel: "Schools",
    excerpt:
      "Putnam County School District assignment for Palatka and East Palatka. Verify the parcel — a PUD marketing map is not a school assignment.",
    affiliateCategory: null,
    sortOrder: 4,
    sections: [
      {
        callout: {
          title: "Verify the assignment",
          body: "Putnam County School District — putnamschools.org. Call the district with the parcel or street address. Do not use a builder map or a Facebook comment as the assignment.",
        },
      },
      {
        heading: "District",
        paragraphs: [
          "Public schools are Putnam County School District (putnamschools.org). Assignment is by address. East Palatka and Palatka are not always the same cluster; Interlachen and Crescent City are different high-school worlds entirely.",
        ],
        list: [
          "Palatka Jr.-Sr. High — the combined secondary campus in Palatka. Start time listed by the district around 9:00 a.m. for 2026–27 planning.",
          "Palatka Intermediate School",
          "William D. Moseley Elementary and other Palatka-area elementaries — confirm on the locator.",
          "Crescent City Jr.-Sr. High and Middleton-Burney Elementary serve the south county / Crescent City area.",
          "Children’s Reading Center Charter School is a district-listed charter option with different hours.",
        ],
      },
      {
        heading: "After high school",
        paragraphs: [
          "St. Johns River State College has a Palatka campus (the original campus). Dual enrollment and associate degrees are a real local path; Jacksonville and Gainesville universities are a drive, not a commute you make twice a day without planning.",
        ],
      },
      {
        callout: {
          title: "Do not trust marketing maps",
          body: "A new PUD will eventually publish a school assignment. Until the district says so in writing, assume nothing. Call the district with the parcel number.",
        },
      },
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare in Palatka and Putnam County",
    navLabel: "Healthcare",
    excerpt:
      "HCA Florida Putnam Hospital in Palatka, what people drive to Jacksonville or Gainesville for, and the rural-care tradeoff.",
    affiliateCategory: null,
    sortOrder: 5,
    sections: [
      {
        callout: {
          title: "Local hospital",
          body: "HCA Florida Putnam Hospital — 611 Zeagler Drive, Palatka · (386) 328-5711. About 99 beds. For many everyday emergencies this is the local facility.",
        },
      },
      {
        heading: "In Palatka",
        paragraphs: [
          "HCA Florida Putnam Hospital (formerly Putnam Community Medical Center) is the acute-care hospital in Palatka, 611 Zeagler Drive, about 99 beds, main number (386) 328-5711. For many everyday emergencies this is the local facility. For some specialties, people drive.",
        ],
      },
      {
        heading: "When people leave town",
        paragraphs: [
          "St. Augustine (Flagler Hospital / nearby specialists), Jacksonville (multiple systems), and Gainesville (UF Health) are the usual next rungs. That is a fact of Putnam County life, not a knock on the local hospital. If you have an established specialist relationship in one of those cities, factor drive time into where you buy.",
        ],
      },
      {
        heading: "Pharmacies and routine care",
        paragraphs: [
          "Palatka has the national pharmacy chains plus local clinics. Rural lots mean you should not be on the last day’s supply of a critical prescription. Transfer scripts before you move, not after the truck is empty.",
        ],
      },
    ],
  },
  {
    slug: "shopping",
    title: "Shopping & daily errands",
    navLabel: "Shopping",
    excerpt: "Where Palatka actually shops, and what people still drive to St. Augustine for.",
    affiliateCategory: "home-setup",
    sortOrder: 6,
    sections: [
      {
        heading: "In town",
        paragraphs: [
          "Palatka covers groceries and basics: Publix, Walmart, and other national chains along the usual commercial corridors. Downtown Palatka has independent restaurants, the riverfront, and a historic brick core that is more evening-and-Saturday than a daily Target run.",
          "East Palatka’s SR 207 corridor is the growth edge. If Alford Farms’ commercial square footage is eventually built, that is where some of the new daily retail would land — eventually. Do not budget your 2026 errands around a site plan.",
        ],
      },
      {
        heading: "What people still leave for",
        paragraphs: [
          "Bigger retail, more restaurants, and some medical specialists pull toward St. Augustine (SR 207) and Jacksonville. That pattern is why East Palatka lots are in demand: you can live cheaper in Putnam and still reach St. Johns County jobs and stores. It is also why 207 traffic is a live local issue when large PUDs are discussed.",
        ],
      },
    ],
  },
  {
    slug: "outdoors",
    title: "Outdoors & recreation",
    navLabel: "Outdoors",
    excerpt: "The St. Johns River, Ravine Gardens, and the reason a lot of people pick this county.",
    affiliateCategory: "outdoor",
    sortOrder: 7,
    sections: [
      {
        heading: "The river is the point",
        paragraphs: [
          "Palatka sits on the St. Johns River, one of the few U.S. rivers that flows north. Downtown Palatka’s riverfront, boat ramps, and the Palatka Blueways are the local recreation backbone. East Palatka lots that back up to wetlands are pretty; they are also mosquitoes, drainage, and floodplain homework.",
        ],
      },
      {
        heading: "Parks and nearby public land",
        list: [
          "Ravine Gardens State Park — a real, unusual park inside Palatka; azaleas in season, steep ravines, a looping road.",
          "Palatka riverfront parks and the historic district for walking.",
          "Ocala National Forest is a west/southwest drive.",
          "Welaka, Satsuma, and the southern river towns for fishing and quieter water.",
        ],
      },
      {
        heading: "Weather",
        paragraphs: [
          "Summer is long, wet, and hot. Afternoon storms are routine. Hurricane season is June 1–November 30. Winters are mild with the occasional hard cold snap that Florida plumbing notices. If you are coming from New England, you will miss a real autumn and you will not miss ice scrapers.",
        ],
      },
    ],
  },
  {
    slug: "cost-of-living",
    title: "Cost of living & housing snapshot",
    navLabel: "Cost of living",
    excerpt:
      "Putnam is cheaper than St. Johns County. Insurance, flood, and commute time are the fine print.",
    affiliateCategory: null,
    sortOrder: 8,
    sections: [
      {
        heading: "What the public medians actually print",
        paragraphs: [
          "As of mid-2026, public dashboards do not agree on a single Putnam County median, because they measure different mixes. Typical-value products print near $220,000. Some sale-median prints for Palatka listings sit closer to $300,000. Redfin’s short-window county median around June 2026 came in near $309,000. Local recaps have also cited county-wide sale medians in the mid-$200,000s. The honest statement: Putnam is still inexpensive by Florida coastal standards, Palatka proper is not a $150,000 town anymore, and waterfront or newer homes pull the average up.",
          "East Palatka new construction, when it actually sells, will price like builder product in a cheaper county — not like a St. Augustine 32084 ZIP. That is the whole economic story of Alford Farms.",
        ],
      },
      {
        heading: "The costs people forget",
        list: [
          "Florida homeowners insurance — shop early; it can rival a second car payment on older or flood-exposed houses.",
          "Flood insurance if the parcel needs it.",
          "Well pumps, septic pumping, and lawn on acreage.",
          "Commute fuel on SR 207 if your job is in St. Augustine or Jacksonville.",
          "Higher summer electric bills; Clay Electric and FPL rates are public and not the cheapest thing in your budget.",
        ],
      },
      {
        heading: "Compared with nearby counties",
        paragraphs: [
          "St. Johns County (St. Augustine, Nocatee, World Golf Village) is the expensive neighbor. Clay County is mixed. Jacksonville/Duval depends on the neighborhood. Putnam’s pitch is land and a lower entry price in exchange for fewer restaurants, fewer specialists, and a real rural/small-city fabric. If that trade is not actually what you want, you will be unhappy here no matter what Alford Farms looks like on a rendering.",
        ],
      },
    ],
  },
  {
    slug: "local-tips",
    title: "Local tips for new residents",
    navLabel: "Local tips",
    excerpt: "Small, practical things that do not show up on a builder brochure.",
    affiliateCategory: "outdoor",
    sortOrder: 9,
    sections: [
      {
        heading: "Names on a map are not the same place",
        paragraphs: [
          "Palatka, East Palatka, Interlachen, Crescent City, Welaka, Satsuma, Florahome, and Melrose-adjacent Putnam are different daily lives. “Moving to Palatka” in a group chat often means “I found a cheaper house in Putnam.” Drive the actual street at 7:30 a.m. and 5:30 p.m. before you write an offer.",
        ],
      },
      {
        heading: "SR 207 is the commute — and the PUD road",
        paragraphs: [
          "SR 207 is the reason East Palatka is in play for people who work toward St. Augustine. It is also the road every large PUD will dump onto. County hearings about Alford Farms were, in part, hearings about that road. Budget time, not just miles.",
        ],
      },
      {
        heading: "River weather and bugs",
        paragraphs: [
          "Keep a simple storm plan, even in a new house: water, radio, documents, pet crate. The river makes beautiful evenings and aggressive mosquitoes. Screened porches are not a luxury finish here.",
        ],
      },
      {
        heading: "How to use this site",
        paragraphs: [
          "Watch the Alford Farms page for permit and plat milestones, not for floor-plan gossip. If a new PUD name appears in county agendas, it should show up here as a draft or a What’s New item. If this site and a sales agent disagree, ask for the ordinance number.",
        ],
      },
    ],
  },
];
