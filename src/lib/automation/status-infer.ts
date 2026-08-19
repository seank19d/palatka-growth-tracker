export const STATUS_RANK: Record<string, number> = {
  concept: 0,
  rezoning: 1,
  engineering: 2,
  permitting: 3,
  plat_recorded: 4,
  under_construction: 5,
  selling: 6,
  built_out: 7,
};

export function inferStatus(text: string): string | null {
  const t = text.toLowerCase();
  if (/\b(built[- ]out|fully developed|last lot sold)\b/.test(t)) return "built_out";
  if (/\b(now selling|homes for sale|model home|grand opening|taking contracts|lot sales open)\b/.test(t))
    return "selling";
  if (/\b(under construction|groundbreaking|site work|vertical construction|framing)\b/.test(t))
    return "under_construction";
  if (/\b(plat recorded|final plat|plat approved|lots recorded)\b/.test(t)) return "plat_recorded";
  if (/\b(building permit|environmental permit|stormwater permit|permit issued|permit approved)\b/.test(t))
    return "permitting";
  if (/\b(site plan|engineering plans|construction documents|civil plans)\b/.test(t)) return "engineering";
  if (/\b(rezoning approved|pud approved|ordinance|land use change approved)\b/.test(t)) return "rezoning";
  if (/\b(rezoning|pud application|planned unit development)\b/.test(t)) return "rezoning";
  return null;
}
