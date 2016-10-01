var state = "unknown";		// Normally "on" or "off"
var playlist = [];		// List of tracks, but can be empty
var current = -1;		// Current track; -1 iff playlist is empty
var DEBUG = true;

function setup() {
    disableButtons();
    xhr("status", function () {
	if (DEBUG)
	    console.log(this.responseText);
	let response = JSON.parse(this.responseText);
	playlist = response.playlist;
	if (playlist.length == 0 || response.current >= playlist.length) {
	    state = "off";
	    current = -1;
	}
	else if (response.current == -1)  {
	    state = "off";
	    current = 0;
	}
	else {
	    state = "on";
	    current = response.current;
	}
	if (current != -1) {
	    enableButtons();
	    displayPlaylist(playlist);
	}
	else {
	    displayPlaylist(["(Empty playlist)"]);
	}
	displayTrack();
    })
}

function power() {
    assert( current >= 0 && current < playlist.length );
    switch (state) {
    case "unknown":
    case "on":
	xhr("stop");
	state = "off";
	break;
    case "off":
	xhr("play=" + current);
	state = "on";
	break;
    }
    displayTrack();
}

function previous() {
    assert( current >= 0 && current < playlist.length );
    current = current == 0 ? playlist.length-1 : current-1;
    if (state == "on")
	xhr("play=" + current);
    displayTrack();
}

function next() {
    assert( current >= 0 && current < playlist.length );
    current = current == playlist.length-1 ? 0 : current+1;
    if (state == "on")
	xhr("play=" + current);
    displayTrack();
}

function down() {
    xhr("down");
}

function up() {
    xhr("up");
}

function xhr(request, cb) {
    let req = new XMLHttpRequest();
    req.addEventListener("load", cb ? cb : defaultCB);
    let url = window.location.protocol + "//" + window.location.host + "/radio/play.php?" + request;
    req.open("GET", url);
    req.send();
}

function defaultCB() {
    if (DEBUG)
	console.log(this.responseText);
}

function enableButtons() { doButtons(false); }
function disableButtons() { doButtons(true); }

function doButtons(state) {
    document.getElementById("btn_power").disabled = state;
    document.getElementById("btn_up").disabled = state;
    document.getElementById("btn_down").disabled = state;
    document.getElementById("btn_previous").disabled = state;
    document.getElementById("btn_next").disabled = state;
}

function displayTrack() {
    assert( current == -1 || current >= 0 && current < playlist.length );
    let text = "";
    if (current == -1)
	text = "(Empty playlist)";
    else {
	text = playlist[current];
	if (state == "off")
	    text = "(Stopped) " + text;
    }
    document.getElementById("txt_current").innerText = text;
}

function displayPlaylist(playlist) {
    // Insert text lines for the playlist items
    let d = document.getElementById("playlist");
    for ( let i=0 ; i < playlist.length ; i++ ) {
	let item = playlist[i];
	let elt = document.createElement("div");
	elt.innerText = item;
	d.appendChild(elt);
    }
}

function assert( condition ) {
    if (!condition)
	throw new Error("assertion failed");
}
