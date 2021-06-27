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
        loadModal.classList.add("loadModal");

        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "modal";

        let closeButton = document.createElement("span");
        closeButton.classList.add("closeButton");
        closeButton.innerText = "X";
        closeButton.style.visibility = "visible";


        loadModal.appendChild(closeButton);
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

    

    

    displayKeyChange(newKey){

    }

    pageForward() {

    }

    pageBack() {

    }
    
}