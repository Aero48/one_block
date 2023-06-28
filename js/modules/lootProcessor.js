import * as inventory from "./inventory.js";

// Handles the loot tables
export function processLoot(material){
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
                    inventory.collectItem({name: poolItem.name, amount: poolItem.amount})
                }else if(poolItem.minAmount != null && poolItem.maxAmount != null){
                    let itemRandomRange = Math.ceil(Math.random()*(poolItem.maxAmount - poolItem.minAmount + 1))+(poolItem.minAmount - 1)
                    console.log(itemRandomRange);
                    inventory.collectItem({name: poolItem.name, amount: itemRandomRange})
                }else{
                    inventory.collectItem({name: poolItem.name, amount: 1})
                }
                
            })
            break;
        }else{
            randomNum -= material.drops.pools[i].poolWeight;
        }
    }
}