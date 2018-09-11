import React from 'react';
import * as MidiConvert from 'midiconvert';
import Tone from 'tone';
import * as Pixi from 'pixi.js';
import { Graphics, Stage } from "react-pixi-fiber";

class MidiVisuTest extends React.Component {
 
  static defaultProps = {
    width: window.innerWidth,
    height: 600,
    scale: 1000
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.pixiAppRef = React.createRef();
    this.pixiGraphicsRef = React.createRef();
    this.loadMidi = this.loadMidi.bind(this);
    
   
  }

  componentDidMount() {
    this.pixiAppRef = this.createApp();
    this.pixiGraphicsRef = this.createGraphics();
    this.synth = this.createSynth();
   // this.viewRef.appendChild(this.app.view);
  
  }

  playNote(time, event) {
    this.synth.triggerAttackRelease(event.name, event.duration, time, event.velocity);
  }

  update() {
      var scale = this.props.scale
    requestAnimationFrame(this.update);
    //vitesse de visualisation des notes
    this.pixiGraphicsRef.y = Tone.Transport.seconds * (scale / 6);
  }

  loadMidi() {
    const reader = new FileReader();
  
    reader.addEventListener('load',this.onLoad.bind(this));
    
      
    //Reader lit le fichier
    reader.readAsBinaryString(document.querySelector('input').files[0]);
    this.update();
  }

  onLoad(e) {
     
    //data récupère le contenu du fichier et le converti
    let midi = MidiConvert.parse(e.target.result);

    console.log(midi);

    let totalDuration = midi.duration.toFixed(2);

    //console.log(totalDuration)
    //vitesse suivant le fichier midi
    
    Tone.Transport.bpm.value = midi.bpm;
    Tone.Transport.timeSignature = midi.timeSignature;


    midi.tracks.forEach((track) => {
      track.notes.forEach((note) => this.drawNote(track, note));

      new Tone.Part(/*playNote,*/ track.notes).start(0);
    });

    Tone.Transport.start();
  }

 

 

  drawNote(track, note) {
    const { width, scale } = this.props;
    let noteTime = -note.time;
    let keyboardPiano = 100;
    let noteName = note.name;
    let octaveNote = noteName.match(/\d+/g).map(Number);
    let noteDuration = -note.duration;

    const x = (note.midi / 170) * scale;
    //permet la lecture vers le bas des notes midi
    const y = noteTime * scale - keyboardPiano;
    let w = 0;
    const h = noteDuration.toFixed(2) * scale;
    //numberise le string de la note
    //console.log(h)

    const colorRightHand = 0x67E200;
    let colorLeftHand = 0xFF00FF;

    if (noteName.includes('#')) {
      //note noire
      w = width / 88;

      this.pixiGraphicsRef.beginFill(colorLeftHand, 1);
      this.pixiGraphicsRef.lineStyle(3, colorLeftHand, 0.3);

      this.pixiGraphicsRef.drawRoundedRect(x, y, w, h, 1);


    } else {
      //note blanche
      w = width / 68;

      this.pixiGraphicsRef.beginFill(colorRightHand, 1);
      this.pixiGraphicsRef.lineStyle(3, colorRightHand, 0.3);

      this.pixiGraphicsRef.drawRoundedRect(x, y, w, h, -1);
    }
    this.pixiGraphicsRef.endFill();
  }

  createApp() {
      
    const { width, height } = this.props;
    return  new Pixi.Application(width, height, { backgroundColor: 0x333333 });
  }

  createGraphics() {
    const graphics = new Pixi.Graphics();
    graphics.beginFill(0xffffff);

   // this.app.stage.addChild(graphics);

    const line = new Pixi.Graphics();
    line.beginFill(0xff0000, .5);
    //this.app.stage.addChild(line);

    return graphics;
  }

  createSynth() {
    return new Tone.PolySynth(8, Tone.Synth, {
      oscillator: {
        type: 'sine3'
      },
      envelope: {
        attack: .03,
        decay: .1,
        sustain: .2,
        release: .6
      }
    }).toMaster();
  }

  render() {
    return (
      <div>
        <input ref={this.inputRef} type="file" className='midi'/>
        <pre id="file"/>
        <button onClick={this.loadMidi}>PLAY</button>

        <div ref={this.viewRef}/>
        <Stage ref={this.pixiAppRef} >
            <Graphics >
            
            </Graphics>
        
        </Stage>
      </div>
    );
  }
}

export default MidiVisuTest;