import React from 'react';
import './App.css';

import * as MidiConvert  from 'midiconvert';
import Tone from 'tone'
import * as Pixi from 'pixi.js'
import CanavaResizible from './algoHands/CanvaResizible';

var width = window.innerWidth
var height = 600
var scale = 1000



export default class midiBaton extends React.Component{

render(){
    
        var graphics = new Pixi.Graphics()
        graphics.beginFill(0xffffff)
    
         
        app.stage.addChild(graphics)
    
        var line = new Pixi.Graphics()
        line.beginFill(0xff0000, .5)
        app.stage.addChild(line)
        
// Tone.js
var synth = new Tone.PolySynth(8, Tone.Synth, {
    oscillator: {
        type: "sine3"
    },
    envelope: {
        attack: .03,
        decay: .1,
        sustain: .2,
        release: .6
    }
}).toMaster()

function playNote(time, event) {
    
    synth.triggerAttackRelease(event.name, event.duration, time, event.velocity)
}

function update() {

    requestAnimationFrame(update)
    //vitesse de visualisation des notes
    graphics.y = Tone.Transport.seconds * (scale/6)
    
}



// load a midi file
function loadMidi(){
        
    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
     
    //data récupère le contenu du fichier et le converti
     let midi = MidiConvert.parse(e.target.result)
     
    
     console.log(midi)
     let totalDuration = midi.duration.toFixed(2)

     //console.log(totalDuration)
    //vitesse suivant le fichier midi

        Tone.Transport.bpm.value = midi.bpm
        Tone.Transport.timeSignature = midi.timeSignature

       
        midi.tracks.forEach(function(track) {
        
             
            track.notes.forEach(function(note) {
                let noteTime = - note.time
                let keyboardPiano = 100

                
                let noteName = note.name;
                let octaveNote = noteName.match(/\d+/g).map(Number); 

                
                let noteDuration = - note.duration
                

                
                var x = (note.midi / 127) * scale;
            //permet la lecture vers le bas des notes midi
                var y =  noteTime * scale - keyboardPiano;
                var w = 0 
                var h = noteDuration.toFixed(2) * scale;
                //numberise le string de la note
                //console.log(h)

                var colorRightHand = 0x67E200
                let colorLeftHand = 0xFF00FF
                
               
                
                if (noteName.includes('#')) {
                    //note noire
                    w = width / 88
                     
                            graphics.beginFill(colorLeftHand, 1);
                            graphics.lineStyle(3, colorLeftHand, 0.3);

                            graphics.drawRoundedRect(x, y, w, h,1);

           

                } else  {
                    //note blanche
                    w = width / 68

                        graphics.beginFill(colorRightHand, 1);
                        graphics.lineStyle(3, colorRightHand, 0.3);
                
                        graphics.drawRoundedRect(x, y, w, h, -1);
                }
                graphics.endFill();

                
                //dessin des rectangles
               
               
            
            })
            new Tone.Part(/*playNote,*/ track.notes).start(0)
        })

        Tone.Transport.start()

    })

    //Reader lit le fichier
    reader.readAsBinaryString(document.querySelector('input').files[0]);
   update()


}

var app = new  Pixi.Application(width, height, {backgroundColor: 0x333333})
document.body.appendChild(app.view)
    return(
        <div>
        {app.view}
        <input type="file" className='midi'/>
        <pre id="file"></pre>
        <button onClick={loadMidi}>PLAY</button>
        
        </div>
        
        
        
    )
}


}






