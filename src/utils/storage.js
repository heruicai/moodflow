const RECORDS_KEY = 'moodflow-records-v2'
const LEGACY_KEY = 'moodflow-records-v1'
const WRITING_KEY = 'moodflow-care-writing-v1'

function safeParse(value, fallback) { try { return JSON.parse(value) ?? fallback } catch { return fallback } }
function normalize(record) {
  return {
    id: record.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: record.createdAt || record.date || new Date().toISOString(), mood: record.mood || '一般',
    intensity: Number(record.intensity) || 5, emotionTags: Array.isArray(record.emotionTags) ? record.emotionTags : [],
    triggerTags: Array.isArray(record.triggerTags) ? record.triggerTags : record.trigger ? [record.trigger] : [],
    need: record.need || '', note: record.note || '', insightSummary: record.insightSummary || '', primaryAction: record.primaryAction || '',
  }
}
export function loadRecords() {
  const current = safeParse(localStorage.getItem(RECORDS_KEY), [])
  if (Array.isArray(current) && current.length) return current.map(normalize)
  const legacy = safeParse(localStorage.getItem(LEGACY_KEY), [])
  if (Array.isArray(legacy) && legacy.length) { const migrated = legacy.map(normalize); localStorage.setItem(RECORDS_KEY, JSON.stringify(migrated)); return migrated }
  return []
}
export function saveRecord(record) { const records = loadRecords(); if (records.some(item => item.id === record.id)) return records; const next = [normalize(record), ...records]; localStorage.setItem(RECORDS_KEY, JSON.stringify(next)); return next }
export function deleteRecord(id) { const next = loadRecords().filter(item => item.id !== id); localStorage.setItem(RECORDS_KEY, JSON.stringify(next)); return next }
export function loadWriting() { return localStorage.getItem(WRITING_KEY) || '' }
export function saveWriting(value) { localStorage.setItem(WRITING_KEY, value) }
