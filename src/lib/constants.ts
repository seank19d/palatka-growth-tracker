import type { ProjectStatus } from "./types";

export const APP_NAME = "Palatka Growth Tracker";
export const APP_TAGLINE = "Palatka is growing. Here's the paper trail.";
export const APP_DESCRIPTION =
  "Independent tracker of planned and active housing in Palatka, East Palatka, and Putnam County, Florida — plus a practical field guide for people actually moving here.";

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; step: number; hint: string }
> = {
  concept: {
    label: "Concept",
    step: 0,
    hint: "Talk, rumors, or a pretty site plan. No county entitlement yet.",
  },
  rezoning: {
    label: "Rezoning",
    step: 1,
    hint: "Land-use change is in front of planning staff or the commission.",
  },
  engineering: {
    label: "Engineering",
    step: 2,
    hint: "Site plans, grading, and construction documents are in motion.",
  },
  permitting: {
    label: "Permitting",
    step: 3,
    hint: "Environmental, stormwater, or building permits are under review.",
  },
  plat_recorded: {
    label: "Plat recorded",
    step: 4,
    hint: "Lots exist on the official plat. Still not the same as homes for sale.",
  },
  under_construction: {
    label: "Under construction",
    step: 5,
    hint: "Dirt is moving, or walls are going up. You can drive by and see it.",
  },
  selling: {
    label: "Selling",
    step: 6,
    hint: "A builder or seller is taking contracts. Still verify the address.",
  },
  built_out: {
    label: "Built-out",
    step: 7,
    hint: "Mostly done. Remaining activity is infill, resales, and the HOA.",
  },
};

export const STATUS_ORDER = Object.keys(STATUS_META) as ProjectStatus[];

export const AREAS = ["East Palatka", "Palatka", "Putnam County"] as const;

export const DISCLOSURE =
  "Some links on this site are affiliate links, including Amazon Associates. If you buy through them, we may earn a commission at no extra cost to you. We are not a real-estate brokerage, not affiliated with Putnam County, and not a builder. Always verify status with county records and licensed professionals.";

export const PIPELINE_STATUSES: ProjectStatus[] = [
  "concept",
  "rezoning",
  "engineering",
  "permitting",
  "plat_recorded",
  "under_construction",
  "selling",
];
