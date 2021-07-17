import {Chart, Chord, Measure} from "./appModel.js";
import {EditDisplay, ViewDisplay} from "./appView.js";

/*******************************************************************
 * Edit Controller
 *******************************************************************/

export class EditController {
    constructor() {

        this.idGenerator = 1;
        let currentChart = this.getCurrentChart();
        this.editDisplay = new EditDisplay();

        if (currentChart != null){
            try{
                this.loadChart(currentChart);
            } catch (error){
                console.error(error);
            }
            
        } else {
            this.newChart(true);
        }
       
        
        
        this.updateKey();
       
        
       

        this.updateDisplay();
        
    }

    updateDisplay() {
    
        this.updateChordToolBar();   
             
        this.editDisplay.renderEdit(this.chart);
        this.updateChartContent();
        
    }

    getCurrentChart() {

        let currentChart = localStorage.getItem("currentChart");
        let ccObject = JSON.parse(currentChart);

        return ccObject;      

    }

    updateKey() {
        
        let newKey = document.getElementById('key').value;
        let willTranspose = document.getElementById('transpose').checked;
               
        let oldKey = this.chart.getKey();
        this.chart.setKey(newKey);

        console.log("this chart set to: ", this.chart.key);

        this.transposeToolBarChords(oldKey, newKey);
        console.log("will transpose:", willTranspose);

        if(willTranspose) {
            this.transposeChartChords(oldKey, newKey);
        }
        
        this.updateDisplay();
        
    }

    updateMeasuresPerRow() {
        let mpr =  parseInt(document.getElementById("mpr").value);
        this.chart.measuresPerRow = mpr;
        this.updateDisplay();
    }

    createToolBarChords(key) {
 
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

    }

    transposeToolBarChords (oldKey, newKey) {
    
        for (let i = 0; i < this.chart.toolChords.length; i++){
            this.chart.toolChords[i].transposeKey(oldKey, newKey);        
        }
    
    }

    transposeChartChords (oldKey, newKey){

        for (let mi = 0; mi < this.chart.measures.length; mi++){

            for (let ci = 0; ci < this.chart.measures[mi].chords.length; ci++){
                this.chart.measures[mi].chords[ci].transposeKey(oldKey, newKey);
            }
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

            newChord.innerText = toneName + chords[i].type;
            newChord.id = chords[i].id;
            
            let chordData = new Object();

            chordData.id = chords[i].id;
            chordData.isToolBarChord = true;

            newChord.draggable = true;
            newChord.ondragstart = (ev) => {
                ev.dataTransfer.setData("text", JSON.stringify(chordData));
            }


            
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
        let mpr = this.chart.measuresPerRow;
        if (isNaN(mpr)) {
            mpr = 3;
        }
                
        let row = null;
                
        for(let i = 0; i < measures.length; i++) {
           
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
            let newMeasureShell = document.createElement("div");
            let newMeasureGrabber = document.createElement("div");
            newMeasureShell.appendChild(newMeasureGrabber);
            newMeasureShell.appendChild(newMeasure);
            newMeasureShell.classList.add("measureShell");
            
            newMeasureGrabber.classList.add("measureGrabber");
            newMeasureGrabber.innerHTML = `<div>..</div><div>..</div>`;
            newMeasureGrabber.draggable = true;
            //console.log("current row", row);
            //console.log(newMeasure);

            row.appendChild(newMeasureShell);
            measuresCurrentRow++;
                        
            newMeasure.id = measures[i].id;

            newMeasure.classList.add("measure");

            

            newMeasureGrabber.ondragstart = (ev) => 
            {  
             ev.dataTransfer.setData("text", JSON.stringify(measures[i]));
            }

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
                //chord id : m[measure index]c[chord index]
                chordData.id = "m" + i + "c" + x;
                chordData.isToolBarChord = false;

                beatChord.id = chordData.id;

                beatChord.draggable = true;
                beatChord.ondragstart = (ev) => 
                    {   console.log("BeatChord.id: ", beatChord);
                    ev.dataTransfer.setData("text", JSON.stringify(chordData));
                    }
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
                  
                
                //add lyrics
                beatLyric.draggable = false;

                let currentLyric = measures[i].lyrics[x];

                if(!currentLyric) {
                     beatLyric.innerHTML = "&nbsp;";
                } else {
                    beatLyric.innerHTML = "";
                    beatLyric.innerText = currentLyric;
                }
               
               

                measureChords.appendChild(beatChord);
                measureLyrics.appendChild(beatLyric);

                beatLyric.addEventListener("click", () => {
                    this.addLyric(measures[i], x, beatLyric);
                });

            }

                     

        }

        this.editDisplay.displayMeasures(content);

    }

