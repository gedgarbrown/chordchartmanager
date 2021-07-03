export class EditDisplay {
    constructor() {
        this.idGenerator = 0;
    }

    displayMeasures(newContent) {

        let content = document.getElementById("chartContent");
        content.innerHTML = "";
        let contentParent = content.parentNode;

        content.remove();

        contentParent.appendChild(newContent);

    }

    moveToView() {

    }

    displayKeyChange() {
        //this.displayChordsForToolBar(chords);
    }

    displayItemChange() {

    }

    clearChordsForToolBar() {
        let toolBarChords = document.getElementById("frameChords");
        toolBarChords.innerHTML = "";
    }

    displayChordInToolBar(chord) {
       
        let toolBarChords = document.getElementById("frameChords");
        
        toolBarChords.appendChild(chord);
        
        

        
    }

    renderEdit(chart) {
        
        this.displayKeyChange(chart.getKey());
        //this.displayChordsForToolBar(chart.toolChords);
        //this.displayMeasures(chart.measures);
        this.displayTitle(chart.name);

        document.getElementById("title").innerText = chart.name;

    }

    displayTitle(chartName){
        let title = document.getElementById("title");

        title.innerText = chartName;

    }

    displayChartSaved(){

        
        let newModal = document.createElement("div");
        document.body.appendChild(newModal);
        newModal.innerText = "Chart Saved";
        newModal.classList.add("alertModal");
        newModal.style.visibility = "visible";
        
        setTimeout(() => {newModal.remove();}, 3000);

    }

    displayChartsToLoad(loadList) {
        /*
         <div id="modal" class="modal">
            <div id="loadModal" class="loadModal">
                <span id="closeButton" class="closeButton"></span>
                
            </div>
        </div>
        */
       
        let loadModal = document.createElement("div");
        let loadHeader = document.createElement("div");
        
        loadModal.classList.add("loadModal");

        let header = document.createElement("h4");

        header.innerText = "Available Charts";

        header.appendChild(document.createElement("hr"));

        loadHeader.appendChild(header);    

        

        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "modal";

        let closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.innerText = "X";
        closeButton.style.visibility = "visible";


        loadModal.appendChild(closeButton);
        loadModal.appendChild(loadHeader);
        loadModal.appendChild(loadList);
        
        
        document.body.appendChild(modal);
        modal.appendChild(loadModal);

       modal.focus();


        loadModal.style.visibility = "visible";
        modal.style.visibility = "visible";
        modal.classList.add("showModal");
        closeButton.addEventListener("click", () => {
            this.closeLoadModal();
        });


    }

    closeLoadModal() {
        
        let modal = document.getElementById("modal");
        modal.remove();
    }



}

export class ViewDisplay {
    moveToEdit() {

    }

    renderView(chart, page) {
        let chartTitle = document.getElementById("title");
        chartTitle.innerText = chart.name;
        
        this.updateChartContent(chart, page);
        
    }

