import dayjs from 'dayjs'

// format date
export function formatDate({ date, formatString = 'YYYY/MM/DD' }) {
    if (date) return dayjs(date).format(formatString)
}
