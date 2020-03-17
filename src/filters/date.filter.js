import store from '../store'

export default function dateFilter(value, format = 'date') {
    const params = {}
    if (format.includes('date')) {
        params.day = '2-digit'
        params.month = 'long'
        params.year = 'numeric'
    }
    if (format.includes('time')) {
        params.hour = '2-digit'
        params.minute = '2-digit'
        params.second = '2-digit'
    }

    const locale = store.getters.info.locale || 'ru-RU'
    return new Intl.DateTimeFormat(locale, params).format(new Date(value))
}

