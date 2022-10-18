import dayjs from 'dayjs'

export function formatDate({ date, formatString = 'YYYY/MM/DD' }) {
    if (!date) return ''
    return dayjs(date).format(formatString)
}
