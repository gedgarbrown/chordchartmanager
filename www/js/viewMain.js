import { ViewController } from "./appController.js";


let viewController = new EditController();




document.getElementById("buttonToEdit").addEventListener("click", () => {
     window.location = "edit.html";});
document.getElementById("pagePrev").addEventListener("click", () =>{
    viewController.prevPage();
});
document.getElementById("pageNext").addEventListener("click", () =>{
    viewController.nextPage();
});
