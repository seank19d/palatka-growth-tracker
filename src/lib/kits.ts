import type { AffiliateProduct } from "@/lib/types";

export type KitOption = { value: string; label: string; detail: string };

export type KitQuestion = {
  key: string;
  prompt: string;
  hint: string;
  options: KitOption[];
};

export type KitRead = {
  kicker: string;
  headline: string;
  body: string;
  points: string[];
};

export type KitFaq = { question: string; answer: string };

export type KitRelated = {
  to: "/address" | "/storm" | "/house" | "/punch" | "/summer" | "/well" | "/decide" | "/office" | "/yard";
  label: string;
};

export type KitDef = {
  path: string;
  kicker: string;
  title: string;
  lede: string;
  seoTitle: string;
  seoDescription: string;
  breadcrumb: string;
  listHeading: string;
  questions: KitQuestion[];
  faqs: KitFaq[];
  related: KitRelated[];
  score: (a: Record<string, string>) => KitRead;
  titles: (a: Record<string, string>) => string[];
};

export function pickTitles(products: AffiliateProduct[], titles: string[]): AffiliateProduct[] {
  const map = new Map(products.map((p) => [p.title, p]));
  const out: AffiliateProduct[] = [];
  for (const t of titles) {
    const p = map.get(t);
    if (p) out.push(p);
  }
  return out;
}

