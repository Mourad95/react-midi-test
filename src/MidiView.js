const express = require ('express')
var MidiPlayer = require('midi-player-js');
app = express()
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})

// Initialize player and register event handler

var Player = new MidiPlayer.Player(function(event) {
	//console.log(event);
});
let file = Player.loadFile('./mmm_895793_1.mid')


console.log(Player.getEvents(file))

