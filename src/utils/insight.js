export const CRISIS_KEYWORDS = ['不想活', '想死', '自杀', '结束生命', '活着没意思', '撑不下去了']
const needCopy = {
  '被理解': '先让自己的感受被完整听见，而不是急着证明它是否合理。', '安静一下': '暂时减少外界输入，让紧绷的心绪有机会慢慢落下来。',
  '找回动力': '把目标缩小到下一步，不要求自己现在就恢复到最佳状态。', '理清思绪': '把混在一起的担心逐一放到眼前，区分事实、感受和猜测。',
  '放松身体': '先照顾身体的紧绷和疲惫，再处理那些需要思考的事。', '有人陪伴': '不必独自消化全部情绪，让一个可信任的人靠近你一点。',
  '获得肯定': '看见自己已经付出的努力，不把一次结果等同于全部价值。', '解决问题': '找出最可控的一小部分，先完成一个清晰、具体的动作。',
}
const actionSets = {
  '被理解': [['📝', '写下最想被理解的一句话'], ['💬', '找朋友聊聊'], ['🌬', '做 1 分钟呼吸']], '安静一下': [['🌬', '1 分钟呼吸'], ['🎧', '听一段环境音'], ['📵', '放下手机 5 分钟']],
  '找回动力': [['✅', '完成一件最小的事'], ['🚶', '走 10 分钟'], ['📝', '写下已完成的三件事']], '理清思绪': [['📝', '写下最担心的一件事'], ['🧩', '拆成三个小步骤'], ['🌬', '做 1 分钟呼吸']],
  '放松身体': [['🧘', '做 2 分钟伸展'], ['🚶', '走 10 分钟'], ['🎧', '听一段环境音']], '有人陪伴': [['💬', '联系一个信任的人'], ['🚶', '去有人的地方走走'], ['📝', '写下想说的话']],
  '获得肯定': [['📝', '记下一件做得不错的事'], ['💬', '向信任的人说出感受'], ['🌬', '做 1 分钟呼吸']], '解决问题': [['🧩', '写下一个可控的小步骤'], ['⏱', '专注处理 10 分钟'], ['🚶', '走一走再回来']],
}
const summaries = [
  ({event,tags,strength}) => `今天${event}似乎让你${tags}，而且这种感受现在${strength}。`, ({event,tags,strength}) => `在${event}之后，${tags}可能同时涌了上来，这份感受${strength}。`,
  ({event,tags,strength}) => `你正在面对与${event}有关的波动，里面有${tags}，目前${strength}。`, ({event,tags,strength}) => `${event}像是触动了你在意的部分，让${tags}变得更清晰，这种感受${strength}。`,
  ({event,tags,strength}) => `此刻的你可能一边处理${event}，一边承受着${tags}，它${strength}。`, ({event,tags,strength}) => `从你的记录里，能感到${event}带来了${tags}，这份情绪${strength}。`,
]
function hash(text) { return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) }
export function hasCrisisLanguage(text = '') { return CRISIS_KEYWORDS.some(word => text.includes(word)) }
function triggerPoints(triggerTags, note) {
  const points = []
  if (triggerTags.includes('自我期待')) points.push('对自己的表现有较高期待')
  if (triggerTags.includes('睡眠')) points.push('休息不足可能放大了当下感受')
  if (triggerTags.includes('工作') || triggerTags.includes('学业')) points.push('任务与反馈带来的压力')
  if (triggerTags.includes('人际关系') || triggerTags.includes('亲密关系')) points.push('关系中的回应没有符合期待')
  if (triggerTags.includes('未来规划')) points.push('对不确定性的持续担心')
  if (/反馈|批评|否定|问题/.test(note)) points.push('一次反馈可能触动了对自身能力的怀疑')
  if (/来不及|很多|太多|忙/.test(note)) points.push('需要同时承担的事情有些多')
  const unique = [...new Set(points)]
  return unique.length ? unique.slice(0, 2) : (triggerTags.length ? triggerTags.slice(0, 2).map(tag => `与${tag}有关的持续消耗`) : ['一些尚未被说清的压力'])
}
export function createInsight({ mood, intensity, emotionTags = [], triggerTags = [], need, note = '' }) {
  const event = triggerTags.length ? triggerTags.slice(0, 2).join('和') : '最近发生的事情'
  const tags = emotionTags.length ? `感到${emotionTags.slice(0, 3).join('、')}` : `有些${mood}`
  const strength = intensity >= 8 ? '还比较强烈' : intensity >= 5 ? '值得被认真留意' : '虽不强烈，也值得被看见'
  const actions = actionSets[need] || actionSets['安静一下']
  return { experience: summaries[hash(`${note}${mood}${need}`) % summaries.length]({event,tags,strength}), triggers: triggerPoints(triggerTags, note), needText: needCopy[need] || '先停下来听听自己，而不是要求此刻马上得到答案。', primaryAction: actions[0], secondaryActions: actions.slice(1) }
}
