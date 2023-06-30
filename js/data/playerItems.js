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
    
];
export let tools = [
    
];