    droppingOnMeasureChord(ev) {
        
        ev.preventDefault();
        console.log("droppedData: ", ev.dataTransfer.getData("text"));
        let droppedData = {};
        if(ev.dataTransfer.getData("text")){
            droppedData = JSON.parse(ev.dataTransfer.getData("text"));
        }
        
        
        
        if (droppedData.isToolBarChord) {        
            this.placeOnEmptyChord(ev, droppedData);
        }
        else {
           
            this.placeOnFullChord(ev, droppedData);

        }
        
       

    }

    placeOnEmptyChord(ev, droppedData) {

            let toolChord = this.chart.toolChords.find(obj => {
                return obj.id == droppedData.id;
            });

            
            let measureChords = ev.target.parentNode;
            let measureElement = measureChords.parentNode;
            let measureId = measureElement.id;

            
            let measureObject = this.chart.measures.find(obj => {
                return obj.id == measureId;
            });

           

            let newChord = new Chord (this.idGenerator++, toolChord.tone, toolChord.type);
            
            console.log("newChord: ", newChord);

            let i = Array.prototype.indexOf.call(measureChords.children, ev.target);

            console.log("index: ", i);

            measureObject.chords[i] = newChord;
            
            console.log("measure: ", measureObject.chords[i]);

            console.log("measures in chart:", this.chart.measures);

                      
            
           this.updateDisplay();


    }

    placeOnFullChord (ev, droppedData) { 

        
        let evChordElement = document.getElementById(droppedData.id);
        
        console.log("evChordElement: ", evChordElement);

        let evMeasureChords= evChordElement.parentNode;
        
        console.log("evMeasureChords", evMeasureChords);
        console.log(droppedData);

        // mi measure index, ci chord index
        let mi = parseInt(droppedData.id.charAt(1));
        let ci = parseInt(droppedData.id.charAt(3));


        let targetMeasureChords = ev.target.parentNode;
        let targetMeasure = targetMeasureChords.parentNode;

        console.log("mi - ci :", mi," ", ci);

        console.log ("chart: ", this.chart);

       let movedChord = this.chart.measures[mi].chords[ci];
       let chordCopy = new Chord (movedChord.id, movedChord.tone, movedChord.type);
       

       let measureObject = this.chart.measures.find(obj => {
        return obj.id == targetMeasure.id;
        });

       //tci  target chord index, tmi target measure index
       let tci = Array.prototype.indexOf.call(targetMeasureChords.children, ev.target);
      
       measureObject.chords[tci] = chordCopy;
       if (!(ev.target === evChordElement)) {
            this.chart.measures[mi].chords[ci] = null;
       }
              
       this.updateDisplay();

    }

    deleteItem(ev){

        ev.preventDefault();
        console.log("droppedData: ", ev.dataTransfer.getData("text"));
        let droppedData = {};
        if(ev.dataTransfer.getData("text")){
            droppedData = JSON.parse(ev.dataTransfer.getData("text"));
        }
        
        if (droppedData.isMeasure) {        
            this.deleteMeasure(droppedData);
        }
        else {
           
            this.deleteChord(droppedData);

        }

    }

