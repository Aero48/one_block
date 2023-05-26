export let overworldMaterials = [
    {
        name: "Dirt",
        weight: 60,
        hardness: 0.5,
        tool: "shovel",
        toolRequired: false,
        drops: {
            pools: [
                {
                    poolWeight: 10,
                    poolItems: [
                        {
                            name: "Dirt",
                            amount: 1
                        }
                    ]
                }
            ]
        }
    },
    {
        name: "Gravel",
        weight: 50,
        hardness: 0.75,
        tool: "shovel",
        toolRequired: false,
        drops: {
            pools: [
                {
                    poolWeight: 2,
                    poolItems: [
                        {
                            name: "Gravel",
                            amount: 1
                        }
                    ]
                },
                {
                    poolWeight: 1,
                    toolBonus: 50,
                    poolItems: [
                        {
                            name: "Flint",
                            amount: 1
                        }
                    ]
                }
            ]
        }
    },
    {
        name: "Stone",
        weight: 20,
        hardness: 1,
        tool: "pickaxe",
        toolRequired: true,
        drops: {
            pools: [
                {
                    poolWeight: 10,
                    poolItems: [
                        {
                            name: "Cobblestone",
                            amount: 1
                        }
                    ]
                }
            ]
        }
    },
    {
        name: "Oak Log",
        weight: 30,
        hardness: 1,
        tool: "axe",
        toolRequired: true,
        drops: {
            pools: [
                {
                    poolWeight: 10,
                    poolItems: [
                        {
                            name: "Oak Log",
                            amount: 1
                        }
                    ]
                }
            ]
        } 
    },
    {
        name: "Grass",
        weight: 30,
        hardness: 0.25,
        tool: "sickle",
        toolRequired: false,
        drops: {
            pools: [
                {
                    poolWeight: 10,
                    poolItems: [
                        {
                            name: "Grass",
                            minAmount: 1,
                            maxAmount: 2
                        }
                    ]
                }
            ]
        } 
    },
    {
        name: "Leaves",
        weight: 30,
        hardness: 0.25,
        tool: "sickle",
        toolRequired: false,
        drops: {
            pools: [
                {
                    poolWeight: 3,
                    poolItems: [
                        {
                            name: "Stick",
                            ninAmount: 0,
                            maxAmount: 1
                        }
                    ]
                },
                {
                    poolWeight: 1,
                    poolItems: [
                        {
                            name: "Apple",
                            amount: 1
                        }
                    ]
                }
            ]
        }
    },
    {
        name: "Clay",
        weight: 20,
        hardness: 0.5,
        tool: "shovel",
        toolRequired: false,
        drops: {
            pools: [
                {
                    poolWeight: 10,
                    poolItems: [
                        {
                            name: "Clay Ball",
                            minAmount: 1,
                            maxAmount: 3
                        }
                    ]
                }
            ]
        } 
    },
]
