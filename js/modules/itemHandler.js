import {itemList} from "../data/items.js";
import {toolList} from "../data/items.js";
import {items} from "../data/playerItems.js";
import {tools} from "../data/playerItems.js";

// Returns the fastest tool of the requested type
export function findFastestTool(type){
    let currentTool = {
        type: "none",
        power: 0,
    };
    for(let i = 0; i<tools.length; i++){
        if (tools[i].type == type && tools[i].power>currentTool.power){
            currentTool = tools[i];
        }
    }
    return currentTool;
}

// Finds correct item icon for specified item
export function findItemIcon(inputItem){
    let outputImage = "";
    itemList.forEach(item => {
        if (inputItem.name == item.name){
            outputImage = item.image
            
        }
    })
    return outputImage;
}

// Finds correct item color for specified item
export function findItemColor(inputItem){
    let outputColor = "";
    itemList.forEach(item => {
        if (inputItem.name == item.name){
            outputColor = item.color
            
        }
    })
    return outputColor;
}

// Controls how the number is displayed in the bottom right of each item
export function itemAmountIndicator(amount){
    if (amount == 1){
        return "";
    }else if(amount<1000){
        return amount;
    }else if(amount<100000){
        return (Math.floor(amount/100))/10 + 'K';
    }else if(amount<1000000){
        return (Math.floor(amount/1000)) + 'K';
    }else if(amount<100000000){
        return (Math.floor(amount/100000))/10 + 'M';
    }else if(amount<1000000000){
        return (Math.floor(amount/1000000)) + 'M';
    }else{
        return "∞"
    }
}