    deleteChord(droppedData){ 

        let evChordElement = document.getElementById(droppedData.id);
        
        console.log("evChordElement: ", evChordElement);

        let evMeasureChords= evChordElement.parentNode;
        
        console.log("evMeasureChords", evMeasureChords);
        console.log(droppedData);

        // mi measure index, ci chord index
        let mi = parseInt(droppedData.id.charAt(1));
        let ci = parseInt(droppedData.id.charAt(3));
      
        this.chart.measures[mi].chords[ci] = null;
   
              
       this.updateDisplay();

    }

    deleteMeasure(droppedData) {
       
        for (let i = 0; i < this.chart.measures.length; i++) {
            if (this.chart.measures[i].id == droppedData.id){
                this.chart.measures.splice(i, 1);
            }

        }

        this.updateDisplay();

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

    loadChartMenu() {

        let loadList = document.createElement("div");

        let oldCharts = this.getSavedCharts();
        let ocObject = JSON.parse(oldCharts);

        if (ocObject == null) {
            alert("There are no saved charts to load");

            return;
        }

        
        for (let i = 0; i < ocObject.length; i++){
            let newSavedChart = document.createElement("div");
            newSavedChart.style.margin = "3px";
            let savedChartName = document.createElement("span");
            let btnLoad = document.createElement("input");
            btnLoad.type = "button";
            btnLoad.value = "load";
            btnLoad.style.margin  = "2px";
            let btnDelete = document.createElement("input");
            btnDelete.type = "button";
            btnDelete.value = "delete";
            btnDelete.style.margin = "2px";
            newSavedChart.appendChild(savedChartName);
            newSavedChart.appendChild(btnLoad);
            newSavedChart.appendChild(btnDelete);
            
            
            let newObject = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key, ocObject[i].measuresPerRow);
            console.log("Object[i] ", ocObject[i]);
            console.log("keyName Object[i] ", ocObject[i].key);
            console.log("newObject", newObject);
            console.log("keyName NewObject ", newObject.getKeyName());
            let chartName = newObject.name + "(" + newObject.getKeyName() + ")";

            
            savedChartName.innerText = chartName;
           
            

            btnLoad.addEventListener("click", () => {
               
                let confirmed = confirm(
                    "Load " + ocObject[i].name + 
                    " over current chart?\n Current Chart will not be saved."
                );
                //console.log(confirmed);

                if(confirmed){
                    console.log("Loading: ", ocObject[i].name);
                    console.log("this.chart before: ", this.chart);
                    console.log("loading Chart", ocObject[i]);

                    this.loadChart(ocObject[i]);

                    this.updateDisplay();
                    this.editDisplay.closeLoadModal();

                } else {
                    return;
                }
                
            }); 

            btnDelete.addEventListener("click", () => {

                let confirmed = confirm(
                    "Delete" + ocObject[i].name + "from saved items?"
                );

                if(confirmed) {

                    this.deleteSavedChart(ocObject[i]);

                    this.updateDisplay();
                    this.editDisplay.closeLoadModal();

                }

            });

            newSavedChart.style.cursor = "pointer";

            loadList.appendChild(newSavedChart);
        }

        this.editDisplay.displayChartsToLoad(loadList);
    }

    loadChart(chart){ 

        console.log("Loading: ", chart.name);
        console.log("this.chart before: ", this.chart);
        console.log("loading Chart", chart);

            this.chart = new Chart(chart.id, chart.name, chart.key, chart.measuresPerRow);

            console.log("TC length: ", chart.toolChords.length);
            

            for (let tci = 0; tci < chart.toolChords.length; tci++){
                let otc = chart.toolChords[tci];
                let newChord = new Chord(otc.id, otc.tone, otc.type, otc.isToolBarChord);
                
                console.log("TC length: ", chart.toolChords.length);
                console.log("tci: ", tci);
                console.log("tci < TC.lenght", tci < chart.toolChords.length)
                this.chart.toolChords.push(newChord);
            }

            for (let mi = 0; mi < chart.measures.length; mi++){

                let om = chart.measures[mi];

                let newMeasure = new Measure(om.id, om.beats, om.isPageBreak);
                
                for (let ci = 0; ci < om.chords.length; ci++){
                    let oc = om.chords[ci];
                    let newChord = new Chord(oc.id, oc.tone, oc.type, oc.isToolBarChord);

                    newMeasure.chords.push(newChord);
                }

                
                

                for (let li = 0; li < om.chords.length; li++){
                    let ol = om.lyrics[li];
                    newMeasure.lyrics.push(ol);
                }

                this.chart.measures.push(newMeasure);

            }
                                
            console.log("this.chart after: ", this.chart);

            

        

        console.log("Loaded chart: ", this.chart);
    }

