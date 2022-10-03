import dayjs from 'dayjs'

export function formatTimestamp({
    timestampSecond,
    formatString = 'YYYY/MM/DD HH:mm',
}) {
    if (!timestampSecond) return ''
    return dayjs.unix(timestampSecond).format(formatString)
}

export function formaDate({ date, formatString = 'YYYY/MM/DD' }) {
    if (!date) return ''
    return dayjs(date).format(formatString)
}
