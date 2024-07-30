const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()
async function create() {
    try {
        await db.category.createMany({
            data: [
                {name: "Movies & TV"},
                {name: "Famouse People"},
                {name: "Games"},
                {name: "Musicians"},
                {name: "Scientists"},
                {name: "Animals"},
                {name: "Philosphy"},
            ]
        })
    } catch (error) {
        console.error('Error creating categories')
    }
    finally {
        await db.$disconnect()
    }
}

create()
