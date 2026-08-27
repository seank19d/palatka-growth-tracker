import { createServerFn } from "@tanstack/react-start";

export const fetchHome = createServerFn({ method: "GET" }).handler(async () => {
  const { getHomeData } = await import("./queries.server");
  return getHomeData();
});

export const fetchProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedProjects } = await import("./queries.server");
  return listPublishedProjects();
});

export const fetchProjectPage = createServerFn({ method: "GET" })
  .validator((slug: unknown) => String(slug ?? ""))
  .handler(async ({ data: slug }) => {
    const { getProjectBySlug, getMilestones, getUpdates, getProducts } = await import("./queries.server");
    const project = await getProjectBySlug(slug);
    if (!project) return null;
    const [milestones, updates, allProducts] = await Promise.all([
      getMilestones(project.id),
      getUpdates(8, project.id),
      project.status === "selling" ? getProducts() : Promise.resolve([]),
    ]);
    const products = allProducts.filter((p) => p.sortOrder <= 8);
    return { project, milestones, updates, products };
  });

export const fetchGuideHub = createServerFn({ method: "GET" }).handler(async () => {
  const { listGuides, listPublishedProjects } = await import("./queries.server");
  const { PIPELINE_STATUSES } = await import("@/lib/constants");
  const [guides, projects] = await Promise.all([listGuides(), listPublishedProjects()]);
  return {
    guides,
    pipeline: projects.filter((p) => PIPELINE_STATUSES.includes(p.status)),
  };
});

export const fetchGuidePage = createServerFn({ method: "GET" })
  .validator((slug: unknown) => String(slug ?? ""))
  .handler(async ({ data: slug }) => {
    const { getGuide, listGuides, getProducts } = await import("./queries.server");
    const [page, nav] = await Promise.all([getGuide(slug), listGuides()]);
    if (!page) return null;
    const products = page.affiliateCategory ? await getProducts(page.affiliateCategory) : [];
    return { page, nav, products };
  });

export const fetchUpdates = createServerFn({ method: "GET" }).handler(async () => {
  const { getUpdates } = await import("./queries.server");
  return getUpdates(40);
});

export const fetchFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { listFaqs } = await import("./queries.server");
  return listFaqs();
});

export const fetchDecide = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedProjects, getProducts } = await import("./queries.server");
  const [projects, products] = await Promise.all([listPublishedProjects(), getProducts()]);
  return { projects, products };
});

export const fetchSitemapData = createServerFn({ method: "GET" }).handler(async () => {
  const { getSitemapEntries } = await import("./queries.server");
  return getSitemapEntries();
});
