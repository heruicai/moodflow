const KEY = 'moodflow-records-v1'

export function loadRecords() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveRecord(record) {
  const records = loadRecords()
  records.push(record)
  localStorage.setItem(KEY, JSON.stringify(records))
  return records
}

export function seedRecords() {
  if (loadRecords().length) return loadRecords()
  const now = new Date()
  const values = [6, 7, 5, 4, 6]
  const triggers = ['工作与任务', '睡眠不足', '工作与任务', '人际关系', '身体状态']
  const moods = ['不错', '不错', '一般', '低落', '不错']
  const records = values.map((intensity, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (5 - index))
    date.setHours(20, 0, 0, 0)
    return { id: `sample-${index}`, date: date.toISOString(), intensity, trigger: triggers[index], mood: moods[index], need: '放松身体', note: '' }
  })
  localStorage.setItem(KEY, JSON.stringify(records))
  return records
}
