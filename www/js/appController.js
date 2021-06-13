import {Chart, Chord} from "./appModel.js";
import {EditDisplay} from "./appView.js";
//import {getKeyFromCode} from "./utilities.js";


export class EditController {
    constructor() {
        this.chart = new Chart(Date.now(), "New Chart");
        this.editDisplay = new EditDisplay();
        this.updateKey();
        this.createToolBarChords(0);
        this.updateDisplay();
       
    }

    updateDisplay() {

      this.editDisplay.renderEdit(this.chart);

        
    }

    updateKey() {
        
        let newKey = document.getElementById('key').value;
        let willTranspose = document.getElementById('transpose').checked;
        console.log(newKey);
        
        let oldKey = this.chart.getKey();
        this.chart.setKey(newKey);

        //this.createToolBarChords(newkey);
        this.transposeToolBarChords(oldKey, newKey);

        

        this.editDisplay.displayChordsForToolBar(this.chart.toolChords);
        console.log(this.chart.toolChords);
    }

    createToolBarChords(key) {

        //let chords = [];

       
        //create tonic
        let tonic = new Chord(0, key, "");
        this.chart.toolChords.push(tonic);
        //tonic Major 7
        let tonicM7 = new Chord(10, key, "M7");
        this.chart.toolChords.push(tonicM7);

        
        //create subdominant
        
        let subdominant = new Chord(1, tonic.getSubdominant(tonic.getTone()), "");
        this.chart.toolChords.push(subdominant);

        //create dominant
        let dominant = new Chord(2, tonic.getDominant(tonic.getTone()), "");
        this.chart.toolChords.push(dominant);
        // dominant with 7
        let dominant7 = new Chord(12, tonic.getDominant(tonic.getTone()), "7")
        this.chart.toolChords.push(dominant7);
        
        console.log("chords array:", this.chart.toolChords)
        
        
        //return chords;
    }

    transposeToolBarChords (oldKey, newKey) {
    
        for (let i = 0; i < this.chart.toolChords.length; i++){
            this.chart.toolChords[i].transposeKey(oldKey, newKey);        }

    }

}