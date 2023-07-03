import {itemList, toolList} from "../data/items.js";
import {items, tools, addItem, addTool} from "../data/playerItems.js";

import * as itemHandler from "./itemHandler.js";

import { updateRecipes } from "./recipeHandler.js";
import { updateSieveDisplay } from "./sieveHandler.js";
import { updateFurnaceDisplay } from "./furnaceHandler.js";
import { selectItem,selectedItem,clearSelectedItem, selectOne, updateSelectedItem, selectTool, itemSelected } from "./itemSelection.js";
import { blockDisplay } from "./blockHandler.js";
import { updateLocalStorage } from "./localStorage.js";
import { hideTooltip, showItemTooltip } from "./tooltipHandler.js";

function itemHoverListeners(){
    $("#items-body .item-icn").off("mouseenter");
    $("#items-body .item-icn").mouseenter(function(){
        showItemTooltip(items[this.dataset.index]);
    })
    $("#items-body .item-icn").off("mouseleave");
    $("#items-body .item-icn").mouseleave(function(){
        hideTooltip();
    })

    $("#tools-body .item-icn").off("mouseenter");
    $("#tools-body .item-icn").mouseenter(function(){
        showItemTooltip(tools[this.dataset.index]);
    })
    $("#tools-body .item-icn").off("mouseleave");
    $("#tools-body .item-icn").mouseleave(function(){
        hideTooltip();
    }) 
}

// Handles inventory item clicks
function itemClickListeners(){
    $("#items-body .item-icn").off("mousedown");
    $("#items-body .item-icn").mousedown(function(event){
        switch (event.which) {
            case 1:
                selectItem(this.dataset.index);
                break;
            case 2:
                break;
            case 3:
                selectOne(this.dataset.index);
                break;
            default:
                console.log("unknown mouse button clicked");
        }
        
    })
    $("#tools-body .item-icn").mousedown(function(){
        selectTool(this.dataset.index)
    })
}

function itemDividerListeners(){

    $("#items-body .item-divider").off("mousedown");
    $("#items-body .item-divider").mousedown(function(event){
        console.log(this.dataset.invSlot)
        if (selectedItem.group != "tool"){
            switch (event.which) {
                case 1:
                    addItem(selectedItem, this.dataset.invSlot);
                    clearSelectedItem();
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default:
                    console.log("unknown mouse button clicked");
            }
    
            
            updateInventory();
        }
        
    })
}

function toolDividerListeners(){

    

    $("#tools-body .tool-divider").off("mousedown");
    $("#tools-body .tool-divider").mousedown(function(event){
        if (selectedItem.group == "tool"){
            switch (event.which) {
                case 1:
                    addTool(JSON.parse(JSON.stringify(selectedItem)), this.dataset.invSlot);
                    clearSelectedItem();
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default:
                    console.log("unknown mouse button clicked");
            }
    
            
            updateInventory();
        }
        
    })
}

function dividerItemSelectedCheck(){
    if (!itemSelected){
        $("#items-body .item-divider").css("pointer-events", "none");
    }else{
        $("#items-body .item-divider").css("pointer-events", "auto");
    }

    if (!itemSelected){
        $("#tools-body .tool-divider").css("pointer-events", "none");
    }else{
        $("#tools-body .tool-divider").css("pointer-events", "auto");
    }
}

// Refreshes the view of the inventory
export function updateInventory(){
    $("#items-body").html("");
    $("#tools-body").html("");
    $("#items-body").append("<div class ='divider-container' style='width: 0'><div class='item-divider' data-invSlot='0'></div></div>");
    $("#tools-body").append("<div class ='divider-container' style='width: 0'><div class='tool-divider' data-invSlot='0'></div></div>");
    items.forEach((item,index) => {
        itemList.forEach(itemEl => {
            if (item.name == itemEl.name){
                
                $("#items-body").append("<div class='item-icn' data-index='"+index+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(item.amount)+"</p></div>")
                $("#items-body").append("<div class ='divider-container'> <div class='item-divider' data-inv-slot='"+ Number(index+1) +"'></div></div>");
            }
        })
    })
    tools.forEach((tool,index) => {
        $("#tools-body").append("<tr><td><div class='item-icn' style='height: 60px' data-index='"+index+"'><img src='"+tool.image+"' style='"+tool.color+"' ><div class='progress' style='height:6px'><div class='tool-progress progress-bar' class='progress-bar bg-danger' role='progressbar' style='width: "+Math.floor((tool.durability/tool.maxDurability)*100)+"%' aria-valuenow='"+Math.floor((tool.durability/tool.maxDurability))+"' aria-valuemin='0' aria-valuemax='100'></div></div></div></td></tr>")
        $("#tools-body").append("<div class ='divider-container' ><div class='tool-divider' data-inv-slot='"+ Number(index+1) +"'></div></div>");
    })

    updateSieveDisplay();
    updateFurnaceDisplay();
    updateRecipes();
    itemClickListeners();
    itemDividerListeners();
    toolDividerListeners();
    itemHoverListeners();
    hideTooltip();
    updateLocalStorage(items, tools);
    dividerItemSelectedCheck();
}

// Removes an item from the array when it reaches an amount of 0
function itemZeroCheck(){
    for (let i = items.length-1; i>=0; --i){
        if (items[i].amount<1){
            items.splice(i,1)
        }
    }
    updateInventory();
}

// Removes the tool if its duribility reaches 0
export function checkToolDurability(){
    tools.forEach((tool, index)=>{
        if (tool.durability == 0){
            tools.splice(index, 1);
            blockDisplay();
        }
    })
    updateInventory();
}

export function giveTool(itemStack){
    tools.push(itemStack);
    blockDisplay();
    updateInventory();
}

// General function for when you obtain an item
export function collectItem(itemStack){
    let alreadyObtained = false;
    if (itemStack.group == "tool"){
        toolList.forEach(toolEl => {
            if (itemStack.name == toolEl.name){
                tools.push({name: toolEl.name, image: toolEl.image, color: toolEl.color, group: toolEl.group, type: toolEl.type, power: toolEl.power, maxDurability: toolEl.maxDurability, durability:toolEl.maxDurability})
            }
        })
        blockDisplay();
    }else{
        items.forEach(item => {
            if (itemStack.name == item.name){
                alreadyObtained = true;
                item.amount += itemStack.amount
            }
        })
        if(!alreadyObtained){
            items.push(itemStack);
        }
    }
    updateInventory();
}

export function removeIndex(idx, amount){
    items[idx].amount -= amount;
    itemZeroCheck();
}

export function removeTool(idx){
    tools.splice(idx, 1);
    blockDisplay();
    updateInventory();
}

// Function for removing a specific amount of items
export function removeItem(name, amount){
    
    items.forEach(item=>{
        if (item.name == name){
            item.amount -= amount;
            itemZeroCheck();
        }
    })
    // Move to own function eventually
    tools.forEach(tool=>{
        if (tool.name == name){
            tool.durability -= amount;
            checkToolDurability();
        }
    })
}