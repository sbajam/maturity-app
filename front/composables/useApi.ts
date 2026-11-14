import { createApi } from '~/services/api'

export function useApi() {
  const config = useRuntimeConfig()
  return createApi(import.meta.server ? config.apiBase : config.public.apiBase)
}
