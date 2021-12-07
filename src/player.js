const song = document.querySelector('#song'); // audio object

const songTitle = document.querySelector('.song-title'); // element where track title appears
const progressBar = document.querySelector('#progress-bar'); // element where progress bar appears
let pPause = document.querySelector('#play-pause'); // element where play and pause image appears
let playing = false;
var btn = document.getElementById("PlayButton");

function playPause() {
    if (playing) {
        const song = document.querySelector('#song');
        song.play();
        btn.innerHTML = 'Pause';
        playing = false;
    } else {
        song.pause();
        playing = true;
        btn.innerHTML = 'Play';
    }
}


// update progressBar.max to song object's duration, same for progressBar.value, update currentTime/duration DOM
function updateProgressValue() {
    progressBar.max = song.duration;
    progressBar.value = song.currentTime;
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(song.currentTime)));
    if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
        document.querySelector('.durationTime').innerHTML = "0:00";
    } else {
        document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(song.duration)));
    }
};

// convert song.currentTime and song.duration into MM:SS format
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){ 
        sec  = `0${sec}`;
    };
    return `${min}:${sec}`;
};

// run updateProgressValue function every 1/2 second to show change in progressBar and song.currentTime on the DOM
setInterval(updateProgressValue, 500);

// function where progressBar.value is changed when slider thumb is dragged without auto-playing audio
function changeProgressBar() {
    song.currentTime = progressBar.value;
};


// Make the DIV element draggable:
var PADDING = 4;

var rect;
var viewport = {
   bottom: 0,
   left: 0,
   right: 0,
   top: 0
}

//Make the DIV element draggagle:
dragElement(document.getElementById(("MediaPlayerContainer")));

function dragElement(elmnt) {
   var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
   if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
   } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
   }

   function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;

      // store the current viewport and element dimensions when a drag starts
      rect = elmnt.getBoundingClientRect();
      viewport.bottom = window.innerHeight - PADDING;
      viewport.left = PADDING;
      viewport.right = window.innerWidth - PADDING;
      viewport.top = PADDING;

      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
   }

   function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // check to make sure the element will be within our viewport boundary
      var newLeft = elmnt.offsetLeft - pos1;
      var newTop = elmnt.offsetTop - pos2;

      if (newLeft < viewport.left ||
         newTop < viewport.top ||
         newLeft + rect.width > viewport.right ||
         newTop + rect.height > viewport.bottom
      ) {
         // the element will hit the boundary, do nothing...
      } else {
         // set the element's new position:
         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
   }

   function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
   }
}