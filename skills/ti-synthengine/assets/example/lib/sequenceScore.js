// Compile an application score to the native, millisecond sequence contract.
// Score envelopes include release; native length marks the release onset.
module.exports = function sequenceScore(score) {
  const quarters = { '1n':4, '2n':2, '2n.':3, '4n':1, '4n.':1.5, '8n':.5, '8n.':.75, '8t':1/3, '16n':.25, '16t':1/6 }
  function noteFrequency(note) {
    const m = /^(SOL|DO|RE|MI|FA|LA|SI|TI|[A-G])([#b]?)(-?\d+)?$/i.exec(note)
    if (!m) return NaN
    const pitch = {C:0,D:2,E:4,F:5,G:7,A:9,B:11,DO:0,RE:2,MI:4,FA:5,SOL:7,LA:9,SI:11,TI:11}[m[1].toUpperCase()]
    return 440 * Math.pow(2, ((Number(m[3] === undefined ? 4 : m[3])+1)*12+pitch+(m[2]==='#'?1:m[2]==='b'?-1:0)-69)/12)
  }
  const voice = Object.assign({}, score)
  for (const key of ['steps','bpm','swing','stepDuration','noteValue']) delete voice[key]
  return { timeUnit:'ms', loop:false, swing:score.swing || 0, voice,
    steps:score.steps.map(step => {
      const duration = step.duration === undefined
        ? ((step.noteValue || score.noteValue) ? 60000/(score.bpm || 120)*quarters[step.noteValue || score.noteValue] : score.stepDuration || 100)
        : step.duration
      if (step.rest) return {rest:true,duration}
      const overrides = Object.assign({}, step)
      for (const key of ['note','frequency','duration','noteValue']) delete overrides[key]
      const release = step.release === undefined ? score.release === undefined ? Math.min(50,duration-1) : score.release : step.release
      return { frequencies:[step.frequency === undefined ? noteFrequency(step.note) : step.frequency],
        duration, length:Math.max(1,duration-release), overrides }
    }) }
}
