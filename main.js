import {overworldMaterials} from "./materials.js";
import {handRecipes} from "./recipes.js";

let locations = ["Overworld"]
let items = [];
let tools = [
    {
        name: "Flint Pickaxe",
        type: "pickaxe",
        power: 0.1,
        maxDurability: 20,
        durability: 20
    },
    {
        name: "Flint Axe",
        type: "axe",
        power: 0.1,
        maxDurability: 20,
        durability: 20
    },
    {
        name: "Flint Shovel",
        type: "shovel",
        power: 0.2,
        maxDurability: 20,
        durability: 20
    },
    {
        name: "Flint Saw",
        type: "saw",
        maxDurability: 20,
        durability: 20
    }
];
let currentLocation = "overworld"
let currentMaterial = {}

let baseMiningSpeed = 5000;
let isMining = false;
let maxHunger = 20;

// Handles the loot tables
function processLoot(material){
    let totalPool = 0;
    let currentPool = {};
    let randomGen = Math.random();
    material.drops.pools.forEach(pool => {
        totalPool += pool.poolWeight;
    });
    let randomNum = randomGen * totalPool;

    for(let i = 0; i < material.drops.pools.length; i++){
        if(randomNum < material.drops.pools[i].poolWeight){
            currentPool = material.drops.pools[i];
            // Ensures you collect the right amount of the selected item
            currentPool.poolItems.forEach(poolItem =>{
                if (poolItem.amount != null){
                    collectItem({name: poolItem.name, amount: poolItem.amount})
                }else if(poolItem.minAmount != null && poolItem.maxAmount != null){
                    let itemRandomRange = Math.ceil(Math.random()*(poolItem.maxAmount - poolItem.minAmount + 1))+(poolItem.minAmount - 1)
                    console.log(itemRandomRange);
                    collectItem({name: poolItem.name, amount: itemRandomRange})
                }else{
                    collectItem({name: poolItem.name, amount: 1})
                }
                
            })
            break;
           
        }else{
            randomNum -= material.drops.pools[i].poolWeight;
        }
    }
}

// Refreshes the view of the inventory
function updateInventory(){
    $("#items-body").html("");
    $("#tools-body").html("");
    items.forEach(item => {
        $("#items-body").append("<tr><td>"+item.amount+ "x "+ item.name +"</td></tr>")
    })
    tools.forEach(tool => {
        
        $("#tools-body").append("<tr><td>"+Math.floor((tool.durability/tool.maxDurability)*100)+"% "+tool.name +"</td></tr>")
    })
    updateRecipes()
}

// Tests to see if a recipe has all required ingredients
function itemCheck(requiredItems){
    let requiredTally = 0;
    let itemTally = 0;
    requiredItems.forEach(requiredItem =>{
        requiredTally++;
        items.forEach(item=>{
            if(item.name == requiredItem.name && item.amount >= requiredItem.amount){
                itemTally++;
            }
        })
        tools.forEach(tool=>{
            if(tool.name == requiredItem.name){
                itemTally++;
            }
        })
    })
    if(itemTally == requiredTally){
        return true;
    }else{
        return false;
    }
}

function updateRecipes(){
    let unlockedRecipes = [];
    $("#recipes-body").html("");
    let recipeIndex = 0;

    // Handles new recipe unlocks
    handRecipes.forEach(recipe =>{
        recipe.inputs.forEach(input =>{
            items.forEach(item => {
                if (item.name == input.name){
                    recipe.unlocked = true;
                }
            })
        })
        if (recipe.unlocked){
            recipe.id = recipeIndex;
            unlockedRecipes.push(recipe);
        }
        recipeIndex++;
    })

    // Handles the display of unlocked recipes
    unlockedRecipes.forEach(recipe=>{
        let recipeString = ""
        let inputIndex = 0;
        recipe.inputs.forEach(input=>{
            if (inputIndex >0){
                recipeString += ", " + input.amount+ "x "+ input.name;
            }else{
                recipeString += input.amount+ "x "+ input.name;
            }
            inputIndex ++;
            
        })
        recipeString += " --> " + recipe.output.amount + "x " + recipe.output.name;
        if (itemCheck(recipe.inputs)){
            recipeString += " <button class='btn btn-primary craft' data-recipe='"+recipe.id+"'>Craft</button>"
        }
        $("#recipes-body").append("<tr><td>"+ recipeString +"</td></tr>")
    })

    // Handles the craft button click listeners
    $(".craft").off("click");
    $(".craft").click(function(){
        craft(this.dataset.recipe);  
    })
}

