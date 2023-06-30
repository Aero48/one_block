// TODO planks to tool handle
import * as inventory from "./modules/inventory.js";
import {addSelectedClick, removeSelectedClick} from "./modules/itemSelection.js";
import { recipeTabClick } from "./modules/recipeHandler.js";
import { sieveClick } from "./modules/sieveHandler.js";
import { furnaceUpdate, furnaceListeners } from "./modules/furnaceHandler.js" ;
import { randomBlock, blockClick } from "./modules/blockHandler.js";
import { importLocalStorage, clearLocalStorage } from "./modules/localStorage.js";
import { hideTooltip } from "./modules/tooltipHandler.js";


let dragItem = document.getElementById('drag-item');const onMouseMove = (e) =>{
    dragItem.style.left = e.pageX + 'px';
    dragItem.style.top = e.pageY + 'px';
  }
document.addEventListener('mousemove', onMouseMove);

let dragTooltip = document.getElementById('item-tooltip');const onCursorMove = (e) =>{
    dragTooltip.style.left = Number(e.pageX+25) + 'px';
    dragTooltip.style.top = Number(e.pageY+25) + 'px';
  }
document.addEventListener('mousemove', onCursorMove);

function clickListeners(){
    $("#block").click(function(){
        blockClick();  
    })
    
    $(".recipe-tab a").click(function(){
        recipeTabClick(this.dataset.recipetab);
        $(".recipe-tab a").removeClass("active")
        $(this).addClass("active")
    })

    $("#add-selected-item").click(function(){
        addSelectedClick();
    })

    $("#remove-selected-item").click(function(){
        removeSelectedClick();
    })

    $("#sieve").click(function(){
        sieveClick();
    })

    furnaceListeners();

    $("#reset-game").click(function(){
        clearLocalStorage();
    })
    
}

$(document).ready(function(){
    randomBlock("overworld");
    importLocalStorage();
    
    inventory.updateInventory();
    clickListeners();
    
    
    const furnaceInterval = setInterval(furnaceUpdate, 1000);
});