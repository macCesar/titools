// Convert an editable recipe to a Sound definition; this module never plays audio.
exports.fromRecipe = function(type, recipe) {
  var source = JSON.parse(JSON.stringify(recipe || {}))
  var sound = type === 'pattern' ? source.voice || {} : {}
  var playback = { type: type }
  if (type === 'pattern') {
    ;['timeUnit', 'gate', 'loop', 'swing', 'mode', 'tuning'].forEach(function(key) {
      if (source[key] !== undefined) playback[key] = source[key]
    })
    if (sound.frequencyEnd !== undefined) {
      playback.frequencyEnd = sound.frequencyEnd
      delete sound.frequencyEnd
    }
    if (source.detune !== undefined) sound.detune = source.detune
    if (source.stepDuration !== undefined) playback.interval = source.stepDuration
    playback.steps = (source.steps || []).map(function(step) {
      var result = {}
      ;['notes', 'frequencies', 'rest', 'length', 'gate'].forEach(function(key) {
        if (step[key] !== undefined) result[key] = step[key]
      })
      if (step.duration !== undefined) result.interval = step.duration
      if (step.overrides !== undefined) result.sound = step.overrides
      return result
    })
  } else {
    Object.keys(source).forEach(function(key) {
      if (key === 'note') playback.notes = [source[key]]
      else if (key === 'frequency') playback.frequencies = [source[key]]
      else if (['notes', 'frequencies', 'frequencyEnd', 'duration'].indexOf(key) >= 0) playback[key] = source[key]
      else sound[key] = source[key]
    })
  }
  return { sound: sound, playback: playback }
}
