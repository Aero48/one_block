import * as itemHandler from "./itemHandler.js";
import * as inventory from "./inventory.js";
import { sieveRecipes } from "../data/sieve.js";
import { processLoot } from "./lootProcessor.js";
import { itemCheck } from "./recipeHandler.js";


export let isSifting = false;

export function setSiftStatus(value){
    isSifting = value;
}

export function updateSieveDisplay(){
    if (itemHandler.findFastestTool("sieve").power > 0){
        $("#sieve-container").css("display", "block")
        //$("#sieve-container").html("<button id='sieve' class='btn btn-primary'></button>")
        if(isSifting){
            $("#sieve").html("<div class='spinner-border text-light'></div>")
        }else{
            $( "#sieve" ).html(itemHandler.findFastestTool("sieve").name)
        }
    }else{
        $("#sieve-container").css("display", "none");
    }
}

export function sieveComplete(){
    setSiftStatus(false);
    $("#sieve").html("")
    $( "#sieve" ).prop( "disabled", false );

    sieveRecipes.forEach(recipe =>{
        if (itemHandler.findFastestTool("sieve").power == recipe.power){
            itemHandler.findFastestTool("sieve").durability-=1;
            inventory.checkToolDurability();
            processLoot(recipe);
            return;
        }
    })
}

// Sifts gravel assuming user has sieve and gravel
export function sieveClick(){
    if(!isSifting && itemHandler.findFastestTool("sieve").power > 0 && itemCheck([{name: "Gravel", amount: 1}])){
        setSiftStatus(true);
        inventory.removeItem("Gravel", 1)
        $("#sieve").html("<div class='spinner-border text-light'></div>")
        $( "#sieve" ).prop( "disabled", true );
        setTimeout(sieveComplete, 5000);
    }
}