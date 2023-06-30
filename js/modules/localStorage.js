import { setItems, setTools } from "../data/playerItems.js";

export function updateLocalStorage(items, tools){
    let itemsString = JSON.stringify(items);
    let toolsString = JSON.stringify(tools);
    localStorage.setItem("items", itemsString);
    localStorage.setItem("tools", toolsString);
}

export function importLocalStorage(){
    if(localStorage.getItem("items") != null & localStorage.getItem("tools") != null){
        setItems(localStorage.getItem("items"));
        setTools(localStorage.getItem("tools"));
    }
    
}