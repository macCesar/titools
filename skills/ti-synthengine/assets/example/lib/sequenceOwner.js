// One application owner, with latest-request coalescing across native retirement.
// A stop is accepted before its slot becomes reusable. Only sequenceend permits
// the next complete publication; JavaScript never schedules individual notes.
module.exports = function createSequenceOwner(synth, options) {
  options = options || {}
  var current = 0, pending = null, stopping = false, listening = false
  function listen() {
    if (!listening) {
      synth.addEventListener('sequenceend', ended)
      listening = true
    }
  }
  function rejected(method, payload) {
    if (options.rejected) options.rejected(method, payload)
    return false
  }
  function publish() {
    if (!pending) return true
    var payload = pending
    pending = null
    var id = synth.playSequence(payload)
    if (!Number.isInteger(id) || id <= 0) return rejected('playSequence', payload)
    current = id
    if (options.published) options.published(id, payload)
    return true
  }
  function ended(event) {
    if (event.sequenceId !== current) return
    current = 0
    stopping = false
    if (pending) publish()
    if (options.ended) options.ended(event)
  }
  function requestStop() {
    if (!current || stopping) return true
    stopping = true
    if (synth.stopSequence({ sequenceId: current })) return true
    // A naturally retired ID can already have its completion queued for JS.
    // Its slot still needs event draining before a replacement publication.
    if (synth.getSequenceState({ sequenceId: current }) === null) return true
    stopping = false
    return rejected('stopSequence', { sequenceId: current })
  }
  return {
    submit: function(payload) {
      listen()
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
        if (changes.steps !== undefined) {
          pending = changes
          return true
        }
        var voice = changes.voice ? Object.assign({}, pending.voice || {}, changes.voice) : pending.voice
        pending = Object.assign({}, pending, changes)
        if (voice) pending.voice = voice
        return true
      }
      if (!current || stopping) return false
      return synth.updateSequence(Object.assign({ sequenceId: current }, changes))
    },
    stop: function() { pending = null; return requestStop() },
    reset: function() {
      pending = null
      current = 0
      stopping = false
      if (listening) {
        synth.removeEventListener('sequenceend', ended)
        listening = false
      }
    },
    id: function() { return current },
    pending: function() { return pending !== null },
    stopping: function() { return stopping }
  }
}
