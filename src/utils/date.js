// Centralised date formatting so the UI shows dates the same way everywhere.
// Examples (locale: en-GB to force day-first ordering):
//   formatDate(d)     → "27 Jun 2026"
//   formatDateTime(d) → "27 Jun 2026 10:44 PM"

const _date = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
})

const _time = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit', minute: '2-digit', hour12: true,
})

function _toDate(input) {
  if (!input) return null
  const d = input instanceof Date ? input : new Date(input)
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(input) {
  const d = _toDate(input)
  return d ? _date.format(d) : ''
}

export function formatDateTime(input) {
  const d = _toDate(input)
  return d ? `${_date.format(d)} ${_time.format(d)}` : ''
}
