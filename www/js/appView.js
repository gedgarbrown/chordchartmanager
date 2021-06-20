export class EditDisplay {
    constructor() {
        this.idGenerator = 0;
    }

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
            newChord.ondragstart = (ev) => {
                ev.dataTransfer.setData("id", ev.target.id)
            };
            newChord.ondrop = (ev) => {
                alert("dropping");
                ev.preventDefault();
                let data = ev.dataTransfer.getData("id");
                //ev.target.innerText = document.getElementById(data).innerText;
                ev.target.innerText = "C";
            };
        
            let toneName =  chords[i].getToneName();
            //console.log("adding Tone Name:", toneName);
            newChord.innerText = toneName + chords[i].type;

            toolBarChords.appendChild(newChord);
            console.log(i, chords[i].id);//debug 

       }
        

        
    }

    renderEdit(chart) {
        
        this.displayKeyChange(chart.getKey());
        this.displayChordsForToolBar(chart.toolChords);
        this.displayMeasures(chart.measures);
        this.displayTitle(chart.name);

        document.getElementById("title").innerText = chart.name;

    }

    displayTitle(chartName){
        let title = document.getElementById("title");

        title.innerText = chartName;

    }
    displayMeasures(measures) {
        //alert("displaying measures");
        console.log("Running DisplayMeasures: measures:", measures);


        let content = document.getElementById("chartContent");
        content.innerHTML = "";
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

            console.log("is pb: ", measures[i].isPageBreak);

            if (!(measuresCurrentRow%mpr) || measures[i].isPageBreak) {

                //row = this.createNewRow();

               
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

            //measureElements[i] = document.createElement("div");
            let newMeasure = document.createElement("div");
            console.log("current row", row);
            console.log(newMeasure);

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
                
                beatChord.draggable = true;
                beatChord.ondragstart = () => 
                    {ev.dataTransfer.setData("text", ev.target.id)};
                beatChord.ondragover = (ev) => 
                    {ev.preventDefault();}
                beatChord.ondrop = (ev) => 
                        {//ondrop event
                        };
                beatLyric.draggable = true;

                
                measureChords.appendChild(beatChord);
                measureLyrics.appendChild(beatLyric);

            }

                     

        }
    }

   


}

export class ViewDisplay {
    moveToEdit() {

    }

    

    

    displayKeyChange(newKey){

    }

    pageForward() {

    }

    pageBack() {

    }
    
}