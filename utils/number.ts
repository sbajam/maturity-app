// Numeric averaging helper.
export function average(
    values: number[],
    digits = 1,
) {
    if (!values.length)
        return 0

    const total = values.reduce(
        (sum, value) => sum + value,
        0,
    )

    return Number(
        (total / values.length).toFixed(digits),
    )
}