import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Tabs from "@radix-ui/react-tabs";
import { FileText, MapPin, Search, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountyMap } from "@/components/projects/county-map";
import { ProjectFocusProvider, useProjectFocus } from "@/lib/project-focus";
import { ProductBlock } from "@/components/guide/product-block";
import {
  EXISTING_MARKET_SLUGS,
  PIPELINE_STATUSES,
  STATUS_META,
  STATUS_ORDER,
} from "@/lib/constants";
import { formatDateShort, formatMoney, formatNumber } from "@/lib/format";
import type { fetchHome } from "@/lib/data/api";
import type { Project, ProjectUpdate } from "@/lib/types";

type HomeData = Awaited<ReturnType<typeof fetchHome>>;
type Filter = "all" | "selling" | "pipeline" | "context";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All projects" },
  { key: "selling", label: "Selling now" },
  { key: "pipeline", label: "In the pipeline" },
  { key: "context", label: "Existing areas" },
];
function matchesFilter(p: Project, filter: Filter) {
  if (filter === "selling") return p.status === "selling" && !EXISTING_MARKET_SLUGS.has(p.slug);
  if (filter === "pipeline") return PIPELINE_STATUSES.includes(p.status);
  if (filter === "context") return EXISTING_MARKET_SLUGS.has(p.slug) || p.status === "built_out";
  return true;
}
function confidenceLabel(project: Project) {
  return project.confidence === "confirmed"
    ? "Public record"
    : project.confidence === "watch"
      ? "Watch list"
      : "Reported";
}
function statusClass(project: Project) {
  return project.status === "selling"
    ? "phr-selling"
    : project.status === "permitting"
      ? "phr-permit"
      : project.status === "built_out"
        ? "phr-established"
        : "phr-watch";
}
function ProjectStatus({ project }: { project: Project }) {
  return (
    <span className={`phr-badge ${statusClass(project)}`}>{STATUS_META[project.status].label}</span>
  );
}
function StageBar({ project }: { project: Project }) {
  const step = STATUS_META[project.status].step;
  return (
    <>
      <div className="phr-card-progress" aria-hidden="true">
        {STATUS_ORDER.map((status, i) => (
          <span
            key={status}
            className={i < step ? "phr-done" : i === step ? "phr-current" : undefined}
          />
        ))}
      </div>
      <div className="phr-stage-row">
        <span>
          Stage {step + 1} of 8 · {STATUS_META[project.status].label}
        </span>
        <span>{confidenceLabel(project)}</span>
      </div>
    </>
  );
}
function ProjectCard({
  project,
  number,
  onOpen,
}: {
  project: Project;
  number: number;
  onOpen: (p: Project, trigger: HTMLButtonElement) => void;
}) {
  const focus = useProjectFocus();
  return (
    <article
      className="phr-project-card"
      onMouseEnter={() => focus?.setSlug(project.slug)}
      onMouseLeave={() => focus?.setSlug(null)}
    >
      <div className="phr-card-top">
        <span className="phr-project-number">FILE / {String(number).padStart(2, "0")}</span>
        <ProjectStatus project={project} />
      </div>
      <span className="phr-card-region">{project.area}</span>
      <h3>{project.name}</h3>
      <p className="phr-card-address">{project.locationLabel}</p>
      <p className="phr-card-description">
        {project.latestSummary || STATUS_META[project.status].hint}
      </p>
      <StageBar project={project} />
      <div className="phr-card-footer">
        <span>{EXISTING_MARKET_SLUGS.has(project.slug) ? "Area context" : "Project file"}</span>
        <button
          type="button"
          onClick={(e) => onOpen(project, e.currentTarget)}
          aria-label={`Read the ${project.name} project brief`}
        >
          Project brief <span aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  );
}
const TIMELINES = [
  {
    key: "now",
    title: "I need a home soon",
    subtitle: "Focus on what’s available.",
    label: "AVAILABLE HOMES",
    heading: "Start with the homes listed as selling.",
    body: "Check the exact home, completion date, and current price with the builder. An advertised community and a move-in-ready home can mean different timelines.",
    points: ["Confirm live inventory", "Ask for a completion date", "Check the specific address"],
    action: "Explore selling communities",
    filter: "selling" as Filter,
  },
  {
    key: "later",
    title: "I’m planning ahead",
    subtitle: "Understand the pipeline.",
    label: "THE PIPELINE",
    heading: "Watch the milestones that matter.",
    body: "Follow project files through permitting, recorded plats, and a sales opening. Keep your moving plans flexible until the builder can confirm your home and timeline.",
    points: ["Follow public records", "Check the latest milestone", "Keep your timing flexible"],
    action: "Explore pipeline projects",
    filter: "pipeline" as Filter,
  },
  {
    key: "local",
    title: "I’m getting to know the area",
    subtitle: "Look beyond the listing.",
    label: "THE LOCAL DETAILS",
    heading: "Get to know the address, too.",
    body: "Look at the details that shape everyday life: water and sewer, school assignment, flood information, and the commute you would actually make.",
    points: ["Understand utilities", "Check school boundaries", "Try your commute"],
    action: "Open the address field guide",
    filter: null,
  },
];

