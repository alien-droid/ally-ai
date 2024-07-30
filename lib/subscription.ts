import {auth} from '@clerk/nextjs/server'

import db from '@/lib/db'

const DAY_IN_MS = 60 * 60 * 24 * 1000

export const checkSubscription = async () => {
    const {userId} = await auth()
    if (!userId) { return false }
    
    const userSubscription = await db.userSubscription.findUnique({
        where: { userId },
        select: { stripeCurrentPeriodEnd: true, stripeCustomerId: true, stripePriceId: true, stripeSubscriptionId: true}
    })

    if (!userSubscription) { return false }
    const isValidSubscription = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()
    return !!isValidSubscription
}