export const SUMMER: KitDef = {
  path: "/summer",
  kicker: "May–October",
  title: "The first summer in a Palatka house",
  lede: "The A/C runs almost all day, west-facing rooms get fierce, and closets sweat if you don’t catch it. Tell me about the house and I’ll put together what people here usually buy before August.",
  seoTitle: "First summer in a Palatka house: humidity, glass, and the A/C",
  seoDescription:
    "A short list for the first hot season in Palatka or East Palatka — dehumidifier, mattress protectors, window film. Amazon links; we may earn a commission.",
  breadcrumb: "First summer",
  listHeading: "What to pick up before it gets ugly",
  questions: [
    {
      key: "house",
      prompt: "What kind of house is it?",
      hint: "New construction and the older cottages handle summer a little differently.",
      options: [
        {
          value: "new",
          label: "New construction in town",
          detail: "Something like The Collection. Lots of glass, builder blinds, A/C that’s never been through a July.",
        },
        {
          value: "old",
          label: "An older Palatka house",
          detail: "Cottages, ranches, anything with original closets. They hold moisture.",
        },
        {
          value: "looking",
          label: "I haven’t moved in yet",
          detail: "You can still get the bed and the closet stuff before the truck arrives.",
        },
      ],
    },
    {
      key: "glass",
      prompt: "Does the living room or the west side bake in the afternoon?",
      hint: "A lot of the new houses in town have big west windows. That’s the room that fights the A/C.",
      options: [
        {
          value: "yes",
          label: "Yes, it gets hot in there",
          detail: "Film on the glass is cheaper than turning the thermostat down another two degrees.",
        },
        {
          value: "no",
          label: "Not really, or I don’t know yet",
          detail: "We’ll skip the film unless you already know you’ve got a problem room.",
        },
      ],
    },
    {
      key: "closets",
      prompt: "Have you opened a closet after a few closed-up days?",
      hint: "If you smell damp, or the clothes feel cool and a little sticky, that’s the house talking.",
      options: [
        {
          value: "damp",
          label: "Yeah, it already feels damp",
          detail: "Dehumidifier first. Then something for the closets so the clothes don’t sit in it.",
        },
        {
          value: "fine",
          label: "Seems fine so far",
          detail: "Still worth a humidity meter. You’d rather see the number before you smell it.",
        },
        {
          value: "notyet",
          label: "I’m not in the house yet",
          detail: "Protectors on the mattresses the first night. A dehumidifier can wait in the box until you see how it feels.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is Palatka really that humid?",
      answer:
        "Yes. It’s humid subtropical, and we’re on a river. Interior rooms and closets will sweat in summer if the A/C is off, undersized, or you’ve been between systems. That’s true in a new house and an old one.",
    },
    {
      question: "Will a dehumidifier replace a bad A/C?",
      answer:
        "No. It takes the edge off a closet or a spare room. If the whole house is hot, that’s a service call, not a box from Amazon.",
    },
    {
      question: "Do I need this if I’m closing in winter?",
      answer:
        "You can wait on the dehumidifier. Mattress protectors are still worth putting on the first night — spills and humidity don’t only happen in July.",
    },
  ],
  related: [
    { to: "/punch", label: "Closing-week list" },
    { to: "/storm", label: "Storm season" },
    { to: "/house", label: "All the house lists" },
  ],
  score(a) {
    if (a.closets === "damp" || a.house === "old") {
      return {
        kicker: "Humidity first",
        headline: "I’d get the moisture under control before you unpack the rest.",
        body: "Once closets go damp in a Palatka summer, the clothes and the particleboard don’t bounce back quickly. Run the A/C, put a dehumidifier in the worst room, and give the closets something that actually pulls water. If a west room is cooking, film on the glass helps more than arguing with the thermostat.",
        points: [
          "Run the A/C the first week even if you’re not sleeping there yet.",
          "A cheap humidity meter tells you if the closet is a problem before you can smell it.",
          "Window film is for the room that faces west. You don’t need it on every pane.",
        ],
      };
    }
    if (a.house === "new" && a.glass === "yes") {
      return {
        kicker: "New construction, west glass",
        headline: "The house is fine. That west room is going to work the A/C all afternoon.",
        body: "A lot of the new in-town houses have big glass and light-colored floors. It looks good in the listing photos and it heats up after lunch. Film, a fan you can aim, and protectors on the beds will get you through the first summer without turning the place into a cave.",
        points: [
          "Ask the builder which way the living room faces before you pick a lot, if you still can.",
          "Blinds help. Film helps more on west glass.",
          "Keep the A/C on while you’re at work those first weeks. A closed-up new house sweats.",
        ],
      };
    }
    return {
      kicker: "Before you move in",
      headline: "Do the beds and the air first. The sofa can wait.",
      body: "Florida humidity is harder on mattresses and cardboard than the drive down I-95. Waterproof protectors on every bed the first night, then see how the house feels after a week with the A/C running. You can always add a dehumidifier once you’ve lived in it.",
      points: [
        "Put protectors on before anyone sleeps there. It’s a five-minute job.",
        "If you’re coming from up north, the first July still surprises people. That’s normal.",
        "Storm season overlaps the heat. The storm list is a separate page.",
      ],
    };
  },
  titles(a) {
    const t = ["Mattress protector (waterproof)", "Dehumidifier", "Box fan / air circulator"];
    if (a.glass === "yes" || a.house === "new") t.push("Window solar film");
    if (a.closets === "damp" || a.house === "old") t.push("Closet moisture absorbers", "Indoor humidity meter");
    if (a.closets === "fine") t.push("Indoor humidity meter");
    if (a.closets === "notyet") t.push("Indoor humidity meter");
    return t;
  },
};

export const WELL: KitDef = {
  path: "/well",
  kicker: "East Palatka / unincorporated",
  title: "If the house is on a well",
  lede: "A lot of East Palatka and the rest of unincorporated Putnam is still on a private well. The pump needs power, the water isn’t city-treated, and after a flood you don’t guess from the color of the tap. A few questions, then a short list.",
  seoTitle: "East Palatka well water: what to have on a private well",
  seoDescription:
    "Private wells in East Palatka and Putnam County — test kits, a hose, drinking water if the power is out. Amazon links; we may earn a commission.",
  breadcrumb: "Well lot",
  listHeading: "For a house on a well",
  questions: [
    {
      key: "sure",
      prompt: "Are you sure it’s a well, or are you guessing from the listing?",
      hint: "City of Palatka water is a tap in town. Unincorporated East Palatka is often a well and a septic. The listing saying Palatka doesn’t settle it.",
      options: [
        {
          value: "yes",
          label: "It’s a well. I’ve confirmed it.",
          detail: "Good. Then we can skip the guessing.",
        },
        {
          value: "think",
          label: "I think so — it’s East Palatka or acreage",
          detail: "Treat it as a well until a plumber or the property record says otherwise.",
        },
        {
          value: "looking",
          label: "I’m still looking at lots",
          detail: "You can take a test kit with you. Decode the street on this site if you have an address.",
        },
      ],
    },
    {
      key: "when",
      prompt: "What’s going on with the water right now?",
      hint: "A well that’s been sitting, or one that’s had standing water around it, is a different job than a well you’ve been drinking from for years.",
      options: [
        {
          value: "flood",
          label: "There was standing water around it",
          detail: "Test it before anyone drinks from the tap. Color isn’t a lab result.",
        },
        {
          value: "move",
          label: "We just got the keys / it’s been sitting",
          detail: "I’d test it and put a sediment filter on while you learn what the water’s like.",
        },
        {
          value: "fine",
          label: "We’ve been drinking it",
          detail: "Still worth a kit in the cabinet, and a hose long enough for the yard.",
        },
      ],
    },
    {
      key: "power",
      prompt: "If the power goes out, do you have drinking water in the house?",
      hint: "The well pump is an electric appliance. No power, no water at the tap.",
      options: [
        {
          value: "no",
          label: "Not really",
          detail: "Jugs you can lift. The storm list covers the rest of an outage.",
        },
        {
          value: "yes",
          label: "Yes, we’ve got some put up",
          detail: "Keep it. We’ll still put a couple of jugs on the list if you’re light.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Does East Palatka have city water?",
      answer:
        "Most of it doesn’t. East Palatka is unincorporated Putnam County. Older lots are usually well and septic. New PUDs sometimes propose central water as part of the engineering — that’s a future system, not a tap today. Confirm the parcel.",
    },
    {
      question: "Can I drink the well water?",
      answer:
        "Plenty of people do. You still want it tested, especially after you’ve been away, after flooding, or when you first move in. A strip kit is a start. A lab is better if anything looks off.",
    },
    {
      question: "What happens in a storm?",
      answer:
        "The pump stops with the power. That’s why the storm list and this one sit next to each other. Store water you can carry.",
    },
  ],
  related: [
    { to: "/address", label: "Decode a street" },
    { to: "/storm", label: "Storm season" },
    { to: "/house", label: "All the house lists" },
  ],
  score(a) {
    if (a.when === "flood") {
      return {
        kicker: "After standing water",
        headline: "Don’t drink it until you’ve tested it.",
        body: "If floodwater sat around the wellhead, the safe move is bottled or stored water until a test comes back. A home kit is a start; if anything looks wrong, a lab in the area can do the rest. Keep jugs in the house anyway — the pump still dies when the power does.",
        points: [
          "Stay off the tap for drinking until you’ve tested.",
          "Clay Electric outages: 1-888-434-9844. FPL: 1-800-4OUTAGE.",
          "Putnam County Emergency Management is the official storm channel.",
        ],
      };
    }
    if (a.when === "move" || a.sure !== "yes") {
      return {
        kicker: "New to the well",
        headline: "Learn the water before you trust it every day.",
        body: "A well that’s been sitting, or one you just inherited with the house, is worth a test and a simple sediment filter. Putnam water can be hard, and new-to-you plumbing stirs things up. A long hose matters too — new sod and sandy soil drink a lot.",
        points: [
          "If you’re not sure it’s a well, decode the street on this site.",
          "City of Palatka water is in town. East Palatka is a different story.",
          "The pump needs power. The storm list is the outage half of this.",
        ],
      };
    }
    return {
      kicker: "You’re already on it",
      headline: "Keep a test kit and water you can carry. The rest is the yard.",
      body: "If you’ve been drinking it and it tastes fine, you still want a kit in the cabinet for after a flood or a long trip. A decent hose and a way to store water through an outage cover most of what people wish they’d had the first year.",
      points: [
        "Look up whose lines you’re on before the next storm.",
        "Septic is often the other half of a well lot. Don’t put the wrong stuff down the drain.",
        "If the pressure suddenly drops, that’s a pump or a tank, not an Amazon problem.",
      ],
    };
  },
  titles(a) {
    const t = ["Well water test kit", "Garden hose and nozzle"];
    if (a.when === "flood" || a.power === "no") t.unshift("Drinking water containers");
    if (a.when === "move" || a.sure !== "yes") t.push("Whole-house sediment filter", "Under-sink water filter");
    if (a.when === "fine") t.push("Under-sink water filter");
    if (a.power === "no") t.push("Drinking water containers");
    return [...new Set(t)];
  },
};

export const OFFICE: KitDef = {
  path: "/office",
  kicker: "Working from Putnam",
  title: "Working from the lot",
  lede: "A lot of people move over here from St. Johns or Jacksonville for the house, then find out the upload and the Wi-Fi don’t match the listing photo. Tell me how you work and where the house is.",
  seoTitle: "Working from Palatka or East Palatka: Wi-Fi, power, and the modem",
  seoDescription:
    "Mesh Wi-Fi, a battery for the modem, and a cord that actually reaches — for people working from a Palatka or East Palatka house. Amazon links; we may earn a commission.",
  breadcrumb: "Work from the lot",
  listHeading: "For the desk and the modem",
  questions: [
    {
      key: "job",
      prompt: "How much does the internet actually have to work?",
      hint: "Spectrum is the usual cable in town. Out on a well lot it can be cable, fixed wireless, or satellite. Test the address if your job cares.",
      options: [
        {
          value: "upload",
          label: "Video calls and uploads, most days",
          detail: "You need the mesh to cover the house and a battery on the modem for the short blips.",
        },
        {
          value: "email",
          label: "Email and a browser, mostly",
          detail: "A better Wi-Fi setup still helps. The UPS is cheap insurance.",
        },
        {
          value: "phone",
          label: "I can work off a phone if I have to",
          detail: "Then we’re just covering the house so everyone else isn’t on top of the modem.",
        },
      ],
    },
    {
      key: "where",
      prompt: "Where’s the house?",
      hint: "In-town Palatka and East Palatka acreage are different internet stories.",
      options: [
        {
          value: "town",
          label: "In Palatka city",
          detail: "Spectrum is the default. Mesh still helps in a new house with a lot of wall.",
        },
        {
          value: "east",
          label: "East Palatka or further out",
          detail: "Confirm the address before you assume fiber. A mesh pack and a UPS matter more when the line is already thin.",
        },
      ],
    },
    {
      key: "power",
      prompt: "What’s the modem sitting on right now?",
      hint: "A blink in the power knocks you offline even when the rest of the house looks fine.",
      options: [
        {
          value: "strip",
          label: "A regular power strip, or the wall",
          detail: "A small UPS keeps the modem up through the short drops.",
        },
        {
          value: "ups",
          label: "It already has a battery backup",
          detail: "Good. We’ll spend the money on the Wi-Fi and a cord you can run clean.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is there fiber in Palatka?",
      answer:
        "Some addresses, not as a rule. Spectrum is the default cable in town. Rural lots may see fixed wireless or satellite. If your job needs upload, test the exact street. “Palatka has fiber” is not a coverage map.",
    },
    {
      question: "Will mesh Wi-Fi fix a slow rural line?",
      answer:
        "No. Mesh spreads the signal you already have. If the line into the house is slow, that’s the provider, not the router.",
    },
    {
      question: "What about storms?",
      answer:
        "A UPS on the modem covers the short blips. A longer outage is the storm list — radio, water, a power station.",
    },
  ],
  related: [
    { to: "/storm", label: "Storm season" },
    { to: "/well", label: "If you’re on a well" },
    { to: "/house", label: "All the house lists" },
  ],
  score(a) {
    if (a.where === "east" && a.job === "upload") {
      return {
        kicker: "Acreage, and the job needs the internet",
        headline: "Test the address before you trust the listing, then cover the house.",
        body: "Out of town the line is the gamble and the walls are usually longer. Mesh won’t make a slow rural connection fast, but it will stop you from sitting in the one chair that works. A small UPS on the modem gets you through the blinks. If the job is truly upload-heavy, confirm Spectrum or whoever actually serves that street before you close.",
        points: [
          "Call the provider with the street, not the city name.",
          "Put the main node near the modem, not in the back bedroom.",
          "The storm list is what you want if the power is out for hours.",
        ],
      };
    }
    if (a.job === "upload") {
      return {
        kicker: "In town, job on the line",
        headline: "Cover the house so you’re not working from the kitchen floor.",
        body: "In Palatka city the cable is usually there. New construction still has enough drywall and distance that the builder modem doesn’t reach the spare room. Mesh, a battery on the modem, and a long ethernet cable if you can run one to the desk will save you a lot of dropped calls.",
        points: [
          "Ask Spectrum (or whoever) for the exact address before you assume speed.",
          "A desk lamp sounds small. The west room still needs it in the afternoon.",
        ],
      };
    }
    return {
      kicker: "Light use",
      headline: "You can keep this short. The modem still shouldn’t sit on a cheap strip.",
      body: "If the work is email and a browser, you don’t need a studio. A small UPS and a mesh pack (or even one extra node) make the house usable for everyone else on Wi-Fi. Run a real ethernet cable if the desk is close enough — it’s cheaper than another year of “why is it buffering.”",
      points: [
        "Spectrum is common in town. Rural addresses vary. Test if it matters.",
        "A power station for storms is on the other list.",
      ],
    };
  },
  titles(a) {
    const t = ["Mesh Wi-Fi system", "Cat 6 ethernet cable"];
    if (a.power !== "ups") t.unshift("UPS battery backup for modem");
    if (a.job === "upload") t.push("LED desk lamp");
    if (a.where === "east") t.push("UPS battery backup for modem");
    return [...new Set(t)];
  },
};

export const YARD: KitDef = {
  path: "/yard",
  kicker: "After five o’clock",
  title: "The yard before dusk",
  lede: "You’re next to a river and a lot of wetlands. The mosquitoes show up, the hose isn’t long enough, and the first time you try to sit outside you remember why people here spend money on a porch. A few questions, then the usual list.",
  seoTitle: "Palatka yard and porch: mosquitoes, a hose, and sitting outside",
  seoDescription:
    "Mosquito treatment, a long hose, an outdoor rug, a grill — the Palatka and East Palatka yard list. Amazon links; we may earn a commission.",
  breadcrumb: "The yard",
  listHeading: "For the yard and the porch",
  questions: [
    {
      key: "porch",
      prompt: "What are you actually sitting in?",
      hint: "A screened porch changes the mosquito problem. An open slab does not.",
      options: [
        {
          value: "screen",
          label: "A screened porch or lanai",
          detail: "Rug, a way to treat the yard anyway, and a hose for the plants.",
        },
        {
          value: "open",
          label: "Open patio, or just the grass",
          detail: "Treat the yard. Sit out there at dusk once before you buy furniture.",
        },
        {
          value: "none",
          label: "Nothing yet — still moving in",
          detail: "Hose and mosquitoes first. The grill can wait a week.",
        },
      ],
    },
    {
      key: "who",
      prompt: "Who’s going to be in the yard?",
      hint: "Kids and dogs change how aggressive you get with spray. Read the label.",
      options: [
        {
          value: "kids",
          label: "Kids, or dogs that live outside a lot",
          detail: "Treat the yard, keep a hose that reaches, and be careful with concentrate around pets.",
        },
        {
          value: "adults",
          label: "Mostly adults, evenings",
          detail: "A patio unit plus yard spray is what most people end up with.",
        },
      ],
    },
    {
      key: "grill",
      prompt: "Do you already have a grill?",
      hint: "Check HOA or PUD rules on The Collection before you pour a pad or park a big gas grill.",
      options: [
        { value: "no", label: "No", detail: "A small propane grill is enough for most lots." },
        { value: "yes", label: "Yes", detail: "We’ll leave it off the list." },
      ],
    },
  ],
  faqs: [
    {
      question: "Are the mosquitoes really that bad?",
      answer:
        "Next to the St. Johns and the wetlands, dusk is when you’ll notice. A treated yard and a screened porch are the two things that make evenings usable. It’s seasonal, and it’s worse after rain.",
    },
    {
      question: "Can I have a grill at The Collection?",
      answer:
        "Ask the builder and read whatever HOA papers come with the house. A small propane grill is usually simpler than a built-in. This site isn’t the HOA.",
    },
    {
      question: "What about watering new sod?",
      answer:
        "New lots, especially with well water and sandy soil, need a hose that actually reaches. Fifty feet is not overkill.",
    },
  ],
  related: [
    { to: "/summer", label: "First summer" },
    { to: "/well", label: "If you’re on a well" },
    { to: "/house", label: "All the house lists" },
  ],
  score(a) {
    if (a.porch === "open" || a.who === "kids") {
      return {
        kicker: "Open yard",
        headline: "Treat the yard before you invite anyone over at dusk.",
        body: "The river is why people move here and it’s why the mosquitoes are part of the deal. Spray or granules on a still evening, a hose that reaches the back of the lot, and something for the slab if you’ve got one. If kids or dogs are in the grass, read the product label instead of guessing.",
        points: [
          "Dusk is the test. If you can’t sit for ten minutes, treat again.",
          "Well lots need a long hose. City lots often do too, on new sod.",
          "A screened porch, if you ever add one, is the real fix.",
        ],
      };
    }
    if (a.porch === "screen") {
      return {
        kicker: "You’ve got a porch",
        headline: "Make the porch usable, and still treat the yard.",
        body: "A screened porch is half the reason to live here in summer. A washable outdoor rug and a hose for the plants go a long way. The yard still wants mosquito treatment or you’ll walk through a cloud every time you go out to the grill.",
        points: [
          "Check HOA rules before a permanent grill or a patio pour.",
          "West sun on a porch can be brutal. That’s the summer list.",
        ],
      };
    }
    return {
      kicker: "Still moving in",
      headline: "Hose and mosquitoes. Furniture can wait.",
      body: "The first week people regret skipping the hose and the mosquito treatment. The grill is fun; it isn’t the thing that makes the lot livable. If you’re on a well, the well list sits next to this one.",
      points: [
        "Fifty feet of hose is not overkill on a new lot.",
        "Sit outside at dusk once before you buy a dining set.",
      ],
    };
  },
  titles(a) {
    const t = ["Mosquito treatment for yards", "Garden hose and nozzle", "Patio mosquito repeller"];
    if (a.porch === "screen") t.push("Outdoor all-weather rug");
    if (a.porch === "open") t.push("Outdoor all-weather rug");
    if (a.grill === "no") t.push("Gas or charcoal grill");
    return t;
  },
};

export const PUNCH: KitDef = {
  path: "/punch",
  kicker: "Closing week",
  title: "The first week in a new house",
  lede: "Builder walkthroughs miss little things, and you will want a real tool kit the day you get the keys — not the one at the bottom of a box in the truck. This is the closing-week list for a Palatka house, especially The Collection.",
  seoTitle: "Closing week in Palatka: punch list and first-week tools",
  seoDescription:
    "Tool kit, caulk, an outlet tester, a step stool — the first week in a new Palatka house. Amazon links; we may earn a commission.",
  breadcrumb: "Closing week",
  listHeading: "For the keys and the walkthrough",
  questions: [
    {
      key: "when",
      prompt: "When do you get the keys?",
      hint: "The Collection at 508 N. 17th Street is the in-town product that’s actually selling. Alford Farms is still a county file.",
      options: [
        {
          value: "soon",
          label: "This month, or we already have them",
          detail: "Get the tools to the house, not in the truck under the mattress.",
        },
        {
          value: "quarter",
          label: "In the next couple of months",
          detail: "You can order this whenever. Don’t wait until the night before closing.",
        },
        {
          value: "looking",
          label: "I’m still deciding",
          detail: "Start with buy now or wait if Collection vs Alford is the question.",
        },
      ],
    },
    {
      key: "walk",
      prompt: "Have you done the builder walkthrough yet?",
      hint: "Take photos. Note paint, outlets, caulk lines, and anything that sounds hollow. They are a lot easier to argue about before you move the furniture in.",
      options: [
        {
          value: "yes",
          label: "Yes",
          detail: "Caulk, tape, and a stool for the high marks they said they’d hit.",
        },
        {
          value: "no",
          label: "Not yet",
          detail: "An outlet tester and a basic kit in your hand will make that walk useful.",
        },
        {
          value: "na",
          label: "It’s not new construction",
          detail: "Same kit, honestly. Older Palatka houses need a driver and a tester too.",
        },
      ],
    },
    {
      key: "beds",
      prompt: "Will anyone sleep there the first night?",
      hint: "Humidity and a brand-new mattress. Protectors go on before anyone lies down.",
      options: [
        {
          value: "yes",
          label: "Yes",
          detail: "Mattress protectors, a basic first-aid kit, and the tools.",
        },
        {
          value: "no",
          label: "Not the first night",
          detail: "Tools and the walkthrough stuff. Beds can wait a day.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is The Collection still selling?",
      answer:
        "Yes, as of the files this site reviews. Century Complete, 508 N. 17th Street, inside Palatka city. Starting prices have been advertised in the low $200,000s. Confirm with the builder.",
    },
    {
      question: "What about Alford Farms?",
      answer:
        "Still a Putnam PUD file, not a closing date. Don’t time a punch list to it.",
    },
    {
      question: "Will the builder leave a kit?",
      answer:
        "Sometimes a few bits. Not a real kit, not caulk that matches, and not a tester. Bring your own.",
    },
  ],
  related: [
    { to: "/summer", label: "First summer" },
    { to: "/decide", label: "Buy now or wait" },
    { to: "/house", label: "All the house lists" },
  ],
  score(a) {
    if (a.when === "looking") {
      return {
        kicker: "Still deciding",
        headline: "You don’t need a punch list until there’s a house.",
        body: "If the fork is Collection vs Alford, Collection is the one taking contracts. Alford is still in the county file. When you have a closing date, come back — the kit is a tool bag, a tester, and the first-night stuff, not a hardware-store panic.",
        points: [
          "Buy now or wait is the timeline tool on this site.",
          "A basic kit is still useful if you’re looking at older houses.",
        ],
      };
    }
    if (a.walk === "no") {
      return {
        kicker: "Before the walkthrough",
        headline: "Take a tester and a notebook. The furniture can wait in the truck.",
        body: "The walkthrough is when you catch dead outlets, missing caulk, and paint they promised to touch. A cheap receptacle tester and a real tool kit in your hands are worth more than another photo of the granite. If you’re sleeping there that night, put protectors on the beds before anyone lies down.",
        points: [
          "Photos with dates. One note per room.",
          "Century Complete is at 508 N. 17th Street if that’s the house.",
          "First summer and storm season are separate lists. Do this one first.",
        ],
      };
    }
    return {
      kicker: "Keys in hand",
      headline: "This is the bag you carry in before the sofa.",
      body: "You’ll hang something, test an outlet the kids will use, and recaulk a line they said was done. A step stool beats dragging a kitchen chair. If anyone’s sleeping there, protectors on the mattresses the first night — Palatka humidity doesn’t wait for you to unpack.",
      points: [
        "Keep the receipts from the walkthrough punch items.",
        "If you’re on a well lot, that’s a different list.",
        "Storm season is June through November. Don’t skip that page if you’re closing into it.",
      ],
    };
  },
  titles(a) {
    const t = ["Basic home tool kit", "Caulk and caulk gun", "Outlet tester", "Painter's tape", "Step stool"];
    if (a.beds === "yes") t.push("Mattress protector (waterproof)", "First-aid kit");
    if (a.when === "looking") return ["Basic home tool kit", "Outlet tester"];
    return t;
  },
};

export const KIT_PAGES = [SUMMER, WELL, OFFICE, YARD, PUNCH] as const;

export const HOUSE_CARDS: {
  to: "/storm" | "/summer" | "/well" | "/office" | "/yard" | "/punch";
  kicker: string;
  title: string;
  blurb: string;
}[] = [
  {
    to: "/storm",
    kicker: "June–November",
    title: "Storm season",
    blurb: "Water, lights, the well, and who to call when the power goes out.",
  },
  {
    to: "/summer",
    kicker: "May–October",
    title: "First summer",
    blurb: "Humidity, west glass, and the first time the closets sweat.",
  },
  {
    to: "/well",
    kicker: "East Palatka",
    title: "If you’re on a well",
    blurb: "Test kits, a hose, and drinking water when the pump is out.",
  },
  {
    to: "/office",
    kicker: "The desk",
    title: "Working from the lot",
    blurb: "Mesh Wi-Fi, a battery for the modem, a cord that reaches.",
  },
  {
    to: "/yard",
    kicker: "After five",
    title: "The yard before dusk",
    blurb: "Mosquitoes, a long hose, and sitting outside without giving up.",
  },
  {
    to: "/punch",
    kicker: "Closing week",
    title: "The first week in a new house",
    blurb: "Tools, a tester, caulk, and the beds the first night.",
  },
];
