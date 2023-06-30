export function addItem(itemStack, idx){
    items.splice(idx, 0, itemStack);
}

export function addTool(itemStack, idx){
    tools.splice(idx, 0, itemStack);
}

export function setItems(itemsImport){
    items = JSON.parse(itemsImport);
}

export function setTools(toolsImport){
    tools = JSON.parse(toolsImport);
}

export let items = [
    {
        name: "Coal",
        amount: 5
    },
    {
        name: "Raw Copper",
        amount: 5
    },
    {
        name: "Bronze Blend",
        amount: 5
    },
    {
        name: "Gravel",
        amount: 5
    }
];
export let tools = [
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
    {
        name: "Brick Furnace",
        image: "./images/furnace-svgrepo-com.svg",
        color: "filter: invert(9%) sepia(77%) saturate(3803%) hue-rotate(336deg) brightness(84%) contrast(102%);",
        group: "tool",
        type: "furnace",
        power: 2,
        maxDurability: 20,
        durability: 20
    },
];