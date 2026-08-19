import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ProjectFocusValue = {
  slug: string | null;
  setSlug: (slug: string | null) => void;
  visible: Set<string> | null;
};

const ProjectFocusContext = createContext<ProjectFocusValue | null>(null);

export function ProjectFocusProvider({
  children,
  visibleSlugs,
}: {
  children: ReactNode;
  visibleSlugs?: string[];
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const visible = useMemo(
    () => (visibleSlugs ? new Set(visibleSlugs) : null),
    [visibleSlugs],
  );
  return (
    <ProjectFocusContext.Provider value={{ slug, setSlug, visible }}>
      {children}
    </ProjectFocusContext.Provider>
  );
}

export function useProjectFocus() {
  return useContext(ProjectFocusContext);
}
