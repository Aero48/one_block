import * as itemHandler from "./itemHandler.js";
import * as inventory from "./inventory.js";
import { itemSelected, selectedItem, updateSelectedItem, clearSelectedItem, addSelectedItem } from "./itemSelection.js";
import { fuel, smeltables } from "../data/fuel.js";
import { hideTooltip, showItemTooltip } from "./tooltipHandler.js";

let furnaceTemp = 0;
let furnaceGoalTemp = 0;
let furnaceMaxTemp = 10000;

export let isHeating = false;
export let isSmelting = false;
let furnaceFuel = {};
let furnaceInput = {};

// When furnace runs out of fuel
export function furnaceBurnOut(){
    furnaceGoalTemp = 0;
    isHeating = false;
    updateFurnace();
}

// Starts smelting process for an item
function furnaceSmelt(name, burnTemp, output){
    if(burnTemp<=furnaceTemp){
        inventory.collectItem({name: output, amount: 1})
    }else{
        inventory.collectItem({name: name, amount: 1})
    }
    isSmelting = false;
    itemHandler.findFastestTool("furnace").durability-=1;
    if (itemHandler.findFastestTool("furnace").durability < 1){
        emptyFurnace();
    }
    inventory.checkToolDurability();
    updateFurnace();
}

// Empties the furnace when player's furnace breaks
function emptyFurnace(){
    if (furnaceFuel.name != null){
        inventory.collectItem({name: furnaceFuel.name, amount: furnaceFuel.amount})
    }
    furnaceFuel = {};
    if (furnaceInput.name != null){
        inventory.collectItem({name: furnaceInput.name, amount: furnaceInput.amount})
    }
    furnaceInput = {};
    furnaceGoalTemp = 0;
    furnaceTemp = 0;
    isHeating = false;
    isSmelting = false;
    furnaceUpdate();
    // Bar doesn't update when new furnace is crafted
    $('#smelt-progress').attr('aria-valuenow', furnaceTemp/furnaceMaxTemp).css('width', (furnaceTemp/furnaceMaxTemp*100)+'%');
    furnaceHeatBarColor();
}

function furnaceHoverListeners(){
    $("#furnace-fuel").off("mouseenter");
    $("#furnace-fuel").mouseenter(function(){
        if (furnaceFuel.name != null){
            showItemTooltip(furnaceFuel);
        }
        
    })
    $("#furnace-fuel").off("mouseleave");
    $("#furnace-fuel").mouseleave(function(){
        hideTooltip();
    })

    $("#furnace-input").off("mouseenter");
    $("#furnace-input").mouseenter(function(){
        if (furnaceInput.name != null){
            showItemTooltip(furnaceInput);
        }
        
    })
    $("#furnace-input").off("mouseleave");
    $("#furnace-input").mouseleave(function(){
        hideTooltip();
    })
}

function updateFurnace(){
    if (furnaceFuel.amount<1 || furnaceFuel.name == null) {
        furnaceFuel = {};
        $("#furnace-fuel").html("");
        
    }else{
        $("#furnace-fuel").html("<div class='item-icn'><img src='"+furnaceFuel.image+"' style='"+furnaceFuel.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(furnaceFuel.amount)+"</p></div>");
    }
    
    if (!isHeating && furnaceFuel.name != null){
        fuel.forEach(fuelItem =>{
            if (fuelItem.name == furnaceFuel.name){
                furnaceGoalTemp = fuelItem.burnTemp;
                setTimeout(function() {
                    furnaceBurnOut();
                }, fuelItem.burnTime)
            }
        })
        furnaceFuel.amount--;
        isHeating = true;
        updateFurnace();
    }

    if (furnaceInput.amount<1 || furnaceInput.name == null) {
        furnaceInput = {};
        $("#furnace-input").html("");
        
    }else{
        $("#furnace-input").html("<div class='item-icn'><img src='"+furnaceInput.image+"' style='"+furnaceInput.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(furnaceInput.amount)+"</p></div>");
    }

    if (!isSmelting && furnaceInput.name != null){
        smeltables.forEach(smeltableItem => {
            if (smeltableItem.name == furnaceInput.name && smeltableItem.burnTemp <= furnaceTemp){
                setTimeout(function() {
                    furnaceSmelt(smeltableItem.name, smeltableItem.burnTemp, smeltableItem.output);
                }, smeltableItem.burnTime)
                furnaceInput.amount--;
                isSmelting = true;
                updateFurnace();
            }
        })
        
    }

    furnaceHoverListeners();
}

// Adds fuel to the furnace input slot
function addFuel(amount){
    if (furnaceFuel.name == null){
        furnaceFuel = {name: selectedItem.name, amount: amount, image: itemHandler.findItemIcon(selectedItem), color: itemHandler.findItemColor(selectedItem)}
    }else{
        furnaceFuel.amount += amount;
    }
    updateFurnace();
}

function removeFuel(amount){
    furnaceFuel.amount -= amount;
    if (furnaceFuel.amount < 1){
        furnaceFuel = {};
    }
    updateFurnace();
}

// Adds items to the furnace input slot
function addFurnaceInput(amount){
    if (furnaceInput.name == null){
        furnaceInput = {name: selectedItem.name, amount: amount, image: itemHandler.findItemIcon(selectedItem), color: itemHandler.findItemColor(selectedItem)}
    }else{
        furnaceInput.amount += amount;
    }
    updateFurnace();
}

function removeFurnaceInput(amount){
    furnaceInput.amount -= amount;
    if (furnaceInput.amount < 1){
        furnaceInput = {};
    }
    updateFurnace();
}

