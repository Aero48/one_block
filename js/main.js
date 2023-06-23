import {itemList} from "./items.js";
import {toolList} from "./items.js";
import {materials} from "./materials.js";
import {handRecipes} from "./recipes.js";
import {sieveRecipes} from "./sieve.js";
import { fuel } from "./fuel.js";
import { smeltables } from "./fuel.js";

const items = [
];
const tools = [
];
let currentLocation = "overworld"
let currentMaterial = {};

let furnaceTemp = 0;
let furnaceGoalTemp = 0;
let furnaceMaxTemp = 10000;
let isHeating = false;
let isSmelting = false;
let furnaceFuel = {};
let furnaceInput = {};
let smeltingItem = {};
let furnaceAvailable = false;

let selectedItem = {};

let recipeTab = "all";

let baseMiningSpeed = 5000;
let isMining = false;
let isSifting = false;
let itemSelected = false;

let dragItem = document.getElementById('drag-item');const onMouseMove = (e) =>{
    dragItem.style.left = e.pageX + 'px';
    dragItem.style.top = e.pageY + 'px';
  }
document.addEventListener('mousemove', onMouseMove);

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

function findItemIcon(inputItem){
    let outputImage = "";
    itemList.forEach(item => {
        if (inputItem.name == item.name){
            outputImage = item.image
            
        }
    })
    return outputImage;
}

function findItemColor(inputItem){
    let outputColor = "";
    itemList.forEach(item => {
        if (inputItem.name == item.name){
            outputColor = item.color
            
        }
    })
    return outputColor;
}

function itemClickListeners(){
    
    $("#items-body .item-icn").off("click");
    $("#items-body .item-icn").click(function(){
        if (!itemSelected){
            itemSelected = true;
            selectedItem = {name: items[this.dataset.index].name, amount: items[this.dataset.index].amount, image:items[this.dataset.index].image, color:items[this.dataset.index].color}
            $("#drag-item").html("<div class='item-icn-no-click' title='"+selectedItem.name+"'><img src='"+findItemIcon(selectedItem)+"' style='"+findItemColor(selectedItem)+"' ><p class='item-icn-amount'>"+selectedItem.amount+"</p></div>")
            removeItem(selectedItem.name, selectedItem.amount);
            $("#add-selected-item").prop( "disabled", false )
        }
    })
}

function furnaceBurnOut(){
    furnaceGoalTemp = 0;
    isHeating = false;
    updateFurnace();
}

function furnaceSmelt(name, burnTemp, output){
    if(burnTemp<=furnaceTemp){
        collectItem({name: output, amount: 1})
    }else{
        collectItem({name: name, amount: 1})
    }
    isSmelting = false;
    updateFurnace();
}

