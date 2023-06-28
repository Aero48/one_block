import { handRecipes } from "../data/recipes.js";
import { items } from "../data/playerItems.js";
import { tools } from "../data/playerItems.js";
import { itemList } from "../data/items.js";
import { toolList } from "../data/items.js";
import * as itemHandler from "./itemHandler.js";
import * as inventory from "./inventory.js";

export let recipeTab = "all";

export function recipeTabClick(tab){
    recipeTab = tab;
    updateRecipes();
}

// Tests to see if a recipe has all required ingredients
export function itemCheck(requiredItems){
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

// Function for standard crafting
function craft(id){
    handRecipes[id].inputs.forEach(input=>{
        inventory.removeItem(input.name, input.amount);
    })
    if (handRecipes[id].output.group == "tool"){
        inventory.collectItem(handRecipes[id].output);
    }else{
        inventory.collectItem({name: handRecipes[id].output.name, amount: handRecipes[id].output.amount});
    }
}

export function updateRecipes(){
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
        if ((recipe.category == recipeTab || recipeTab == "all")&&itemCheck(recipe.inputs)){
            let recipeString = "";
            let recipeBtn = "";
            recipe.inputs.forEach(input=>{
                itemList.forEach(itemEl => {
                    if (itemEl.name == input.name){
                        recipeString += "<div class='item-icn' title='"+itemEl.name+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(input.amount)+"</p></div>"
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
            
            recipeBtn += "<div class='craft-btn'><button class='btn btn-primary craft' data-recipe='"+recipe.id+"'>Craft</button></div>"
            $("#recipes-body").append("<tr><td><div class='recipe-content'>"+ recipeString + "</div>" + recipeBtn + "</tr>")
        }
        
    })
    unlockedRecipes.forEach(recipe=>{
        if ((recipe.category == recipeTab || recipeTab == "all")&&!itemCheck(recipe.inputs)){
            let recipeString = "";
            let recipeBtn = "";
            recipe.inputs.forEach(input=>{
                itemList.forEach(itemEl => {
                    if (itemEl.name == input.name){
                        recipeString += "<div class='item-icn' title='"+itemEl.name+"'><img src='"+itemEl.image+"' style='"+itemEl.color+"' ><p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(input.amount)+"</p></div>"
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
                recipeString += "<p class='item-icn-amount'>"+itemHandler.itemAmountIndicator(recipe.output.amount)+"</p></div>"
            }else{
                recipeString += "</div>"
            }
            $("#recipes-body").append("<tr><td><div class='recipe-content'>"+ recipeString + "</div>" + recipeBtn + "</tr>")
        }
        
    })

    // Handles the craft button click listeners
    $(".craft").off("click");
    $(".craft").click(function(){
        craft(this.dataset.recipe);  
    })
}