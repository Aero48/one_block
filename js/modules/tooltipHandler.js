import { fuel, smeltables } from "../data/fuel.js";
import { items } from "../data/playerItems.js";

export function showItemTooltip(item, showDetails=true){
    let viewedItem = JSON.parse(JSON.stringify(item))
    $("#item-tooltip .tooltip-title").html(viewedItem.name);
    $("#item-tooltip").css("display", "block");

    if (showDetails){
        $("#item-tooltip .tooltip-body").html("");
        if (viewedItem.name == "Gravel"){
            $("#item-tooltip .tooltip-body").append("<p class='tooltip-description'>Can be used for sifting</p>")
        }
        if (viewedItem.group == "tool"){
            $("#item-tooltip .tooltip-body").append("<p class='tooltip-description tooltip-durability'>Durability: "+ viewedItem.durability + "/" + viewedItem.maxDurability +"</p>")
        }
        fuel.forEach(item =>{
            if (item.name == viewedItem.name){
                $("#item-tooltip .tooltip-body").append("<p class='tooltip-description tooltip-fuel'>Burns at:<img src='images/fire-svgrepo-com.svg'></p>");
                
                if (item.burnTemp == 10000){
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(82%) sepia(28%) saturate(381%) hue-rotate(210deg) brightness(102%) contrast(103%)')
                }else if (item.burnTemp >= 8000){
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(76%) sepia(24%) saturate(1287%) hue-rotate(194deg) brightness(102%) contrast(111%)')
                }else if (item.burnTemp >= 6000){
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(70%) sepia(84%) saturate(601%) hue-rotate(170deg) brightness(102%) contrast(98%)')
                }else if (item.burnTemp >= 4000){
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(81%) sepia(29%) saturate(3521%) hue-rotate(354deg) brightness(103%) contrast(101%)')
                }else if (item.burnTemp >= 2000){
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(75%) sepia(67%) saturate(4748%) hue-rotate(346deg) brightness(96%) contrast(108%)')
                }else{
                    $("#item-tooltip .tooltip-body .tooltip-fuel img").css('filter', 'invert(16%) sepia(100%) saturate(3214%) hue-rotate(345deg) brightness(107%) contrast(73%)')
                }
            }
        })
        smeltables.forEach(item =>{
            if (item.name == viewedItem.name){
                $("#item-tooltip .tooltip-body").append("<p class='tooltip-description tooltip-smeltable'>Requires heat:<img src='images/fire-svgrepo-com.svg'></p>");
                
                if (item.burnTemp == 10000){
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(82%) sepia(28%) saturate(381%) hue-rotate(210deg) brightness(102%) contrast(103%)')
                }else if (item.burnTemp >= 8000){
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(76%) sepia(24%) saturate(1287%) hue-rotate(194deg) brightness(102%) contrast(111%)')
                }else if (item.burnTemp >= 6000){
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(70%) sepia(84%) saturate(601%) hue-rotate(170deg) brightness(102%) contrast(98%)')
                }else if (item.burnTemp >= 4000){
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(81%) sepia(29%) saturate(3521%) hue-rotate(354deg) brightness(103%) contrast(101%)')
                }else if (item.burnTemp >= 2000){
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(75%) sepia(67%) saturate(4748%) hue-rotate(346deg) brightness(96%) contrast(108%)')
                }else{
                    $("#item-tooltip .tooltip-body .tooltip-smeltable img").css('filter', 'invert(16%) sepia(100%) saturate(3214%) hue-rotate(345deg) brightness(107%) contrast(73%)')
                }
            }
        })
    }
    
}

export function hideTooltip(){
    $("#item-tooltip").css("display", "none");
    $("#item-tooltip .tooltip-title").html("");
    $("#item-tooltip .tooltip-body").html("");
}