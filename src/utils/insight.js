const triggerRules = [
  { words: ['工作', '任务', '加班', '考试', '作业', '截止', '项目'], label: '工作与任务' },
  { words: ['睡', '失眠', '熬夜', '累', '疲惫'], label: '睡眠不足' },
  { words: ['朋友', '同事', '家人', '吵架', '沟通', '关系'], label: '人际关系' },
  { words: ['身体', '生病', '头疼', '不舒服'], label: '身体状态' },
]

export function detectTrigger(text) {
  return triggerRules.find(rule => rule.words.some(word => text.includes(word)))?.label || '生活中的多重感受'
}

const actionsByNeed = {
  '被理解': ['写下此刻最担心的事情', '找朋友聊聊', '给自己的感受一句回应'],
  '安静一下': ['1分钟呼吸', '听一段舒缓音乐', '暂时放下手机 5 分钟'],
  '找回动力': ['只做一件最小的事', '10分钟散步', '写下今天已完成的三件事'],
  '理清思绪': ['写下此刻最担心的事情', '把任务分成三个小步骤', '1分钟呼吸'],
  '放松身体': ['轻柔拉伸 5 分钟', '10分钟散步', '听一段舒缓音乐'],
  '有人陪伴': ['找朋友聊聊', '给信任的人发条消息', '去一个让你安心的公共空间'],
}

export function createInsight({ mood, intensity, note, need }) {
  const trigger = detectTrigger(note)
  const tone = intensity >= 8 ? '这份感受现在似乎很强烈' : intensity >= 5 ? '这份感受值得被认真看见' : '你已经在留意这份细微的感受'
  return {
    emotion: `${mood}，强度 ${intensity}/10`,
    trigger,
    need,
    summary: `${tone}。也许${trigger}让你消耗了不少，而你此刻更需要“${need}”。不用急着把一切都解决，先为自己留出一点空间，从一个很小的照顾开始就好。`,
    actions: actionsByNeed[need] || actionsByNeed['安静一下'],
  }
}
