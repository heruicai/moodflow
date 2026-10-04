export const ACTIONS = {
  breathing:{id:'breathing',icon:'🌬️',label:'1 分钟呼吸',section:'care-breathing'},
  sound:{id:'sound',icon:'🎧',label:'听点声音',section:'care-sound'},
  stretch:{id:'stretch',icon:'🙆',label:'2 分钟伸展',section:'care-movement'},
  walk:{id:'walk',icon:'🚶',label:'10 分钟散步',section:'care-movement'},
  light:{id:'light',icon:'🏃',label:'15 分钟轻运动',section:'care-movement'},
  writing:{id:'writing',icon:'📝',label:'写下来',section:'care-writing'},
  talk:{id:'talk',icon:'💬',label:'联系一个信任的人',section:null,instant:true},
  quiet:{id:'quiet',icon:'🌙',label:'安静待一会',section:null,instant:true},
  water:{id:'water',icon:'💧',label:'喝点水',section:null,instant:true},
  screenBreak:{id:'screenBreak',icon:'👀',label:'暂时离开屏幕',section:null,instant:true},
  nothing:{id:'nothing',icon:'☁️',label:'什么都不用做',section:null,instant:true},
  smallStep:{id:'smallStep',icon:'✓',label:'完成一件最小的事',section:null,instant:true},
}
export const ALL_ACTIONS=['breathing','sound','stretch','walk','light','writing','talk','quiet','water','screenBreak','nothing'].map(id=>ACTIONS[id])
export function getAction(id){return ACTIONS[id]||{id:id||'unknown',icon:'·',label:id||'关怀行动',section:null}}
export function sectionForAction(id){return getAction(id).section}