    updateChartContent(chart, page) {
        let chartFrame = document.getElementById("chartFrame");
        chartFrame.innerHTML = "";

        let chartContent = document.createElement("div");
        chartContent.id = "chartContent";
        chartFrame.appendChild(chartContent);
        let measures = chart.measures;

        let measuresCurrentRow = 0;
        let rowNumbers = 0;
        let mpr = 4; 

        let pageCount = 0; 

        let row = null; 

        for(let i = 0; i < measures.length; i++) {

            if(measures[i].isPageBreak) {
                pageCount++;
                continue;
            }

            if(page != pageCount){
                continue;
            }
           
            if (!(measuresCurrentRow%mpr) || measures[i].isPageBreak) {

                row = document.createElement("div");
                
                chartContent.appendChild(row);

                let rowClass = "rowMeasures" + (measures[i].isPageBreak ? 1 : mpr);

                //console.log("New Row ", rowClass);
                row.classList.add(rowClass);
                                
                rowNumbers++;
                row.id = rowNumbers;

            }    

            let newMeasure = document.createElement("div");

            row.appendChild(newMeasure);
            measuresCurrentRow++;

            newMeasure.id = measures[i].id;
            newMeasure.draggable = false;
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

                let currentChord = measures[i].chords[x];

                if (!currentChord) {
                    beatChord.innerHtml = "&nbsp;";
                } else {
                    beatChord.innerHtml = "";
                    beatChord.innerText = currentChord.getChordName();
                }

                beatLyric.innerHTML = "&nbsp;";

                measureChords.appendChild(beatChord);
                measureLyrics.appendChild(beatLyric);


            }

           
        }

    }

    

    displayKeyChange(newKey) {
        let key = document.getElementById("key");
        key.value = newKey;
    }

    pageForward() {

    }

    pageBack() {

    }

    displayChartsToLoad(loadList) {
        /*
         <div id="modal" class="modal">
            <div id="loadModal" class="loadModal">
                <span id="closeButton" class="closeButton"></span>
                
            </div>
        </div>
        */
       
        let loadModal = document.createElement("div");
        let loadHeader = document.createElement("div");
        
        loadModal.classList.add("loadModal");

        let header = document.createElement("h4");

        header.innerText = "Available Charts";

        header.appendChild(document.createElement("hr"));

        loadHeader.appendChild(header);    

        

        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "modal";

        let closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.innerText = "X";
        closeButton.style.visibility = "visible";


        loadModal.appendChild(closeButton);
        loadModal.appendChild(loadHeader);
        loadModal.appendChild(loadList);
        
        
        document.body.appendChild(modal);
        modal.appendChild(loadModal);

       modal.focus();


        loadModal.style.visibility = "visible";
        modal.style.visibility = "visible";
        modal.classList.add("showModal");
        closeButton.addEventListener("click", () => {
            this.closeLoadModal();
        });


    }

    closeLoadModal() {
        
        let modal = document.getElementById("modal");
        modal.remove();
    }

    disablePageNavigationButton(button) {
        button.classList = "";
        button.classList.add("pageButtonDisabled");
        button.style.visibilty = "hidden";

    }

    enablePageNavigationButton(button) {
        button.classList = "";
        button.classList.add("pageButtonEnabled");
        button.style.visibility = "visible";
    }

    changeBackgroundColor(color) {
        document.body.style.backgroundImage = "linear-gradient(" + color + ", " + color + ")";
        document.body.style.backgroundColor = color;
    }

    changeFontColor(color) {
       document.body.style.color = color;
    }

    displayColorsModal(backgroundList, fontList) {
        
       
        let loadModal = document.createElement("div");
        let loadHeaderBackground = document.createElement("div");
        let loadHeaderFont = document.createElement("div");
        
        loadModal.classList.add("loadModal");

        let headerBackground = document.createElement("h4");
        let headerFont = document.createElement("h4");

        headerBackground.innerText = "Background Colors";
        headerBackground.appendChild(document.createElement("hr"));

        headerFont.innerText = "Font Colors";
        headerFont.appendChild(document.createElement("hr"));


        loadHeaderBackground.appendChild(headerBackground);    
        loadHeaderFont.appendChild(headerFont); 
        

        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "modal";

        let closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.innerText = "X";
        closeButton.style.visibility = "visible";


        loadModal.appendChild(closeButton);
        loadModal.appendChild(loadHeaderBackground);
        loadModal.appendChild(backgroundList);
        loadModal.appendChild(document.createElement("hr"));
        loadModal.appendChild(document.createElement("hr"));

        loadModal.appendChild(fontList);
        
        
        document.body.appendChild(modal);
        modal.appendChild(loadModal);

       modal.focus();


        loadModal.style.visibility = "visible";
        modal.style.visibility = "visible";
        modal.classList.add("showModal");
        closeButton.addEventListener("click", () => {
            this.closeLoadModal();
        });


    }
    
}