// Removes an item from the array when it reaches an amount of 0
function itemZeroCheck(){
    for (let i = items.length-1; i>=0; --i){
        console.log(i)
        if (items[i].amount<1){
            items.splice(i,1)
        }
    }
    updateInventory();
}

// Function for removing a specific amount of items
function removeItem(name, amount){
    
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

// Function for standard crafting
function craft(id){
    handRecipes[id].inputs.forEach(input=>{
        removeItem(input.name, input.amount);
    })
    if (handRecipes[id].output.group == "tool"){
        collectItem(handRecipes[id].output);
    }else{
        collectItem({name: handRecipes[id].output.name, amount: handRecipes[id].output.amount});
    }
}

// General function for when you obtain an item
function collectItem(itemStack){
    let alreadyObtained = false;
    if (itemStack.group == "tool"){
        tools.push(itemStack)
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

// Displays the current material in the button
function blockDisplay(){
    $("#block").html("")
    $("#block").text(currentMaterial.name)

    // If you lack the correct tool for the current material, the button is red
    if (currentMaterial.toolRequired && currentMaterial.tool != findFastestTool(currentMaterial.tool).type){
        $("#block").removeClass("btn-primary").addClass("btn-danger");
    }else{
        $("#block").removeClass("btn-danger").addClass("btn-primary");
    }
}

// Selects a random block
function randomBlock(location){
    const localLocation = eval(location+"Materials");
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

// Returns the fastest tool of the requested type
function findFastestTool(type){
    let currentTool = {
        type: "none",
        power: 0,
    };
    tools.forEach(tool=>{
        if (tool.type == type && tool.power>currentTool.power){
            currentTool = tool;
        }
    })
    return currentTool;
}

// Determines how fast to break the current block
function miningSpeedCalc(){
    let miningSpeed = baseMiningSpeed*currentMaterial.hardness;
    if (currentMaterial.toolRequired && currentMaterial.tool != findFastestTool(currentMaterial.tool).type){
        miningSpeed *=2; 
    }else{
        miningSpeed -= findFastestTool(currentMaterial.tool).power*miningSpeed;
    }
    return miningSpeed;
}

// Removes the tool if its duribility reaches 0
function checkToolDurability(){
    let toolIndex = 0;
    tools.forEach(tool=>{
        if (tool.durability == 0){
            tools.splice(toolIndex, 1);
        }
        toolIndex++;
    })
}

// Run when block is finished mining
function blockMine(){
    // Button can now be clicked again
    isMining = false;
    $( "#block" ).prop( "disabled", false );

    // If a specific tool isn't required or the current tool matches the required tool, give the proper loot
    if((!currentMaterial.toolRequired || (currentMaterial.tool == findFastestTool(currentMaterial.tool).type))){
        findFastestTool(currentMaterial.tool).durability-=1;
        checkToolDurability();
        processLoot(currentMaterial);
    }
    
    // Generates new block based on current location
    randomBlock(currentLocation);
}

// When block button is clicked, mine the block (assuming you aren't already mining one)
function blockClick(){
    if(!isMining){
        isMining = true;
        // Visual changes to block button element when mining
        $("#block").html("<div class='spinner-grow text-light'></div>")
        $( "#block" ).prop( "disabled", true );
        // Sets timer based on mining speed, current tool etc. When done, run blockMine
        setTimeout(blockMine, miningSpeedCalc());
    }
    
}

function clickListeners(){
    $("#block").click(function(){
        blockClick();  
    })
}

$(document).ready(function(){
    randomBlock(currentLocation);
    updateInventory();
    clickListeners();
});