import {Chart, Chord} from "./appModel.js";
import {EditDisplay} from "./appView.js";
//import {getKeyFromCode} from "./utilities.js";


export class EditController {
    constructor() {

        this.idGenerator = 1;
        this.chart = new Chart(Date.now(), "New Chart");
    
        console.log("Measures created:", this.chart.measures);

        this.editDisplay = new EditDisplay();
        this.updateKey();
        this.createToolBarChords(0);
        //adding default measures
        for (let i = 0; i < 6; i++){
            this.addMeasure();
        }

        
        this.updateDisplay();
        
    }

    updateDisplay() {
    
      this.updateChordToolBar();   
      this.updateKey();         
      this.editDisplay.renderEdit(this.chart);
      this.updateChartContent();
        
    }

    updateKey() {
        
        let newKey = document.getElementById('key').value;
        let willTranspose = document.getElementById('transpose').checked;
        //console.log(newKey);
        
        let oldKey = this.chart.getKey();
        this.chart.setKey(newKey);

        //this.createToolBarChords(newkey);
        this.transposeToolBarChords(oldKey, newKey);

        

        this.updateChordToolBar();
        console.log(this.chart.toolChords);
    }

    createToolBarChords(key) {

        //let chords = [];

       
        //create tonic
        let tonic = new Chord(this.idGenerator++, key, "", true);
        this.chart.toolChords.push(tonic);
        //tonic Major 7
        let tonicM7 = new Chord(this.idGenerator++, key, "M7", true);
        this.chart.toolChords.push(tonicM7);

        
        //create subdominant
        
        let subdominant = new Chord(
            this.idGenerator++, 
            tonic.getSubdominant(tonic.getTone()), "", true
        );

        this.chart.toolChords.push(subdominant);

        //create dominant
        let dominant = new Chord(
            this.idGenerator++, tonic.getDominant(tonic.getTone()),
            "", true
        );

        this.chart.toolChords.push(dominant);
        // dominant with 7
        let dominant7 = new Chord(
            this.idGenerator++, tonic.getDominant(tonic.getTone()),
            "7", true
        );
        this.chart.toolChords.push(dominant7);
        
        console.log("chords array:", this.chart.toolChords)
        
        
        //return chords;
    }

    transposeToolBarChords (oldKey, newKey) {
    
        for (let i = 0; i < this.chart.toolChords.length; i++){
            this.chart.toolChords[i].transposeKey(oldKey, newKey);        
        }
    
    }

    addCustomChord() {
        let tone = document.getElementById("chordKey").value;
        let type = document.getElementById("chordType").value;

        let newChord = new Chord(this.idGenerator++, tone, type, true);
        this.chart.toolChords.push(newChord);
        this.updateChordToolBar();

    }

    updateChordToolBar() {

        
        let chords = this.chart.toolChords;
        this.editDisplay.clearChordsForToolBar();

        
        for (let i = 0; i < chords.length; i++){

        
            let newChord = document.createElement("div");

            newChord.classList.add("chordOption");
           
            
        
            let toneName =  chords[i].getToneName();
            //console.log("adding Tone Name:", toneName);
            newChord.innerText = toneName + chords[i].type;
            newChord.id = chords[i].id;
            
            let chordData = new Object();

            chordData.id = chords[i].id;
            chordData.isToolBarChord = true;



            newChord.draggable = true;
            newChord.ondragstart = (ev) => {
                ev.dataTransfer.setData("text", JSON.stringify(chordData));
            };


            
            this.editDisplay.displayChordInToolBar(newChord);

            //console.log(i, chords[i].id);//debug 

       }
    }

