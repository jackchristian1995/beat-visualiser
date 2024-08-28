export const useMetronome = (tempo, meter, cb) => {
  var timerID=null;
  var interval=100;

  var audioContext = null;
  var isPlaying = false;      // Are we currently playing?
  var startTime;              // The start time of the entire sequence.
  var currentTwelveletNote;        // What note is currently last scheduled?
  var lookahead = 25.0;       // How frequently to call scheduling function
                              //(in milliseconds)
  var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                              // This is calculated from lookahead, and overlaps
                              // with next interval (in case the timer is late)
  var nextNoteTime = 0.0;     // when the next note is due.
  var noteLength = 0.05;      // length of "beep" (in seconds)
  var notesInQueue = [];      // the notes that have been put into the web audio,
                              // and may or may not have played yet. {note, time}

  function maxBeats() {
    var beats = (meter * 12);
    return beats;
  }

  function nextTwelvelet() {
    var secondsPerBeat = 60.0 / tempo;
    nextNoteTime += 0.08333 * secondsPerBeat;    // Add beat length to last beat time
    currentTwelveletNote++;    // Advance the beat number, wrap to zero

    if (currentTwelveletNote == maxBeats()) {
      currentTwelveletNote = 0;
    }
  }

  function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    if (beatNumber % maxBeats() === 0) {
      cb(1)
    } else if (beatNumber % 12 === 0) {   // quarter notes = medium pitch
      cb(12)
    } else if (beatNumber % 6 === 0) {
      cb(6)
    } else if (beatNumber % 4 === 0) {
      cb(4)
    } else if (beatNumber % 3 === 0 ) { 
      cb(3)                   // other 16th notes = low pitch
    } else {
      // keep the remaining twelvelet notes inaudible
    }
  }

  function scheduler() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
      scheduleNote( currentTwelveletNote, nextNoteTime );
      nextTwelvelet();
    }
  }

  function setTick () {
    timerID = setInterval(() => {
      scheduler();
    }, lookahead);
  }

  function stopTick () {
    clearInterval(timerID);
    timerID = null;
  }

  function play() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      currentTwelveletNote = 0;
      nextNoteTime = audioContext.currentTime;
      setTick();
    } else {
      stopTick();
    }
  }

  function pause () {
    stopTick();
  }

  function init(){
    audioContext = new AudioContext();
    // timerWorker = new Worker("./worker.js");

    // timerWorker.onmessage = function(e) {
    //   if (e.data == "tick") {
    //     scheduler();
    //   } else {
    //     console.log("message: " + e.data);
    //   }
    // };

    // timerWorker.postMessage({"interval":lookahead});
  }

  return {
    init, play, pause
  }
}