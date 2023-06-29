import * as inventory from "./inventory.js";
import * as itemHandler from "./itemHandler.js";
import {items, tools} from "../data/playerItems.js";
import { isSifting } from "./sieveHandler.js";
import { isHeating, isSmelting } from "./furnaceHandler.js";
import { isMining } from "./blockHandler.js";


export let selectedItem = {};
export let itemSelected = false;

export function addSelectedItem(itemStack, amount){
    selectedItem = {name: itemStack.name, amount: amount};
    itemSelected = true;
    updateSelectedItem();

}

export function selectOne(idx){
    if(!itemSelected || items[idx].name == selectedItem.name){
        if (itemSelected){
            selectedItem.amount++;
        }else{
            itemSelected = true;
            selectedItem = {name: items[idx].name, amount: 1, image:items[idx].image, color:items[idx].color};
        }
        inventory.removeIndex(idx, 1)
        inventory.updateInventory();
        updateSelectedItem();
    }
}

// Selects an item that is clicked on in the inventory
export function selectItem(idx){
    if (!itemSelected){
        itemSelected = true;
        selectedItem = {name: items[idx].name, amount: items[idx].amount, image:items[idx].image, color:items[idx].color}
        updateSelectedItem();
        inventory.removeIndex(idx, selectedItem.amount);
    }
}

export function selectTool(idx){
    console.log(idx);
    if (!itemSelected && !isSifting && !isHeating && !isSmelting && !isMining){
        itemSelected = true;
        selectedItem = JSON.parse(JSON.stringify(tools[idx]));
        updateSelectedItem();
        inventory.removeTool(idx);
    }
}

// Adds selected item back into the inventory
export function addSelectedClick(){
    if (itemSelected){
        if(selectedItem.group == "tool"){
            inventory.collectItem(selectedItem);
            clearSelectedItem();
        }else{
            inventory.collectItem({name: selectedItem.name, amount: selectedItem.amount})
            clearSelectedItem();
        }
        
    }
}

// Removes selected item
export function removeSelectedClick(){
    if (itemSelected){
        clearSelectedItem();
    }
}

// Clears the selected item
export function clearSelectedItem(){
    selectedItem = {};
    itemSelected = false;
    $("#drag-item").html("");
    $("#add-selected-item").prop( "disabled", true )
    $("#remove-selected-item").prop( "disabled", true )
}

// Updates the html elements for selected item
export function updateSelectedItem(){
    if (selectedItem.group == "tool"){
        $("#drag-item").html("<div class='item-icn-no-click' title='"+selectedItem.name+"'><img src='"+selectedItem.image+"' style='"+selectedItem.color+"' ><div class='progress' style='height:6px'><div class='tool-progress progress-bar' class='progress-bar bg-danger' role='progressbar' style='width: "+Math.floor((selectedItem.durability/selectedItem.maxDurability)*100)+"%' aria-valuenow='"+Math.floor((selectedItem.durability/selectedItem.maxDurability))+"' aria-valuemin='0' aria-valuemax='100'></div></div></div>")
        $("#add-selected-item").prop( "disabled", false )
        $("#remove-selected-item").prop( "disabled", false )
    }else{
        $("#drag-item").html("<div class='item-icn-no-click' title='"+selectedItem.name+"'><img src='"+itemHandler.findItemIcon(selectedItem)+"' style='"+itemHandler.findItemColor(selectedItem)+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(selectedItem.amount)+"</p></div>")
        $("#add-selected-item").prop( "disabled", false )
        $("#remove-selected-item").prop( "disabled", false )
    }
    
}