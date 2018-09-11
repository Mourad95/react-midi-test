import React from 'react';

import * as MidiConvert  from 'midiconvert';
import Tone from 'tone';
import * as Pixi from 'pixi.js';
import { Stage, Graphics } from 'react-pixi-fiber';



class CanvaResizible extends React.Component{

    render(){
        var width = window.innerWidth
        var height = 600
        var scaleHeigth = 70
        var scaleWidth = 13
        const canvasElement = document.getElementById("myCanva")
        
       var app = new  Pixi.Application(width, height, {backgroundColor: 0x333333})
       document.body.appendChild(app.view)
       //var app = new  Pixi.Application({view:canvasElement})
         
        var graphics = new Pixi.Graphics()
        graphics.beginFill(0x6FFF00)

        app.stage.addChild(graphics)
      

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
    graphics.y = Tone.Transport.seconds * (scaleHeigth)
    
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
                let noteTime = (-1 * note.time)
                let keyboardPiano = 100

                console.log(noteTime)
                let noteName = note.name;
                let octaveNote = noteName.match(/\d+/g).map(Number); 

                
                let noteDuration = -note.duration
       
                var x = note.midi * scaleWidth;
            //permet la lecture vers le bas des notes midi
                var y =  (noteTime * scaleHeigth)+600;
                var w = 1 * scaleWidth
                var h = noteDuration * scaleHeigth;
                //numberise le string de la note
                //console.log(h)

                var whiteKeyColor = 0x6FFF00
                let blackKeyColor = 0x4CAF00
                
               
                
                if (noteName.includes('#')) {
                    //note noire
                    w = (width / 88) * -1
                     
                            graphics.beginFill(blackKeyColor, 1);
                            graphics.lineStyle(0, blackKeyColor);

                            graphics.drawRoundedRect(x, y, w, h,-4);

                } else  {
                    //note blanche
                    w = (width / 68) * -1

                        graphics.beginFill(whiteKeyColor, 1);
                        graphics.lineStyle(0, whiteKeyColor);
                
                        graphics.drawRoundedRect(x, y, w, h, -4);
                }
                graphics.endFill();
             
                //dessin des rectangles
         
            })
            new Tone.Part(playNote,track.notes).start(0)
        })

        Tone.Transport.start()

    })

    //Reader lit le fichier
    reader.readAsBinaryString(document.querySelector('input').files[0]);
   update()


}

        return(
            <div>
            <input type="file" className='midi'/>
            <pre id="file"></pre>
            <button onClick={loadMidi}>PLAY</button>
            
           
          
            
      
            </div>
            
        )
       
    

    }
  
}

export default CanvaResizible;