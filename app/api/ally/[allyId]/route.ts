import db from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export const PATCH = async (req: Request, {params}: {params : {allyId: string}}) => {
    try {
        const body = await req.json();
        const user = await currentUser()

        const {src, name, description, instructions, seed, categoryId} = body

        // validations
        if(!params.allyId) {
            return new NextResponse("Missing allyId", { status: 400 })
        }

        if (!user || !user.id || !user.firstName)
            return new NextResponse("Unauthorized", { status: 401 })
        
        // validate user has the necessary permissions
        if (!src || !name || !description || !instructions || !seed || !categoryId) 
            return new NextResponse("Missing required fields", { status: 400 })

        const isPro = await checkSubscription()
        if (!isPro)
            return new NextResponse("Subscription required for this action", { status: 403 })


        // save to database
        const ally = await db.ally.update({
            where: { id: params.allyId, userId: user.id },
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

export const DELETE = async (req: Request, {params}: {params : {allyId: string}}) => {
    try {
        const user = await currentUser()
        if (!user)
            return new NextResponse("Unauthorized", { status: 401 })
        
        const ally = await db.ally.delete({
            where: { id: params.allyId, userId: user.id },
        })
        return NextResponse.json(ally, { status: 200 })
    } catch (error) {
        console.log(`ALLY DELETE: ${error}`)
        return new NextResponse("Server error", {status: 500})
    }
}