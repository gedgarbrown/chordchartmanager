import { EditController, ViewController } from "./appController.js";


let editController = new EditController();



//header controls
document.getElementById("setKey").addEventListener("click", () => {
     editController.updateKey(); } );
document.getElementById("buttonToView").addEventListener("click", () => {
    window.location = "view.html";
      localStorage.setItem("currentChart", JSON.stringify(editController.chart));
});
document.getElementById("buttonSave").addEventListener("click",  () => {
    editController.saveChart();
});
document.getElementById("buttonLoad").addEventListener("click", () => {
    editController.loadChartMenu();
});
document.getElementById("title").addEventListener("click", () => {
    editController.changeChartName()
});
//toolbar controls

document.getElementById("addCustomChord").addEventListener("click", () => {
        editController.addCustomChord();
});

document.getElementById("addMeasure").addEventListener("click", () => {
        editController.addMeasure();
});
document.getElementById("addPageTurn").addEventListener("click", () => {
        editController.addPageTurn();
});

document.getElementById("newChart").addEventListener("click", () => {
    editController.newChart(false);
});

document.getElementById("deleteChord").ondragover= (ev) => {
    ev.preventDefault();
}

document.getElementById("deleteChord").ondrop= (ev) => {
    editController.deleteItem(ev);
}








//content controls
document.getElementById("mpr").addEventListener("change", 
    () => {editController.updateMeasuresPerRow();});