    deleteSavedChart(chart) {
        let oldCharts = this.getSavedCharts();
        let ocObject = JSON.parse(oldCharts);
        let newCharts = [];
        for (let n = 0; n < ocObject.length; n++){


            if (ocObject[n].id == chart.id){
              continue;
            } else {
              newCharts.push(ocObject[n]);
            }
        }   
        
        localStorage.setItem("savedCharts", JSON.stringify(newCharts));
    
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

    newChart(isConstructor) {

        let confirmation = true;
        
        if (!isConstructor){
            confirmation = confirm("Are you sure you want to create a new chart?"
            + "Any unsaved data on the current chart will be lost.");
        }
        
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
        let newName = prompt("Please enter the new chart name: ");

        if (newName ){
            this.chart.setName(newName);
        }
        
        this.updateDisplay();
    }

    addLyric(measure, index, domLyric) {
       
        let newLyric = prompt("Please enter the new lyric: ");
        
        if (newLyric) {
            measure.addLyric(newLyric, index);
            domLyric.innerText = newLyric;
        }
        

        
    }

    

}

/*******************************************************************
 * View Controller
 *******************************************************************/

export class ViewController{
    constructor() {
       
        
        let currentChart = this.getCurrentChart();
        
        if (currentChart != null){
            try{
                this.loadChart(currentChart);
            } catch (error){
                console.error(error);
            }
            
        } else {
            alert("Something went Wrong. Cannot Load Chart!");
            window.location ="view.html";

        }

        this.page = 0;
        this.viewDisplay = new ViewDisplay();
        this.key = 0;
        this.maxPages = this.getMaxPages();
        
        console.log("MaxPages", this.maxPages);

        this.disablePageNextButton();
        this.disablePagePrevButton();

        if (this.maxPages > 1) {
           this.enablePageNextButton();
        }


        this.updateDisplay();

    }

    updateDisplay() {
        this.viewDisplay.renderView(this.chart, this.page);
    }

    prevPage() {
        this.page--;

        if (this.page <= 0) {
            this.page = 0;
            this.disablePagePrevButton();
        } else {
            this.enablePagePrevButton();
        }

        if (this.page >= this.maxPages) {
            this.page = this.MaxPages - 1;
            this.disablePageNextButton();
        } else {
            this.enablePageNextButton();
        }

        this.updateDisplay();
    }

    nextPage() {
       this.page ++;
        console.log("max pages", this.maxPages);
        console.log("this page", this.page);

       if (this.page >= this.maxPages) {
           this.page = this.maxPages - 1;
           this.disablePageNextButton();
       } else {
           this.enablePageNextButton();
       }

       if (this.page <= 0) {
           this.page = 0;
           this.disablePagePrevButton();
       } else {
           this.enablePagePrevButton();
       }
       
       this.updateDisplay();

    }

    disablePageNextButton() {
        let button = document.getElementById("pageNext");
        button.disabled = true;
        //button.addEventListener("click", () =>{ });
       
        this.viewDisplay.disablePageNavigationButton(button);
    }

    enablePageNextButton() {
        let button = document.getElementById("pageNext");
        button.disabled = false;
               
        this.viewDisplay.enablePageNavigationButton(button);


    }

    disablePagePrevButton() {
        let button = document.getElementById("pagePrev");
        button.disabled = true;
        
        this.viewDisplay.disablePageNavigationButton(button);

    }

    enablePagePrevButton() {
        let button = document.getElementById("pagePrev");
        button.disabled = false;

        this.viewDisplay.enablePageNavigationButton(button);
    }


