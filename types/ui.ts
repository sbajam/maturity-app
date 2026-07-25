// Shared UI types: badge variants, select options, and data table column config.
export type BadgeVariant =
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "neutral"

export interface SelectOption {
    label: string
    value: string | number
}

export interface DataTableColumn<T> {
  id: string

  accessor?: Extract<keyof T, string>

  label: string

  width?: string

  align?: "left" | "center" | "right"

  sortable?: boolean

  hidden?: boolean
}