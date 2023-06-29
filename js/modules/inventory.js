import {itemList, toolList} from "../data/items.js";
import {items, tools, addItem} from "../data/playerItems.js";

import * as itemHandler from "./itemHandler.js";

import { updateRecipes } from "./recipeHandler.js";
import { updateSieveDisplay } from "./sieveHandler.js";
import { updateFurnaceDisplay } from "./furnaceHandler.js";
import { selectItem,selectedItem,clearSelectedItem, selectOne, updateSelectedItem } from "./itemSelection.js";
import { blockDisplay } from "./blockHandler.js";

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
}

function itemDividerListeners(){
    $("#items-body .item-divider").off("click");
    $("#items-body .item-divider").mousedown(function(event){
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
    })
}

// Refreshes the view of the inventory
export function updateInventory(){
    $("#items-body").html("");
    $("#tools-body").html("");
    $("#items-body").append("<div class='item-divider' data-invSlot='0'></div>");
    items.forEach((item,index) => {
        itemList.forEach(itemEl => {
            if (item.name == itemEl.name){
                
                $("#items-body").append("<div class='item-icn' title='"+itemEl.name+" x"+ item.amount +"' data-index='"+index+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(item.amount)+"</p></div>")
                $("#items-body").append("<div class='item-divider' data-inv-slot='"+ Number(index+1) +"'></div>");
            }
        })
    })
    tools.forEach(tool => {
        $("#tools-body").append("<tr><td><div class='item-icn' style='height: 60px' title='"+tool.name+": "+ tool.durability + "/" + tool.maxDurability + "'><img src='"+tool.image+"' style='"+tool.color+"' ><div class='progress' style='height:6px'><div class='tool-progress progress-bar' class='progress-bar bg-danger' role='progressbar' style='width: "+Math.floor((tool.durability/tool.maxDurability)*100)+"%' aria-valuenow='"+Math.floor((tool.durability/tool.maxDurability))+"' aria-valuemin='0' aria-valuemax='100'></div></div></div></td></tr>")
    })

    updateSieveDisplay();
    updateFurnaceDisplay();
    updateRecipes();
    itemClickListeners();
    itemDividerListeners();
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