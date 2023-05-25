export let handRecipes = [
    {
        inputs: [
            {
                name: "Grass",
                amount: 3
            }
        ],
        output: {
            name: "Grass Twine",
            amount: 1
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Stick",
                amount: 2
            }
        ],
        output: {
            name: "Weak Tool Handle",
            amount: 1
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Weak Tool Handle",
                amount: 1
            },
            {
                name: "Grass Twine",
                amount: 1
            },
            {
                name: "Flint",
                amount: 3
            }
        ],
        output: {
            name: "Flint Pickaxe",
            group: "tool",
            type: "pickaxe",
            power: 0.1,
            maxDurability: 20,
            durability: 20
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Weak Tool Handle",
                amount: 1
            },
            {
                name: "Grass Twine",
                amount: 1
            },
            {
                name: "Flint",
                amount: 3
            }
        ],
        output: {
            name: "Flint Axe",
            group: "tool",
            type: "axe",
            power: 0.1,
            maxDurability: 20,
            durability: 20
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Weak Tool Handle",
                amount: 1
            },
            {
                name: "Grass Twine",
                amount: 1
            },
            {
                name: "Flint",
                amount: 1
            }
        ],
        output: {
            name: "Flint Shovel",
            group: "tool",
            type: "shovel",
            power: 0.2,
            maxDurability: 20,
            durability: 20
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Weak Tool Handle",
                amount: 1
            },
            {
                name: "Grass Twine",
                amount: 1
            },
            {
                name: "Flint",
                amount: 4
            }
        ],
        output: {
            name: "Flint Saw",
            group: "tool",
            type: "saw",
            maxDurability: 20,
            durability: 20
        },
        unlocked: false
    },
    {
        inputs: [
            {
                name: "Flint Saw",
                amount: 1
            },
            {
                name: "Oak Log",
                amount: 1
            }
        ],
        output: {
            name: "Oak Plank",
            amount: 3
        },
        unlocked: false
    },
]