    updateChartContent() {
        
        let content = document.createElement("div");
        content.id = "chartContent";
        let measures = this.chart.measures;

        
        let measuresCurrentRow = 0;
        let rowNumbers = 0;
        let mpr = parseInt(document.getElementById("mpr").value);
        if (isNaN(mpr)) {
            mpr = 3;
        }
                
        //let measureElements = [];
        let row = null;
                
        for(let i = 0; i < measures.length; i++){
            //console.log("currentmeasures in row and mpr: ", measuresCurrentRow, mpr);
            //console.log(measuresCurrentRow < mpr)

            if (!(measuresCurrentRow%mpr) || measures[i].isPageBreak) {

                row = document.createElement("div");
                
                content.appendChild(row);

                let rowClass = "rowMeasures" + (measures[i].isPageBreak ? 1 : mpr);

                //console.log("New Row ", rowClass);
                row.classList.add(rowClass);
                                
                rowNumbers++;
                row.id = rowNumbers;

            }    

            if (measures[i].isPageBreak) {
                measuresCurrentRow = 0;

                let newPageBreak = document.createElement("div");

                newPageBreak.classList.add("pageBreak");
                row.appendChild(newPageBreak);
                newPageBreak.innerText = "---PAGE BREAK---";
                continue;

            }  

            
            let newMeasure = document.createElement("div");
            //console.log("current row", row);
            //console.log(newMeasure);

            row.appendChild(newMeasure);
            measuresCurrentRow++;
            
            
            newMeasure.id = measures[i].id;
            newMeasure.draggable = true;
            newMeasure.classList.add("measure");

            let measureChords = document.createElement("div");
            let measureLyrics = document.createElement("div");

            let beatsClassAdjust = measures[i].beats;

            measureChords.classList.add("measureChords" + beatsClassAdjust);
            measureLyrics.classList.add("measureLyrics" + beatsClassAdjust);

            newMeasure.appendChild(measureChords);
            newMeasure.appendChild(measureLyrics);
            
            for (let x = 0; x < measures[i].beats; x++) {
                let beatChord = document.createElement("div");
                let beatLyric = document.createElement("div");
                
                beatChord.classList.add("chord");
                beatLyric.classList.add("lyric");
                
                let chordData = new Object();
                chordData.id = null;
                chordData.isToolBarChord = false;

                beatChord.draggable = true;
                beatChord.ondragstart = (ev) => 
                    {ev.dataTransfer.setData("text", beatChord.id)};
                beatChord.ondragover = (ev) => 
                    {ev.preventDefault();}
                beatChord.ondrop = (ev) => {
                   this.droppingOnMeasureChord(ev);     
                };
                
                
                let currentChord = measures[i].chords[x];
                
                if (!currentChord){
                    beatChord.innerHTML = "&nbsp;"  
                }
                else {
                    beatChord.innerHTML = "";
                    beatChord.innerText = currentChord.getChordName();
                }
                  
                
                //TODO add lyrics
                beatLyric.draggable = true;

                beatLyric.innerHTML = "&nbsp;";


                measureChords.appendChild(beatChord);
                measureLyrics.appendChild(beatLyric);

            }

                     

        }

        this.editDisplay.displayMeasures(content);

    }

    droppingOnMeasureChord(ev) {
        
        ev.preventDefault();
        let droppedData = JSON.parse(ev.dataTransfer.getData("text"));
        //ev.target.innerText = document.getElementById(data).innerText;
        
        if (droppedData.isToolBarChord) {        
            this.placeOnEmptyChord(ev, droppedData);
        }
        else {
            
            ev.target.innerHTML = "Move++";

        }
        
       

    }

    placeOnEmptyChord(ev, droppedData) {

        console.log("Starting drop event loop: ");


            let toolChord = this.chart.toolChords.find(obj => {
                return obj.id == droppedData.id;
            });

            console.log("toolChord: ", toolChord);

            let measureChords = ev.target.parentNode;
            let measureElement = measureChords.parentNode;
            let measureId = measureElement.id;

            console.log("measureChord: ", toolChord);
            console.log("measureElement: ", toolChord);
            console.log("measureId: ", toolChord);

            let measureObject = this.chart.measures.find(obj => {
                return obj.id == measureId;
            });

            console.log("measureObject: ", measureObject);

            let newChord = new Chord (this.idGenerator++, toolChord.tone, toolChord.type);
            
            console.log("newChord: ", newChord);

            let i = Array.prototype.indexOf.call(measureChords.children, ev.target);

            console.log("index: ", i);

            measureObject.chords[i] = newChord;
            
            console.log("measure: ", measureObject.chords[i]);

            console.log("measures in chart:", this.chart.measures);

                      
            
            ev.target.id = newChord.id;
            ev.target.innerHTML = newChord.getToneName() + newChord.type;


    }

