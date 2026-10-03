function noiseBuffer(context, brown=false) {
  const length=context.sampleRate*4, buffer=context.createBuffer(1,length,context.sampleRate), data=buffer.getChannelData(0);let last=0
  for(let i=0;i<length;i++){const white=Math.random()*2-1;if(brown){last=(last+.02*white)/1.02;data[i]=last*3.2}else data[i]=white}
  return buffer
}
export function createAmbientAudio(onStateChange=()=>{}) {
  let context=null,master=null,nodes=[],timers=[],current='';let volume=.22
  function ensure(){const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)throw new Error('当前浏览器不支持音频播放');if(!context||context.state==='closed'){context=new AudioCtx();master=context.createGain();master.gain.value=volume;master.connect(context.destination)}return context.resume()}
  function remember(node){nodes.push(node);return node}
  function source(buffer){const s=remember(context.createBufferSource());s.buffer=buffer;s.loop=true;return s}
  function filteredNoise({brown=false,type='lowpass',frequency=1200,gain=.18}){const s=source(noiseBuffer(context,brown)),f=remember(context.createBiquadFilter()),g=remember(context.createGain());f.type=type;f.frequency.value=frequency;g.gain.value=gain;s.connect(f).connect(g).connect(master);s.start();return {s,g}}
  function interval(fn,ms){fn();timers.push(window.setInterval(fn,ms))}
  function tone(freq,duration=.8,gain=.03,type='sine'){if(!context)return;const o=remember(context.createOscillator()),g=remember(context.createGain());o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,context.currentTime);g.gain.linearRampToValueAtTime(gain,context.currentTime+.08);g.gain.exponentialRampToValueAtTime(.0001,context.currentTime+duration);o.connect(g).connect(master);o.start();o.stop(context.currentTime+duration+.05)}
  function build(name){
    if(name==='雨声'){filteredNoise({type:'highpass',frequency:900,gain:.12});filteredNoise({brown:true,frequency:700,gain:.1})}
    if(name==='海浪'){const {g}=filteredNoise({brown:true,frequency:800,gain:.12});const lfo=remember(context.createOscillator()),depth=remember(context.createGain());lfo.frequency.value=.11;depth.gain.value=.1;lfo.connect(depth).connect(g.gain);lfo.start()}
    if(name==='森林'){filteredNoise({brown:true,frequency:1400,gain:.07});interval(()=>tone([880,988,1175][Math.floor(Math.random()*3)],.18,.025,'sine'),2800)}
    if(name==='咖啡馆'){filteredNoise({brown:true,type:'bandpass',frequency:420,gain:.11});const o=remember(context.createOscillator()),g=remember(context.createGain());o.type='sine';o.frequency.value=95;g.gain.value=.018;o.connect(g).connect(master);o.start()}
    if(name==='轻钢琴'){const notes=[261.63,329.63,392,523.25,440,392];let i=0;interval(()=>{tone(notes[i++%notes.length],1.8,.065,'sine')},1600)}
  }
  function stop(){timers.forEach(clearInterval);timers=[];nodes.forEach(node=>{try{if(typeof node.stop==='function')node.stop()}catch{}try{node.disconnect()}catch{}});nodes=[];current='';onStateChange('')}
  async function play(name){if(current===name){stop();return ''}stop();await ensure();current=name;build(name);onStateChange(name);return name}
  function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)));if(master&&context)master.gain.setTargetAtTime(volume,context.currentTime,.03)}
  async function destroy(){stop();if(context&&context.state!=='closed')await context.close();context=null;master=null}
  return {play,stop,setVolume,destroy,get current(){return current}}
}