export function EditorialHome({ data }: { data: HomeData }) {
  const { projects, featured, stats, faqs, updates, market, products } = data;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<ProjectUpdate | null>(null);
  const [timeline, setTimeline] = useState("now");
  const dialogTrigger = useRef<HTMLButtonElement | null>(null);
  const explorer = useRef<HTMLElement | null>(null);
  const priority = ["alford-farms", "collection-at-palatka", "nobles-crossing"];
  const ordered = useMemo(
    () =>
      [...projects].sort((a, b) => {
        const aRank = priority.indexOf(a.slug),
          bRank = priority.indexOf(b.slug);
        return (aRank < 0 ? 99 : aRank) - (bRank < 0 ? 99 : bRank);
        // The priority is a fixed presentation order; project facts remain server supplied.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }),
    [projects],
  );
  const matching = ordered.filter(
    (p) =>
      matchesFilter(p, filter) &&
      `${p.name} ${p.area} ${p.locationLabel} ${p.builder ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const featuredView = filter === "all" && !query.trim() && !expanded;
  const visible = featuredView ? matching.slice(0, 3) : matching;
  const focusProject = projects.find((p) => p.slug === "alford-farms") ?? featured;
  function jumpToFilter(next: Filter) {
    setFilter(next);
    setQuery("");
    setExpanded(true);
    explorer.current?.scrollIntoView({ behavior: "smooth" });
  }
  function openProject(project: Project, trigger: HTMLButtonElement) {
    dialogTrigger.current = trigger;
    setSelectedProject(project);
  }
  function restoreDialogFocus(event: Event) {
    event.preventDefault();
    dialogTrigger.current?.focus();
  }

  return (
    <main className="phr-home">
      <section className="phr-hero" aria-labelledby="hero-title">
        <div className="phr-hero-copy">
          <div className="phr-eyebrow phr-light">
            <span className="phr-tiny-line" />
            KNOW THE PLACE. SEE THE POSSIBILITIES.
          </div>
          <h1 id="hero-title">
            A clearer view
            <br />
            of <em>what’s next.</em>
          </h1>
          <p>
            New homes. Local growth. Life by the river.
            <br />
            Make your next move with the whole picture.
          </p>
          <div className="phr-hero-actions">
            <a className="phr-button phr-lime" href="#developments">
              Explore developments
            </a>
            <a className="phr-text-link phr-light-link" href="#your-move">
              Find your starting point
            </a>
          </div>
          <div className="phr-hero-trust">
            <ShieldCheck aria-hidden="true" />
            Independent reporting. A local perspective.
          </div>
        </div>
        <div className="phr-hero-image">
          <img
            src="/images/editorial/river.jpg"
            alt="Memorial Bridge crossing the St. Johns River at Palatka, Florida"
            fetchPriority="high"
            width={1500}
            height={1125}
          />
          <div className="phr-image-topline">
            <span>29.6478° N · 81.6315° W</span>
            <span className="phr-image-label">THE RIVER CITY</span>
          </div>
          <div className="phr-river-caption">
            <span>ROOTED HERE.</span>
            <strong>
              Room for your
              <br />
              next chapter.
            </strong>
            <span className="phr-location">
              <MapPin aria-hidden="true" />
              St. Johns River · Palatka, Florida
            </span>
          </div>
          <div className="phr-photo-index">01 / THE PLACE WE CALL HOME</div>
        </div>
      </section>
      <section className="phr-snapshot phr-container" aria-label="The report at a glance">
        <div className="phr-snapshot-intro">
          <span className="phr-eyebrow">THE BIG PICTURE</span>
          <h2>
            A community
            <br />
            in motion.
          </h2>
        </div>
        <div className="phr-snapshot-stat">
          <strong>
            {String(stats.projectCount).padStart(2, "0")}
            <span> /</span>
          </strong>
          <span>Project files to explore</span>
        </div>
        <div className="phr-snapshot-stat">
          <strong>
            {String(stats.pipelineCount).padStart(2, "0")}
            <span> /</span>
          </strong>
          <span>Pipeline &amp; watch-list projects</span>
        </div>
        <div className="phr-snapshot-note">
          <FileText aria-hidden="true" />
          <p>
            Public records.
            <br />
            Useful context.
            <br />
            <b>Your next move.</b>
          </p>
        </div>
      </section>
      {!!products.length && (
        <section className="phr-home-essentials">
          <div className="phr-container">
            <div className="phr-section-heading">
              <div>
                <span className="phr-eyebrow">CLOSING OR MOVING SOON?</span>
                <h2>
                  A few things
                  <br />
                  for day one.
                </h2>
              </div>
              <Link to="/house" className="phr-text-link">
                Shop all home essentials
              </Link>
            </div>
            <ProductBlock products={products} heading="Start with these essentials" grid />
          </div>
        </section>
      )}
      <ProjectFocusProvider>
        <section className="phr-section phr-projects-section" id="developments" ref={explorer}>
          <div className="phr-container">
            <div className="phr-section-heading">
              <div>
                <span className="phr-eyebrow">01 / ON THE GROUND</span>
                <h2>
                  What’s happening
                  <br />
                  around here.
                </h2>
              </div>
              <p>
                From homes listed as selling to plans worth watching. See where each project stands.
              </p>
            </div>
            <div className="phr-project-toolbar">
              <div className="phr-filters" role="group" aria-label="Filter project files">
                {FILTERS.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={`phr-filter ${filter === item.key ? "phr-active" : ""}`}
                    aria-pressed={filter === item.key}
                    onClick={() => {
                      setFilter(item.key);
                      setExpanded(true);
                    }}
                  >
                    {item.label}
                    <span>{projects.filter((p) => matchesFilter(p, item.key)).length}</span>
                  </button>
                ))}
              </div>
              <label className="phr-search-box">
                <Search aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search a project or place"
                  aria-label="Search a project or place"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="phr-project-grid">
              {visible.map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  number={ordered.indexOf(p) + 1}
                  onOpen={openProject}
                />
              ))}
              {!visible.length && (
                <div className="phr-empty-results">
                  <h3>No matching project files.</h3>
                  <p>Try a place name, or clear the filters to see every file.</p>
                  <button
                    type="button"
                    className="phr-button phr-dark"
                    onClick={() => {
                      setFilter("all");
                      setQuery("");
                      setExpanded(true);
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <div className="phr-projects-bottom">
              <p role="status">
                {featuredView
                  ? `Showing ${visible.length} of ${matching.length} project files`
                  : `${matching.length} project ${matching.length === 1 ? "file" : "files"} found`}
              </p>
              {filter === "all" && !query.trim() && matching.length > 3 && (
                <button
                  type="button"
                  className="phr-text-link"
                  onClick={() => {
                    setExpanded((v) => !v);
                    if (expanded) explorer.current?.scrollIntoView();
                  }}
                >
                  {expanded
                    ? "Show featured projects"
                    : `Show all ${projects.length} project files`}
                  <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                </button>
              )}
            </div>
            <p className="phr-data-note">
              Public-record milestones, reported availability, and watch-list entries are labeled
              separately. Existing-area files provide context; they are not all new subdivisions.
            </p>
            <div className="phr-map-toggle">
              <button
                type="button"
                className="phr-text-link"
                aria-expanded={showMap}
                aria-controls="homepage-project-map"
                onClick={() => setShowMap((v) => !v)}
              >
                {showMap ? "Hide the area map" : "See projects on the map"}
                <span aria-hidden="true">{showMap ? "−" : "+"}</span>
              </button>
              <Link to="/developments" className="phr-text-link">
                Open the complete development directory
              </Link>
            </div>
            <div id="homepage-project-map" hidden={!showMap}>
              {showMap && <CountyMap projects={projects} />}
            </div>
          </div>
        </section>
      </ProjectFocusProvider>
      {focusProject && (
        <section className="phr-spotlight-section" aria-labelledby="spotlight-title">
          <div className="phr-container phr-spotlight">
            <div className="phr-spotlight-main">
              <div className="phr-eyebrow phr-light">
                <span className="phr-tiny-line" />
                THE DEVELOPMENT TO WATCH
              </div>
              <h2 id="spotlight-title">
                Big plans.
                <br />
                The details matter.
              </h2>
              <p>
                Follow {focusProject.name} through the public file. Check the latest recorded step
                before making it part of your moving plans.
              </p>
              <button
                type="button"
                className="phr-button phr-lime"
                onClick={(e) => openProject(focusProject, e.currentTarget)}
              >
                Get the {focusProject.name} brief
              </button>
            </div>
            <div className="phr-spotlight-file">
              <div className="phr-file-top">
                <span>IN FOCUS / {focusProject.area.toUpperCase()}</span>
                <ProjectStatus project={focusProject} />
              </div>
              <h3>{focusProject.name}</h3>
              <p>{focusProject.locationLabel}</p>
              <div className="phr-file-metrics">
                <div>
                  <strong>{formatNumber(focusProject.lotsCurrent)}</strong>
                  <span>Lots in the reported layout</span>
                </div>
                <div>
                  <strong>{formatNumber(focusProject.acres)}</strong>
                  <span>Approximate acres</span>
                </div>
              </div>
              <div className="phr-spotlight-stage">
                <span className="phr-eyebrow">CURRENT FILE POSITION</span>
                <h4>{STATUS_META[focusProject.status].label}</h4>
                <StageBar project={focusProject} />
                <p>{STATUS_META[focusProject.status].hint}</p>
              </div>
              <div className="phr-file-foot">
                {confidenceLabel(focusProject)} · Source summary{" "}
                {formatDateShort(focusProject.latestSummaryAt)}
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="phr-section phr-decision-section" id="your-move">
        <div className="phr-container">
          <div className="phr-section-heading">
            <div>
              <span className="phr-eyebrow">02 / YOUR NEXT MOVE</span>
              <h2>
                Different timelines.
                <br />
                Better starting points.
              </h2>
            </div>
            <p>
              Start with what matters to you. Find the details that help you take the next step.
            </p>
          </div>
          <Tabs.Root
            value={timeline}
            onValueChange={setTimeline}
            orientation="vertical"
            className="phr-decision-layout"
          >
            <Tabs.List className="phr-decision-tabs" aria-label="Choose your moving timeline">
              {TIMELINES.map((item, i) => (
                <Tabs.Trigger key={item.key} value={item.key}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    {item.title}
                    <small>{item.subtitle}</small>
                  </div>
                  <span className="phr-tab-mark" aria-hidden="true">
                    {timeline === item.key ? "−" : "+"}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {TIMELINES.map((item) => (
              <Tabs.Content key={item.key} value={item.key} className="phr-decision-panel">
                <span className="phr-panel-label">YOUR STARTING POINT / {item.label}</span>
                <h3>{item.heading}</h3>
                <p>{item.body}</p>
                <div className="phr-panel-points">
                  {item.points.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
                {item.filter ? (
                  <button
                    type="button"
                    className="phr-text-link"
                    onClick={() => jumpToFilter(item.filter!)}
                  >
                    {item.action}
                  </button>
                ) : (
                  <Link to="/address" className="phr-text-link">
                    {item.action}
                  </Link>
                )}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </section>
      <section className="phr-living-section" id="living">
        <div className="phr-container phr-living-layout">
          <div className="phr-living-visual">
            <img
              src="/images/editorial/gardens.jpg"
              width={1100}
              height={1100}
              alt="Stone steps and ferns at Ravine Gardens State Park in Palatka"
              loading="lazy"
            />
            <div>
              <span className="phr-eyebrow phr-light">A LITTLE MORE LOCAL</span>
              <h2>
                There’s life
                <br />
                beyond the
                <br />
                front door.
              </h2>
              <span>Ravine Gardens · Palatka, Florida</span>
            </div>
          </div>
          <div className="phr-living-content">
            <span className="phr-eyebrow">03 / LIFE AROUND HERE</span>
            <h2>
              Get to know
              <br />
              your everyday.
            </h2>
            <p>
              A home is also your commute, your weekend, and the details that make an address work.
            </p>
            <div className="phr-guide-list">
              <Link to="/address">
                <span className="phr-guide-number">01</span>
                <span>
                  <strong>Start with the address</strong>
                  <small>Flood maps, utilities &amp; school boundaries</small>
                </span>
                <span className="phr-guide-plus" aria-hidden="true">
                  +
                </span>
              </Link>
              <Link to="/move">
                <span className="phr-guide-number">02</span>
                <span>
                  <strong>Make your move smoother</strong>
                  <small>A practical moving &amp; closing checklist</small>
                </span>
                <span className="phr-guide-plus" aria-hidden="true">
                  +
                </span>
              </Link>
              <Link to="/house">
                <span className="phr-guide-number">03</span>
                <span>
                  <strong>Settle into your Florida home</strong>
                  <small>Humidity, storms &amp; the first few weeks</small>
                </span>
                <span className="phr-guide-plus" aria-hidden="true">
                  +
                </span>
              </Link>
              <Link to="/guide/$slug" params={{ slug: "outdoors" }}>
                <span className="phr-guide-number">04</span>
                <span>
                  <strong>Find your kind of weekend</strong>
                  <small>The river, the gardens &amp; downtown</small>
                </span>
                <span className="phr-guide-plus" aria-hidden="true">
                  +
                </span>
              </Link>
            </div>
            <Link to="/guide" className="phr-text-link phr-all-guides">
              Explore every local guide
            </Link>
          </div>
        </div>
      </section>
      <section className="phr-section phr-latest-section" id="latest">
        <div className="phr-container">
          <div className="phr-section-heading">
            <div>
              <span className="phr-eyebrow">04 / THE NOTEBOOK</span>
              <h2>
                The stories behind
                <br />
                the changing landscape.
              </h2>
            </div>
            <Link className="phr-text-link" to="/whats-new">
              Open the complete update log
            </Link>
          </div>
          <div className="phr-latest-grid">
            {updates.slice(0, 2).map((update, i) => (
              <button
                type="button"
                className="phr-story-card"
                key={update.id}
                onClick={(e) => {
                  dialogTrigger.current = e.currentTarget;
                  setSelectedUpdate(update);
                }}
              >
                <div className="phr-story-meta">
                  <span>{update.projectName ? "PROJECT WATCH" : "LOCAL UPDATE"}</span>
                  <time dateTime={update.createdAt}>{formatDateShort(update.createdAt)}</time>
                </div>
                <span className="phr-story-index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{update.title}</h3>
                <p>{update.body}</p>
                <span className="phr-story-read">
                  Read the brief <span aria-hidden="true">+</span>
                </span>
              </button>
            ))}
            <Link to="/address" className="phr-story-card phr-feature-story">
              <div className="phr-story-meta">
                <span>THE LOCAL FIELD GUIDE</span>
                <span>ESSENTIAL READING</span>
              </div>
              <span className="phr-story-index">
                {String(Math.min(updates.length, 2) + 1).padStart(2, "0")}
              </span>
              <h3>
                One area.
                <br />
                Very different addresses.
              </h3>
              <p>
                City services, a private well, school zones. The small details can change the big
                decision.
              </p>
              <span className="phr-story-read">
                Open the guide <span aria-hidden="true">+</span>
              </span>
            </Link>
          </div>
          {!updates.length && (
            <p className="phr-data-note">
              No dated updates are available yet. Explore the project files for the current report.
            </p>
          )}
        </div>
      </section>
      {market && (
        <section className="phr-section phr-market-section">
          <div className="phr-container">
            <div className="phr-section-heading">
              <div>
                <span className="phr-eyebrow">
                  HOUSING SNAPSHOT / {formatDateShort(market.capturedOn)}
                </span>
                <h2>
                  Put the numbers
                  <br />
                  in perspective.
                </h2>
              </div>
              <Link to="/guide/$slug" params={{ slug: "cost-of-living" }} className="phr-text-link">
                Explore the cost-of-living guide
              </Link>
            </div>
            <div className="phr-market-grid">
              <div>
                <span>Published market-report range</span>
                <strong>
                  {formatMoney(market.medianSaleLow)}–{formatMoney(market.medianSaleHigh)}
                </strong>
              </div>
              <div>
                <span>Reported days on market</span>
                <strong>{formatNumber(market.daysOnMarket)}</strong>
              </div>
            </div>
            <p className="phr-market-note">{market.medianNote}</p>
            <p className="phr-data-note">{market.sourceNote}</p>
          </div>
        </section>
      )}
      {!!faqs.length && (
        <section className="phr-faq-section">
          <div className="phr-container phr-faq-layout">
            <div>
              <span className="phr-eyebrow">A FEW GOOD QUESTIONS</span>
              <h2>
                Let’s clear
                <br />
                things up.
              </h2>
            </div>
            <div>
              <Accordion type="single" collapsible className="phr-faq-accordion">
                {faqs.map((faq) => (
                  <AccordionItem value={String(faq.id)} key={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Link to="/faq" className="phr-text-link phr-all-guides">
                Read all common questions
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="phr-closing-section">
        <div className="phr-container phr-closing-inner">
          <div>
            <span className="phr-eyebrow">LOCAL KNOWLEDGE. BIG POSSIBILITIES.</span>
            <h2>Get the lay of the land.</h2>
          </div>
          <a className="phr-button phr-dark" href="#developments">
            Find your next starting point
          </a>
        </div>
      </section>
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DialogContent
          className="phr-detail"
          aria-describedby="project-brief-description"
          onCloseAutoFocus={restoreDialogFocus}
        >
          {selectedProject && (
            <>
              <ProjectStatus project={selectedProject} />
              <DialogTitle className="phr-detail-title">{selectedProject.name}</DialogTitle>
              <p className="phr-dialog-subtitle">
                {selectedProject.locationLabel} · {selectedProject.area}
              </p>
              <p id="project-brief-description" className="phr-detail-summary">
                {selectedProject.latestSummary || STATUS_META[selectedProject.status].hint}
              </p>
              <dl className="phr-dialog-facts">
                <div>
                  <dt>Builder / agent</dt>
                  <dd>{selectedProject.builder || "Not confirmed"}</dd>
                </div>
                <div>
                  <dt>Lots in reported layout</dt>
                  <dd>{formatNumber(selectedProject.lotsCurrent)}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>{confidenceLabel(selectedProject)}</dd>
                </div>
                <div>
                  <dt>Source summary</dt>
                  <dd>{formatDateShort(selectedProject.latestSummaryAt)}</dd>
                </div>
              </dl>
              <StageBar project={selectedProject} />
              <div className="phr-dialog-note">
                {EXISTING_MARKET_SLUGS.has(selectedProject.slug)
                  ? "This file provides existing-area context. Review the specific property and current public records."
                  : STATUS_META[selectedProject.status].hint}
              </div>
              <Link
                className="phr-button phr-dark"
                to="/developments/$slug"
                params={{ slug: selectedProject.slug }}
                onClick={() => setSelectedProject(null)}
              >
                Open the full project file
              </Link>
              <p className="phr-source-note">
                County and agency records take priority. Verify availability, dates, and terms with
                the builder or seller.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selectedUpdate}
        onOpenChange={(open) => {
          if (!open) setSelectedUpdate(null);
        }}
      >
        <DialogContent
          className="phr-detail"
          aria-describedby="update-brief-description"
          onCloseAutoFocus={restoreDialogFocus}
        >
          {selectedUpdate && (
            <>
              <span className="phr-eyebrow">
                THE NOTEBOOK / {formatDateShort(selectedUpdate.createdAt)}
              </span>
              <DialogTitle className="phr-detail-title">{selectedUpdate.title}</DialogTitle>
              <p id="update-brief-description" className="phr-detail-summary">
                {selectedUpdate.body}
              </p>
              <p className="phr-source-note">
                Source: {selectedUpdate.sourceLabel || "Palatka Homes Report"}
              </p>
              {selectedUpdate.projectSlug ? (
                <Link
                  className="phr-button phr-dark"
                  to="/developments/$slug"
                  params={{ slug: selectedUpdate.projectSlug }}
                  onClick={() => setSelectedUpdate(null)}
                >
                  Open the project file
                </Link>
              ) : (
                <Link
                  className="phr-button phr-dark"
                  to="/whats-new"
                  onClick={() => setSelectedUpdate(null)}
                >
                  Read the update log
                </Link>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
