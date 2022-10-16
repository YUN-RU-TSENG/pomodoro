import dayjs from 'dayjs'

export function formaDate({ date, formatString = 'YYYY/MM/DD' }) {
    if (!date) return ''
    return dayjs(date).format(formatString)
}
