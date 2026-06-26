export function formatDate(
    date?: string,
    locale = "en-US",
) {
    if (!date)
        return "-"

    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
    }).format(new Date(date))
}