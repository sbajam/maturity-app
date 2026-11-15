// Formatting and color-mapping helpers for maturity scores, confidence, and heatmap tiles.
/** Format Likert score for display (e.g. 3.8 / 5) */
export function formatScore(score?: number | null): string {
  if (score === undefined || score === null)
    return "—"

  return `${score.toFixed(1)} / 5`
}

/** Format confidence as percentage (0.94 → 94%) */
export function formatConfidence(confidence: number | null | undefined): string {
  if (confidence === null || confidence === undefined) return "—"
  const value = confidence <= 1
    ? confidence * 100
    : confidence

  return `${Math.round(value)}%`
}

/** Map maturity level to heatmap color class */
export function getMaturityColorClass(level: number | null): string {
  if (level === null) return "bg-slate-300"

  if (level >= 4)
    return "bg-green-500"

  if (level >= 3)
    return "bg-amber-400"

  if (level >= 2)
    return "bg-orange-500"

  return "bg-red-500"
}

/** Map maturity level to text color class */
export function getMaturityTextClass(level: number | null): string {
  if (level === null) return "text-slate-500"

  if (level >= 4)
    return "text-green-700"

  if (level >= 3)
    return "text-amber-600"

  if (level >= 2)
    return "text-orange-600"

  return "text-red-600"
}

/** Soft card background + text for heatmap tiles */
export function getMaturityTileClass(level: number | null): string {
  if (level === null) return "border-slate-200 bg-slate-50 text-slate-500"

  if (level >= 4)
    return "border-green-200 bg-green-100 text-green-900"

  if (level >= 3)
    return "border-amber-200 bg-amber-100 text-amber-900"

  if (level >= 2)
    return "border-orange-200 bg-orange-100 text-orange-900"

  return "border-red-200 bg-red-100 text-red-900"
}

/** Subtle row background for heatmap table */
export function getMaturityHeatmapRowClass(level: number | null): string {
  if (level === null) return "bg-slate-50"

  if (level >= 4)
    return "bg-green-50 hover:bg-green-100/90"

  if (level >= 3)
    return "bg-amber-50 hover:bg-amber-100/90"

  if (level >= 2)
    return "bg-orange-50 hover:bg-orange-100/90"

  return "bg-red-50 hover:bg-red-100/90"
}

/** Strong cell fill for heatmap score blocks */
export function getMaturityHeatmapCellClass(level: number | null): string {
  if (level === null) return "bg-slate-200 text-slate-700"

  if (level >= 4)
    return "bg-green-500 text-white"

  if (level >= 3)
    return "bg-amber-400 text-amber-950"

  if (level >= 2)
    return "bg-orange-500 text-white"

  return "bg-red-500 text-white"
}

/** Map maturity level to badge variant */
export function getMaturityBadgeVariant(
  level: number | null,
): "success" | "warning" | "danger" | "neutral" {
  if (level === null) return "neutral"
  if (level >= 4)
    return "success"

  if (level >= 3)
    return "warning"

  if (level >= 2)
    return "warning"

  return "danger"
}
