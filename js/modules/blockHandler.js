import { materials } from "../data/materials.js";
import { toolList } from "../data/items.js";
import * as itemHandler from "./itemHandler.js";
import * as inventory from "./inventory.js";
import { processLoot } from "./lootProcessor.js";


let currentLocation = "overworld"
let currentMaterial = {};
let baseMiningSpeed = 5000;
let isMining = false;

// Displays the current material in the button
export function blockDisplay(){
    $("#block").html("")
    $("#block").text(currentMaterial.name)

    // If you lack the correct tool for the current material, the button is red
    if (currentMaterial.toolRequired && currentMaterial.tool != itemHandler.findFastestTool(currentMaterial.tool).type){
        $("#block").removeClass("btn-primary").addClass("btn-danger");
    }else{
        $("#block").removeClass("btn-danger").addClass("btn-primary");
    }
    switch(currentMaterial.tool){
        case "pickaxe":
            $(".required-tool").html("<img src='images/pickaxe-svgrepo-com.svg'>");
            break;
        case "axe":
            $(".required-tool").html("<img src='images/axe-tool-construction-svgrepo-com.svg'>");
            break;
        case "shovel":
            $(".required-tool").html("<img src='images/shovel-svgrepo-com.svg'>");
            break;
        case "sickle":
            $(".required-tool").html("<img src='images/sickle-svgrepo-com.svg'>");
            break;
        default:
            $(".required-tool").html("");
    }
    
}

// Selects a random block
export function randomBlock(location){
    const localLocation = materials.get(location);
    let totalPool = 0;
    let randomGen = Math.random();
    localLocation.forEach(material => {
        totalPool += material.weight;
    });
    let randomNum = randomGen * totalPool;

    for(let i = 0; i < localLocation.length; i++){
        if(randomNum < localLocation[i].weight){
            currentMaterial = localLocation[i];
            blockDisplay()
            break;
           
        }else{
            randomNum -= localLocation[i].weight;
        }
    }
}

// Determines how fast to break the current block
function miningSpeedCalc(){
    let miningSpeed = baseMiningSpeed*currentMaterial.hardness;
    if (currentMaterial.toolRequired && currentMaterial.tool != itemHandler.findFastestTool(currentMaterial.tool).type){
        miningSpeed *=2; 
    }else{
        miningSpeed -= itemHandler.findFastestTool(currentMaterial.tool).power*miningSpeed;
        
    }
    return miningSpeed;
}


// Run when block is finished mining
function blockMine(){
    // Button can now be clicked again
    isMining = false;
    $( "#block" ).prop( "disabled", false );

    // If a specific tool isn't required or the current tool matches the required tool, give the proper loot
    if((!currentMaterial.toolRequired || (currentMaterial.tool == itemHandler.findFastestTool(currentMaterial.tool).type))){
        itemHandler.findFastestTool(currentMaterial.tool).durability-=1;
        inventory.checkToolDurability();
        processLoot(currentMaterial);
    }
    
    // Generates new block based on current location
    randomBlock(currentLocation);
}

// When block button is clicked, mine the block (assuming you aren't already mining one)
export function blockClick(){
    if(!isMining){
        isMining = true;
        // Visual changes to block button element when mining
        $("#block").html("<div class='spinner-grow text-light'></div>")
        $( "#block" ).prop( "disabled", true );
        // Sets timer based on mining speed, current tool etc. When done, run blockMine
        setTimeout(blockMine, miningSpeedCalc());
    }
    
}