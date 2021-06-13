import { EditController } from "./appController.js";


let editController = new EditController();





document.getElementById("key").addEventListener("change", () => { editController.updateKey()} )
document.getElementById("buttonToView").addEventListener("click", () => { window.location = "view.html";})