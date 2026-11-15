/**
 * The existing Nuxt project exposes `runtimeConfig.public.demoMode`.
 * Vendow V2 initially introduced `appMode`, but restoring the original
 * nuxt.config.ts removed that new key. Support both without modifying Nuxt
 * routing, CSS, or the configuration file.
 *
 * An explicitly configured real mode wins over the legacy demo flag.
 * Backend independently enforces the demo database restriction.
 */
export function useAppMode(): boolean {
  const config = useRuntimeConfig().public as Record<string, unknown>

  if (config.appMode === 'demo') return true
  if (config.appMode === 'real') return false

  return config.demoMode === true
    || config.demoMode === 'true'
    || config.demoMode === '1'
}