    updateKey() {
        
        let oldKey = this.chart.getKey();
        let newKey = parseInt(document.getElementById("key").value);

        
        for (let mi = 0; mi < this.chart.measures.length; mi++){

            for (let ci = 0; ci < this.chart.measures[mi].chords.length; ci++){
                this.chart.measures[mi].chords[ci].transposeKey(oldKey, newKey);
            }
        }

        this.chart.key = newKey; 
        
        this.updateDisplay();

    }

    getMaxPages() {

        let maxPages = 1;

        for (let i = 0; i < this.chart.measures.length; i++) {
            if (this.chart.measures[i].isPageBreak) {
                maxPages ++;
            }

        }

        return maxPages;

    }
    

    getCurrentChart() {

        let currentChart = localStorage.getItem("currentChart");
        let ccObject = JSON.parse(currentChart);

        if (ccObject == null){

             return new Chart(Date.now(), "New Chart", 0);
        } 

        return ccObject;      

    }



    loadChartMenu() {

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
            
            let newObject = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key, ocObject[i].measuresPerRow);

            let chartName = newObject.name + "(" + newObject.getKeyName() + ")";

            newSavedChart.innerText = chartName;
            newSavedChart.addEventListener("click", () => {
               
                let confirmed = confirm(
                    "Load " + ocObject[i].name + 
                    " over current chart?\n Current Chart will not be saved."
                );
                console.log(confirmed);

                if(confirmed){
                    console.log("Loading: ", ocObject[i].name);
                    console.log("this.chart before: ", this.chart);
                    console.log("loading Chart", ocObject[i]);

                    this.chart = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key);

                    console.log("TC length: ", ocObject[i].toolChords.length);
                    

                    for (let tci = 0; tci < ocObject[i].toolChords.length; tci++){
                        let otc = ocObject[i].toolChords[tci];
                        let newChord = new Chord(otc.id, otc.tone, otc.type, otc.isToolBarChord);
                        
                        console.log("TC length: ", ocObject[i].toolChords.length);
                        console.log("tci: ", tci);
                        console.log("tci < TC.lenght", tci < ocObject[i].toolChords.length)
                        this.chart.toolChords.push(newChord);
                    }

                    for (let mi = 0; mi < ocObject[i].measures.length; mi++){

                        let om = ocObject[i].measures[mi];

                        let newMeasure = new Measure(om.id, om.beats, om.isPageBreak);
                        
                        for (let ci = 0; ci < om.chords.length; ci++){
                            let oc = om.chords[ci];
                            let newChord = new Chord(oc.id, oc.tone, oc.type, oc.isToolBarChord);

                            newMeasure.chords.push(newChord);
                        }

                        
                        

                        for (let li = 0; li < om.chords.length; li++){
                            let ol = om.lyrics[li];
                            newMeasure.lyrics.push(ol);
                        }

                        this.chart.measures.push(newMeasure);

                    }
                                        
                    console.log("this.chart after: ", this.chart);

                    this.updateDisplay();
                    this.viewDisplay.closeLoadModal();

                } else {
                    return;
                }
                
            }); 

            newSavedChart.style.cursor = "pointer";

