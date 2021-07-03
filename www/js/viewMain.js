import { ViewController } from "./appController.js";


let viewController = new ViewController();


//Header controls
document.getElementById("buttonToEdit").addEventListener("click", () => {
     window.location = "edit.html";});
document.getElementById("load").addEventListener("click", () => {
    viewController.selectChartToLoad();
});
document.getElementById("colors").addEventListener("click", () => {
    viewController.selectColors();
});

//Page controls
/*document.getElementById("pagePrev").addEventListener("click", () =>{
    viewController.prevPage();
});*/

/*document.getElementById("pageNext").addEventListener("click", () =>{
    viewController.nextPage();
});*/
