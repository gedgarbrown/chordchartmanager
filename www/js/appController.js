import {Chart, Chord, Measure} from "./appModel.js";
import {EditDisplay, ViewDisplay} from "./appView.js";
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
                
        for(let i = 0; i < measures.length; i++) {
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
            
            let newObject = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key, ocObject[i].isToolBarChord);

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
                        console.log("Is Page Break: ", om.isPageBreak);

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
                    this.editDisplay.closeLoadModal();

                } else {
                    return;
                }
                
            }); 

            newSavedChart.style.cursor = "pointer";

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
       
        this.loadChart(this.getCurrentChart());
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
        
       if (this.page >= this.maxPages) {
           this.page = this.MaxPages - 1;
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
        button.addEventListener("click", () =>{ });
       
        this.viewDisplay.disablePageNavigationButton(button);
    }

    enablePageNextButton() {
        let button = document.getElementById("pageNext");
        button.addEventListener("click", () =>{
            
            this.nextPage();
        });

       
        this.viewDisplay.enablePageNavigationButton(button);


    }

    disablePagePrevButton() {
        let button = document.getElementById("pagePrev");
        button.addEventListener("click", () =>{});
        
        this.viewDisplay.disablePageNavigationButton(button);

    }

    enablePagePrevButton() {
        let button = document.getElementById("pagePrev");
        button.addEventListener("click", () =>{
            this.prevPage();
        });

        this.viewDisplay.enablePageNavigationButton(button);
    }


    transposeKey() {
        alert("TODO: change key");
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
    updateDisplay() {
        this.viewDisplay.renderView(this.chart, this.page);
    }

    getCurrentChart() {

        let currentChart = localStorage.getItem("currentChart");
        let ccObject = JSON.parse(currentChart);

        if (ccObject == null){

             return new Chart(Date.now(), "New Chart", 0);
        } 

        return ccObject;      

    }

    selectChartToLoad() {

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
            
            let newObject = new Chart(ocObject[i].id, ocObject[i].name, ocObject[i].key, ocObject[i].isToolBarChord);

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
        this.chart = chart; // temporary as Object may not have functions 

        console.log("Loading: ", chart.name);
        console.log("this.chart before: ", this.chart);
        console.log("loading Chart", chart);

            this.chart = new Chart(chart.id, chart.name, chart.key);

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
        let whiteBackground = document.createElement("div");
        let whiteBackgroundBox = document.createElement("span");
        let whiteBackgroundButton = document.createElement("input");
        whiteBackgroundBox.classList.add("colorBox");
        whiteBackgroundBox.style.backgroundColor = "white";
        whiteBackground.id = "whiteBackground";
        whiteBackground.innerText = "White";
        whiteBackground.appendChild(whiteBackgroundBox);
        whiteBackground.appendChild(whiteBackgroundButton);
        whiteBackgroundButton.type = "button";
        whiteBackgroundButton.value = "Select Color";
        whiteBackgroundButton.addEventListener("click", () => {
            this.viewDisplay.changeBackgroundColor("white");
            this.viewDisplay.closeLoadModal();
        });
        backgroundList.appendChild(whiteBackground);
        
        

        //add fonts
        let whiteFont= document.createElement("div");
        let whiteFontBox = document.createElement("span");
        let whiteFontButton = document.createElement("input");
        whiteFontBox.classList.add("colorBox");
        whiteFontBox.style.backgroundColor = "white";
        whiteFont.id = "whiteFont";
        whiteFont.innerText = "White";
        whiteFont.appendChild(whiteFontBox);
        whiteFont.appendChild(whiteFontButton);
        whiteFontButton.type = "button";
        whiteFontButton.value = "Select Color";
        whiteFontButton.addEventListener("click", () => {
            this.viewDisplay.changeFontColor("white");
            this.viewDisplay.closeLoadModal();
        });
        fontList.appendChild(whiteFont);


        
        
        //call display in view
        this.viewDisplay.displayColorsModal(backgroundList, fontList);


    }

    updateColors() {

    }

    getSavedCharts(){
        return localStorage.getItem("savedCharts");
    }


}