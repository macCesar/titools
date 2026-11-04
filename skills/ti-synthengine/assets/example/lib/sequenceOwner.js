// Wait for native retirement before publishing the latest requested pattern.
var SoundPreset = require('./soundPreset')
module.exports = function createSequenceOwner(synth, options) {
  options = options || {}
  var current = null, pending = null, stopping = false, recipe = null, listener = null
  function rejected(method, payload) {
    if (options.rejected) options.rejected(method, payload)
    return false
  }
  function publish() {
    if (!pending) return true
    var payload = pending
    pending = null
    var control = synth.createSound(SoundPreset.fromRecipe('pattern', payload)).play()
    if (!control) return rejected('playSequence', payload)
    current = control
    recipe = payload
    listener = function(event) {
      if (current !== control) return
      control.removeEventListener('end', listener)
      current = null
      listener = null
      stopping = false
      if (pending) publish()
      if (options.ended) options.ended(event)
    }
    control.addEventListener('end', listener)
    if (options.published) options.published(control, payload)
    return true
  }
  function requestStop() {
    if (!current || stopping) return true
    stopping = true
    if (current.stop()) return true
    // An ended pattern can have its completion queued for JavaScript.
    if (current.getState() === null) return true
    stopping = false
    return rejected('stopSequence', {})
  }
  function merged(previous, changes) {
    var voice = changes.voice ? Object.assign({}, previous.voice || {}, changes.voice) : previous.voice
    var next = Object.assign({}, previous, changes)
    if (voice) next.voice = voice
    return next
  }
  return {
    submit: function(payload) {
      pending = payload
      if (!current) return publish()
      if (!requestStop()) {
        pending = null
        return false
      }
      return true
    },
    update: function(changes) {
      if (pending) {
        pending = changes.steps !== undefined ? changes : merged(pending, changes)
        return true
      }
      if (!current || stopping) return false
      var next = merged(recipe, changes)
      var preset = SoundPreset.fromRecipe('pattern', next)
      if (!current.update(Object.assign({}, preset.sound, preset.playback))) return false
      recipe = next
      return true
    },
    stop: function() { pending = null; return requestStop() },
    reset: function() {
      pending = null
      if (current && listener) current.removeEventListener('end', listener)
      current = null
      listener = null
      recipe = null
      stopping = false
    },
    getState: function() { return current ? current.getState() : null },
    id: function() { return current },
    pending: function() { return pending !== null },
    stopping: function() { return stopping }
  }
}