// Determines furnace heat bar color
function furnaceHeatBarColor(){
    if (furnaceTemp == 10000){
        $('#smelt-progress').css('background-color', '#e9dbff')
        $('#furnace-flame-icn').css('filter', 'invert(82%) sepia(28%) saturate(381%) hue-rotate(210deg) brightness(102%) contrast(103%)')
    }else if (furnaceTemp >= 8000){
        $('#smelt-progress').css('background-color', '#bfc4ff')
        $('#furnace-flame-icn').css('filter', 'invert(76%) sepia(24%) saturate(1287%) hue-rotate(194deg) brightness(102%) contrast(111%)')
    }else if (furnaceTemp >= 6000){
        $('#smelt-progress').css('background-color', '#6dcffc')
        $('#furnace-flame-icn').css('filter', 'invert(70%) sepia(84%) saturate(601%) hue-rotate(170deg) brightness(102%) contrast(98%)')
    }else if (furnaceTemp >= 4000){
        $('#smelt-progress').css('background-color', '#ffc107')
        $('#furnace-flame-icn').css('filter', 'invert(81%) sepia(29%) saturate(3521%) hue-rotate(354deg) brightness(103%) contrast(101%)')
    }else if (furnaceTemp >= 2000){
        $('#smelt-progress').css('background-color', '#fd7e14')
        $('#furnace-flame-icn').css('filter', 'invert(75%) sepia(67%) saturate(4748%) hue-rotate(346deg) brightness(96%) contrast(108%)')
    }else if (furnaceTemp > 0){
        $('#smelt-progress').css('background-color', '#dc3545')
        $('#furnace-flame-icn').css('filter', 'invert(16%) sepia(100%) saturate(3214%) hue-rotate(345deg) brightness(107%) contrast(73%)')
    }else{
        $('#furnace-flame-icn').css('filter', 'none')
    }
}

// Furnace temperature-related updates
export function furnaceUpdate(){
    if (furnaceTemp < furnaceGoalTemp){
        furnaceTemp += 200 * itemHandler.findFastestTool("furnace").power;
        $('#smelt-progress').attr('aria-valuenow', furnaceTemp/furnaceMaxTemp).css('width', (furnaceTemp/furnaceMaxTemp*100)+'%');
        furnaceHeatBarColor();
        updateFurnace();
    }else if(furnaceTemp > furnaceGoalTemp){
        furnaceTemp -= 200;
        $('#smelt-progress').attr('aria-valuenow', furnaceTemp/furnaceMaxTemp).css('width', (furnaceTemp/furnaceMaxTemp*100)+'%');
        furnaceHeatBarColor();
        updateFurnace();
    }
    
}

// Listeners for the furnace slots
export function furnaceListeners(){
    $("#furnace-fuel").mousedown(function(event){
        switch (event.which) {
            case 1:
                if (itemSelected){
                    fuel.forEach(fuelItem => {
                        if (selectedItem.name == fuelItem.name && (selectedItem.name == furnaceFuel.name || furnaceFuel.name == null)){
                            addFuel(selectedItem.amount);
                            clearSelectedItem();
                        }
                    })
                }else{
                    addSelectedItem(furnaceFuel, furnaceFuel.amount);
                    removeFuel(furnaceFuel.amount);
                }
                break;
            case 2:
                break;
            case 3:
                if (itemSelected){
                    fuel.forEach(fuelItem => {
                        if (selectedItem.name == fuelItem.name && (selectedItem.name == furnaceFuel.name || furnaceFuel.name == null)){
                            if (selectedItem.amount>1){
                                addFuel(1);
                                selectedItem.amount --;
                                updateSelectedItem();
                            }else{
                                addFuel(1);
                                clearSelectedItem();
                            }
                        }
                    })
                }
                break;
            default:
                console.log("unknown mouse button clicked");
        }
        
    })
    $("#furnace-input").mousedown(function(event){
        switch (event.which) {
            case 1:
                if (itemSelected){
                    smeltables.forEach(smeltItem => {
                        if (selectedItem.name == smeltItem.name && (selectedItem.name == furnaceInput.name || furnaceInput.name == null)){
                            addFurnaceInput(selectedItem.amount);
                            clearSelectedItem();
                        }
                    })
                }else{
                    addSelectedItem(furnaceInput, furnaceInput.amount);
                    removeFurnaceInput(furnaceInput.amount);
                }
                break;
            case 2:
                break;
            case 3:
                if (itemSelected){
                    smeltables.forEach(smeltItem => {
                        if (selectedItem.name == smeltItem.name && (selectedItem.name == furnaceInput.name || furnaceInput.name == null)){
                            if (selectedItem.amount>1){
                                addFurnaceInput(1);
                                selectedItem.amount --;
                                updateSelectedItem();
                            }else{
                                addFurnaceInput(1);
                                clearSelectedItem();
                            }
                        }
                    })
                }
                break;
            default:
                console.log("unknown mouse button clicked");
        }
    })
}

// Displays furnace module only when player has a furnace
export function updateFurnaceDisplay(){
    if (itemHandler.findFastestTool("furnace").power > 0){
        //$("#smelting-container").html('<div class="progress"><div id="smelt-progress" class="progress-bar bg-danger" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div><div class="furnace-bottom-row"><div class="furnace-icon-div"><button class="btn btn-primary furnace-slot" id="furnace-fuel"></button></div><div class="item-icn"><img src="./images/fire-svgrepo-com.svg" alt=""></div><div class="furnace-icon-div"><button class="btn btn-primary furnace-slot" id="furnace-input"></button></div></div>')
        //furnaceUpdate();
        $("#smelting-container").css("display", "block");

    }else{
        $("#smelting-container").css("display", "none");
    }
}