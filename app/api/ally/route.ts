import db from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const user = await currentUser()

        const {src, name, description, instructions, seed, categoryId} = body

        // validations
        if (!user || !user.id || !user.firstName)
            return new NextResponse("Unauthorized", { status: 401 })

        if (!src || !name || !description || !instructions || !seed || !categoryId) 
            return new NextResponse("Missing required fields", { status: 400 })

        const isPro = await checkSubscription()
        if (!isPro)
            return new NextResponse("You must be a Pro user to create an Ally", { status: 403 })
        // save to database
        const ally = await db.ally.create({
            data: {
                name,
                description,
                instructions,
                seed,
                src,
                categoryId,
                userId: user.id,
                userName: user.firstName,
            },
        })

        

        return NextResponse.json(ally, { status: 200 })
    } catch (error) {
        console.log(`POST error: ${error}`)
        return new NextResponse("Server error", {status: 500})
    }
}