    addMeasure() {
        let bpm = document.getElementById("bpm").value;
        if(isNaN(bpm) || bpm < 1){
            bpm = 4;
        }

        this.chart.addMeasure(this.idGenerator++,bpm, false);
       
        this.updateDisplay();

    }

    addPageTurn() {
        
        this.chart.addMeasure(this.idGenerator++, 1, true);
        this.idGenerator++;
        this.updateDisplay();
    }

    loadChart() {

        let loadList = document.createElement("div");


        let oldCharts = this.getSavedCharts();
        let ocObject = JSON.parse(oldCharts);

        if (ocObject == null) {
            alert("There are no saved charts to load");

            return;
        }

        for (let i = 0; i < ocObject.length; i++){
            let newSavedChart = document.createElement("div");
           
            console.log("objects ", ocObject[i]);
            
            let newChart = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key);
            
            for (let x = 0; x < ocObject[i].measures.length; x++){
                console.log("measure ", ocObject[i].measures[x]);
                newChart.measures.push(ocObject[i].measures[x]);

            }

            let chartName = newChart.name + "(" + newChart.getKeyName() + ")";

            newSavedChart.innerText = chartName;
            newSavedChart.addEventListener("click", () => {
               
                let confirmed = confirm(
                    "Load " + ocObject[i].name + 
                    "over current chart?\n Current Chart will not be saved."
                );
                console.log(confirmed);

                if(confirmed){
                    console.log("this.chart before: ", this.chart);
                    console.log("newChart", newChart);

                    this.chart = newChart;

                    console.log("this.chart after: ", this.chart);

                    this.updateDisplay;
                    this.editDisplay.closeLoadModal();
                } else {
                    return;
                }
                
            }); 

            loadList.appendChild(newSavedChart);
        }

        this.editDisplay.displayChartsToLoad(loadList);
    }

    saveChart() {

        let oldCharts = this.getSavedCharts();

        //console.log("saved Charts: ", oldCharts);


        let ocObject = JSON.parse(oldCharts);

        console.log("ocObject", ocObject);

        let foundChart = null;
        let chartIndex = 0;

       console.log(ocObject == null);

        if (ocObject == null){
           ocObject = [];
        } else {  
            //foundChart = ocObject.find(obj => { return obj.id == this.chart.id});
            for (let n = 0; n < ocObject.length; n++){
                console.log("loop oc Object id: ", ocObject[n].id);
                if (ocObject[n].id == this.chart.id){
                    foundChart = ocObject[n];
                    chartIndex = n;
                    break;
                }
            }
        }
    
        console.log("FoundChart: ", foundChart);
        console.log("Index", chartIndex);

        if (foundChart == null){
            ocObject.push(this.chart);
        }
        else{

            console.log("object before: ", ocObject);
            ocObject.splice(chartIndex, 1, this.chart);
            console.log("object after: ", ocObject);

        }

        //edit save remove object..
        localStorage.setItem("savedCharts", JSON.stringify(ocObject));
        
        this.editDisplay.displayChartSaved();

    }

    getSavedCharts(){
        return localStorage.getItem("savedCharts");
    }

    importLyrics() {
        alert("ToDo: importLyrics");
    }

    exportChart() {
        alert("ToDo: exportChart");
    }

    newChart() {

        let confirmation = confirm("Are you sure you want to create a new chart?"
            + "Any unsaved data on the current chart will be lost.");

        if (!confirmation) {
            return;
        }

        this.idGenerator = 1;
        this.chart = new Chart(Date.now(), "New Chart");
       

        console.log("New chart Measures created:", this.chart.measures);

        //this.editDisplay = new EditDisplay();
        
        this.updateKey();
        this.createToolBarChords(0);
        //adding default measures
        for (let i = 0; i < 6; i++){
            this.addMeasure();
        }

        this.updateDisplay();

    }

    changeChartName(){
        let newName = prompt("Please enter the new chart name: ", )
        this.chart.setName(newName);
        this.updateDisplay();
    }



    

}

export class ViewController{
    constructor() {

    }

    prevPage() {
        alert("TODO: previous page turn.");
    }

    nextPage() {
        alert("TODO: next page turn.");
    }

    transposeKey() {
        alert("TODO: change key");
    }









}