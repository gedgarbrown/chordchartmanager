import { ViewController } from "./appController.js";


let viewController = new ViewController();


//Header controls
document.getElementById("key").addEventListener("change", () => {
     viewController.updateKey();
} );

document.getElementById("buttonToEdit").addEventListener("click", () => {
    localStorage.setItem("currentChart", JSON.stringify(viewController.chart)); 
    window.location = "edit.html";
     
    });
document.getElementById("load").addEventListener("click", () => {
    
    viewController.loadChartMenu();
   
});
document.getElementById("colors").addEventListener("click", () => {
    viewController.selectColors();
});

//Page controls
document.getElementById("pagePrev").addEventListener("click", () =>{
    viewController.prevPage();
});

document.getElementById("pageNext").addEventListener("click", () =>{
    viewController.nextPage();
});
