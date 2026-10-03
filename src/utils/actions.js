export const ACTIONS = {
  breathing: { id:'breathing', icon:'🌬', label:'1 分钟呼吸', section:'care-breathing' },
  sound: { id:'sound', icon:'🎧', label:'听一会环境音', section:'care-sound' },
  walk: { id:'walk', icon:'🚶', label:'10 分钟散步', section:'care-movement' },
  stretch: { id:'stretch', icon:'🧘', label:'2 分钟伸展', section:'care-movement' },
  writing: { id:'writing', icon:'📝', label:'写下来', section:'care-writing' },
  talk: { id:'talk', icon:'💬', label:'找信任的人聊聊', section:'care-writing' },
  smallStep: { id:'smallStep', icon:'✓', label:'完成一件最小的事', section:'care-movement' },
}
export function getAction(id) { return ACTIONS[id] || ACTIONS.breathing }
export function sectionForAction(id) { return getAction(id).section }
