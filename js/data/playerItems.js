export function addItem(itemStack, idx){
    items.splice(idx, 0, itemStack);
}

export function addTool(itemStack, idx){
    tools.splice(idx, 0, itemStack);
}

export const items = [
    
];
export const tools = [
    {
        name: "Flint Shovel",
        image: "./images/shovel-svgrepo-com.svg",
        color: "filter: invert(21%) sepia(54%) saturate(0%) hue-rotate(242deg) brightness(94%) contrast(91%);",
        group: "tool",
        type: "shovel",
        power: 0.2,
        maxDurability: 20,
        durability: 20
    },
];