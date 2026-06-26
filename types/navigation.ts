export interface NavigationItem {
    title: string
    icon?: string
    to?: string
    children?: NavigationItem[]
}