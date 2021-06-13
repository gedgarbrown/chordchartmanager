export class EditDisplay {
    displayMeasures(measures, bpm) {


    }

    moveToView() {

    }

    displayKeyChange() {
        //this.displayChordsForToolBar(chords);
    }

    displayItemChange() {

    }

    displayChordsForToolBar(chords) {
        let toolBarChords = document.getElementById("frameChords");
        toolBarChords.innerHTML = "";

        for (let i = 0; i < chords.length; i++){

        
        
        
        
            let newChord = document.createElement("div");

            newChord.classList.add("chordOption");
            newChord.draggable = true;
        
            let toneName =  chords[i].getToneName();
            console.log("adding Tone Name:", toneName);
            newChord.innerText = toneName + chords[i].type;

            toolBarChords.appendChild(newChord);
            console.log(i, chords[i].id);//debug 

       }
        

        
    }

    renderEdit(chart) {
        
        this.displayKeyChange(chart.getKey());
        this.displayChordsForToolBar(chart.toolChords);
        document.getElementById("title").innerText = chart.name;

    }


}

export class ViewDisplay {
    moveToEdit() {

    }

    displayMeasures() {

    }

    displayKeyChange(newKey){

    }

    pageForward() {

    }

    pageBack() {

    }
    
}