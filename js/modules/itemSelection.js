import * as inventory from "./inventory.js";
import * as itemHandler from "./itemHandler.js";
import {items} from "../data/playerItems.js";


export let selectedItem = {};
export let itemSelected = false;


// Selects an item that is clicked on in the inventory
export function selectItem(idx){
    if (!itemSelected){
        itemSelected = true;
        selectedItem = {name: items[idx].name, amount: items[idx].amount, image:items[idx].image, color:items[idx].color}
        updateSelectedItem();
        inventory.removeItem(selectedItem.name, selectedItem.amount);
    }
}

// Adds selected item back into the inventory
export function addSelectedClick(){
    if (itemSelected){
        inventory.collectItem({name: selectedItem.name, amount: selectedItem.amount})
        clearSelectedItem();
    }
}

// Clears the selected item
export function clearSelectedItem(){
    selectedItem = {};
    itemSelected = false;
    $("#drag-item").html("");
    $("#add-selected-item").prop( "disabled", true )
}

// Updates the html elements for selected item
export function updateSelectedItem(){
    $("#drag-item").html("<div class='item-icn-no-click' title='"+selectedItem.name+"'><img src='"+itemHandler.findItemIcon(selectedItem)+"' style='"+itemHandler.findItemColor(selectedItem)+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(selectedItem.amount)+"</p></div>")
    $("#add-selected-item").prop( "disabled", false )
}