            loadList.appendChild(newSavedChart);
        }

        this.viewDisplay.displayChartsToLoad(loadList);

    }

    loadChart(chart){ 

        console.log("Loading: ", chart.name);
        console.log("this.chart before: ", this.chart);
        console.log("loading Chart", chart);

            this.chart = new Chart(chart.id, chart.name, chart.key, chart.measuresPerRow);

            console.log("TC length: ", chart.toolChords.length);
            

            for (let tci = 0; tci < chart.toolChords.length; tci++){
                let otc = chart.toolChords[tci];
                let newChord = new Chord(otc.id, otc.tone, otc.type, otc.isToolBarChord);
                
                console.log("TC length: ", chart.toolChords.length);
                console.log("tci: ", tci);
                console.log("tci < TC.lenght", tci < chart.toolChords.length)
                this.chart.toolChords.push(newChord);
            }

            for (let mi = 0; mi < chart.measures.length; mi++){

                let om = chart.measures[mi];

                let newMeasure = new Measure(om.id, om.beats, om.isPageBreak);
                
                for (let ci = 0; ci < om.chords.length; ci++){
                    let oc = om.chords[ci];
                    let newChord = new Chord(oc.id, oc.tone, oc.type, oc.isToolBarChord);

                    newMeasure.chords.push(newChord);
                }

                
                

                for (let li = 0; li < om.chords.length; li++){
                    let ol = om.lyrics[li];
                    newMeasure.lyrics.push(ol);
                }

                this.chart.measures.push(newMeasure);

            }
                                
            console.log("this.chart after: ", this.chart);

        //this.updateDisplay();
            

        

        console.log("Loaded chart: ", this.chart);
    }

    selectColors() {
        let backgroundList = document.createElement("div");
        let fontList = document.createElement("div");

        //add backgrounds
       

        for (let c = 0; c < 5; c++){
            let color = "";
            let colorName ="";
            switch(c) {
                case 0:
                    color = "white";
                    colorName = "White";
                break;
                case 1:
                    color = "antiquewhite";
                    colorName = "Antique White";
                break;
                case 2:
                    color = "darkkhaki";
                    colorName = "Dark Khaki";
                break;
                case 3:
                    color = "darkgray";
                    colorName = "Dark Gray";
                break;
                case 4:
                    color = "black";
                    colorName = "Black";
                break;
                default:
                    color = "white";
                    colorName = "White";
                break;

            }


            let background = document.createElement("div");
            background.padding = "3px";
            background.style.margin = "3px";
            background.height = "2rem";
            let backgroundBox = document.createElement("span");
            let backgroundButton = document.createElement("input");
            backgroundBox.classList.add("colorBox");
            background.classList.add("colorSelection");
            backgroundBox.style.backgroundColor = color;
            background.id = color + "Background";
            background.innerText = colorName;
            background.appendChild(backgroundBox);
            background.appendChild(backgroundButton);
            backgroundButton.type = "button";
            backgroundButton.value = "Select";
            backgroundButton.height = "75%";
            backgroundButton.addEventListener("click", () => {
                 this.viewDisplay.changeBackgroundColor(color);
                 this.viewDisplay.closeLoadModal();
            });
            backgroundList.appendChild(background);
            
        }
        

        //add fonts
       

        for (let c = 0; c < 5; c++){
            let color = "";
            let colorName ="";
            switch(c) {
                case 0:
                    color = "white";
                    colorName = "White";
                break;
                case 1:
                    color = "antiquewhite";
                    colorName = "Antique White";
                break;
                case 2:
                    color = "darkkhaki";
                    colorName = "Dark Khaki";
                break;
                case 3:
                    color = "darkgray";
                    colorName = "Dark Gray";
                break;
                case 4:
                    color = "black";
                    colorName = "Black";
                break;
                default:
                    color = "white";
                    colorName = "White";
                break;

            }


            let font = document.createElement("div");
            font.padding = "3px";
            font.style.margin = "3px";
            let fontBox = document.createElement("span");
            let fontButton = document.createElement("input");
            fontBox.classList.add("colorBox");
            font.classList.add("colorSelection");
            fontBox.style.backgroundColor = color;
            font.id = color + "Font";
            font.innerText = colorName;
            font.appendChild(fontBox);
            font.appendChild(fontButton);
            fontButton.type = "button";
            fontButton.value = "Select";
            fontButton.height = "75%";
            fontButton.addEventListener("click", () => {
                 this.viewDisplay.changeFontColor(color);
                 this.viewDisplay.closeLoadModal();
            });

            fontList.appendChild(font);
            
        }

        
        
        //call display in view
        this.viewDisplay.displayColorsModal(backgroundList, fontList);


    }

    updateColors() {

    }

    getSavedCharts(){
        return localStorage.getItem("savedCharts");
    }


}