function updateFurnace(){
    //console.log(furnaceGoalTemp);
    console.log(furnaceFuel);
    if (furnaceFuel.amount<1 || furnaceFuel.name == null) {
        furnaceFuel = {};
        $("#furnace-fuel").html("");
        
    }else{
        $("#furnace-fuel").html("<div class='item-icn' title='"+furnaceFuel.name+"'><img src='"+furnaceFuel.image+"' style='"+furnaceFuel.color+"' ><p class='item-icn-amount'>"+furnaceFuel.amount+"</p></div>");
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
        $("#furnace-input").html("<div class='item-icn' title='"+furnaceInput.name+"'><img src='"+furnaceInput.image+"' style='"+furnaceInput.color+"' ><p class='item-icn-amount'>"+furnaceInput.amount+"</p></div>");
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
}

// Refreshes the view of the inventory
function updateInventory(){
    $("#items-body").html("");
    $("#tools-body").html("");
    items.forEach((item,index) => {
        itemList.forEach(itemEl => {
            if (item.name == itemEl.name){
                $("#items-body").append("<div class='item-icn' title='"+itemEl.name+"' data-index='"+index+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+item.amount+"</p></div>")
            }
        })
    })
    tools.forEach(tool => {
        $("#tools-body").append("<tr><td>"+Math.floor((tool.durability/tool.maxDurability)*100)+"% <div class='item-icn' title='"+tool.name+"'><img src='"+tool.image+"' style='"+tool.color+"' ></div></td></tr>")
    })

    $("#sieve-container").html("")
    if (findFastestTool("sieve").power > 0){
        $("#sieve-container").html("<button id='sieve' class='btn btn-primary'></button>")
        $( "#sieve" ).html(findFastestTool("sieve").name)
        sieveListener();
    }

    $("#smelting-container").css("display", "none")
    if (findFastestTool("furnace").power > 0){
        //$("#smelting-container").html('<div class="progress"><div id="smelt-progress" class="progress-bar bg-danger" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div><div class="furnace-bottom-row"><div class="furnace-icon-div"><button class="btn btn-primary furnace-slot" id="furnace-fuel"></button></div><div class="item-icn"><img src="./images/fire-svgrepo-com.svg" alt=""></div><div class="furnace-icon-div"><button class="btn btn-primary furnace-slot" id="furnace-input"></button></div></div>')
        $("#smelting-container").css("display", "block");
    }
    updateRecipes();
    itemClickListeners();
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
    console.log(recipeTab);
    unlockedRecipes.forEach(recipe=>{
        
        if (recipe.category == recipeTab || recipeTab == "all"){
            let recipeString = "";
            recipe.inputs.forEach(input=>{
                itemList.forEach(itemEl => {
                    if (itemEl.name == input.name){
                        recipeString += "<div class='item-icn' title='"+itemEl.name+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+input.amount+"</p></div>"
                    }
                })
                toolList.forEach(toolEl => {
                    if (toolEl.name == input.name){
                        recipeString += "<div class='item-icn' title='"+toolEl.name+"'><img src='"+toolEl.image+"' style='"+toolEl.color+"' ></div>"
                    }
                })
            })
            recipeString += " --> "
            itemList.forEach(itemEl => {
                if (itemEl.name == recipe.output.name){
                    recipeString += "<div class='item-icn' title='"+itemEl.name+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' >"
                }
            })
            toolList.forEach(toolEl => {
                if (toolEl.name == recipe.output.name){
                    recipeString += "<div class='item-icn' title='"+toolEl.name+"'><img src='"+toolEl.image+"' style='"+toolEl.color+"' >"
                }
            })
            if (recipe.output.amount != null){
                recipeString += "<p class='item-icn-amount'>"+recipe.output.amount+"</p></div>"
            }else{
                recipeString += "</div>"
            }
            if (itemCheck(recipe.inputs)){
                recipeString += " <button class='btn btn-primary craft' data-recipe='"+recipe.id+"'>Craft</button>"
            }
            $("#recipes-body").append("<tr><td>"+ recipeString +"</td></tr>")
        }
        
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
        toolList.forEach(toolEl => {
            if (itemStack.name == toolEl.name){
                tools.push({name: toolEl.name, image: toolEl.image, color: toolEl.color, group: toolEl.group, type: toolEl.type, power: toolEl.power, maxDurability: toolEl.maxDurability, durability:toolEl.maxDurability})
            }
        })
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
function randomBlock(location){
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

// Returns the fastest tool of the requested type
function findFastestTool(type){
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
    tools.forEach((tool, index)=>{
        if (tool.durability == 0){
            tools.splice(index, 1);
        }
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
        console.log(toolList[2].durability)
        checkToolDurability();
        processLoot(currentMaterial);
    }
    
    // Generates new block based on current location
    randomBlock(currentLocation);
}

// 
function sieveComplete(){
    isSifting = false;
    $("#sieve").html("")
    $( "#sieve" ).prop( "disabled", false );

    sieveRecipes.forEach(recipe =>{
        if (findFastestTool("sieve").power == recipe.power){
            findFastestTool("sieve").durability-=1;
            checkToolDurability();
            processLoot(recipe);
            return;
        }
    })
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

// Sifts gravel assuming user has sieve and gravel
function sieveClick(){
    if(!isSifting && findFastestTool("sieve").power > 0 && itemCheck([{name: "Gravel", amount: 1}])){
        isSifting = true;
        removeItem("Gravel", 1)
        $("#sieve").html("<div class='spinner-border text-light'></div>")
        $( "#sieve" ).prop( "disabled", true );
        setTimeout(sieveComplete, 5000);
    }
}

function recipeTabClick(tab){
    recipeTab = tab;
    updateRecipes();
}

function sieveListener(){
    $("#sieve").click(function(){
        sieveClick();
    })
}

function addSelectedClick(){
    if (itemSelected){
        collectItem({name: selectedItem.name, amount: selectedItem.amount})
        itemSelected = false;
        selectedItem = {};
        console.log("item deposited")
        $("#drag-item").html("");
        $("#add-selected-item").prop( "disabled", true )
    }
}

function updateSelectedItem(){
    $("#drag-item").html("<div class='item-icn-no-click' title='"+selectedItem.name+"'><img src='"+findItemIcon(selectedItem)+"' style='"+findItemColor(selectedItem)+"' ><p class='item-icn-amount'>"+selectedItem.amount+"</p></div>")
}

function addFuel(){
    if (furnaceFuel.name == null){
        furnaceFuel = {name: selectedItem.name, amount: 1, image: findItemIcon(selectedItem), color: findItemColor(selectedItem)}
        //console.log(selectedItem);
    }else{
        furnaceFuel.amount ++;
    }
    console.log(furnaceFuel);
    updateFurnace();
}

function addFurnaceInput(){
    if (furnaceInput.name == null){
        furnaceInput = {name: selectedItem.name, amount: 1, image: findItemIcon(selectedItem), color: findItemColor(selectedItem)}
        //console.log(selectedItem);
    }else{
        furnaceInput.amount ++;
    }
    console.log(furnaceInput);
    updateFurnace();
}

function furnaceListeners(){
    $("#furnace-fuel").click(function(){
        if (itemSelected){
            fuel.forEach(fuelItem => {
                if (selectedItem.name == fuelItem.name && (selectedItem.name == furnaceFuel.name || furnaceFuel.name == null)){
                    if (selectedItem.amount>1){
                        addFuel();
                        selectedItem.amount --;
                        updateSelectedItem();
                    }else{
                        addFuel();
                        selectedItem = {};
                        $("#drag-item").html("");
                        itemSelected = false;
                    }
                    
                    
                }
            })
        }
    })
    $("#furnace-input").click(function(){
        if (itemSelected){
            smeltables.forEach(smeltableItem => {
                if (selectedItem.name == smeltableItem.name && (selectedItem.name == furnaceInput.name || furnaceInput.name == null)){
                    if (selectedItem.amount>1){
                        addFurnaceInput();
                        selectedItem.amount --;
                        updateSelectedItem();
                    }else{
                        addFurnaceInput();
                        selectedItem = {};
                        $("#drag-item").html("");
                        itemSelected = false;
                    }
                    
                    
                }
            })
        }
    })
}

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

    furnaceListeners();
}

// Furnace temperature-related updates
function furnaceUpdate(){
    if (furnaceTemp < furnaceGoalTemp){
        furnaceTemp += 200;
        console.log(furnaceTemp)
        $('#smelt-progress').attr('aria-valuenow', furnaceTemp/furnaceMaxTemp).css('width', (furnaceTemp/furnaceMaxTemp*100)+'%');
        console.log($('#smelt-progress').css('width'));
        updateFurnace();
    }else if(furnaceTemp > furnaceGoalTemp){
        furnaceTemp -= 200;
        console.log(furnaceTemp)
        $('#smelt-progress').attr('aria-valuenow', furnaceTemp/furnaceMaxTemp).css('width', (furnaceTemp/furnaceMaxTemp*100)+'%');
        console.log($('#smelt-progress').css('width'));
        updateFurnace();
    }
    
}

$(document).ready(function(){
    randomBlock(currentLocation);
    updateInventory();
    clickListeners();

    
    let furnaceInterval = setInterval(furnaceUpdate, 1000);
});