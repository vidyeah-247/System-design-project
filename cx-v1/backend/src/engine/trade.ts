import { prisma } from "../lib/prisma";

export async function executeTrade(
    buyerId: string,
    sellerId: string,

    buyerOrderId: string,
    sellerOrderId: string,

    market: string,

    price: number,
    quantity: number
) {

    const [baseAsset, quoteAsset] =
        market.split("_");

    const total =
        price * quantity;

    await prisma.$transaction(async (tx) => {

        /*
            BUYER:
            gets BASE asset
            spends QUOTE asset
        */

        const buyerBase =
            await tx.balance.findFirst({
                where: {
                    userId: buyerId,
                    asset: baseAsset
                }
            });

        if (buyerBase) {

            await tx.balance.update({
                where: {
                    id: buyerBase.id
                },
                data: {
                    amount: buyerBase.amount + quantity
                }
            });

        } else {

            await tx.balance.create({
                data: {
                    userId: buyerId,
                    asset: baseAsset,
                    amount: quantity
                }
            });
        }

        const buyerQuote =
            await tx.balance.findFirst({
                where: {
                    userId: buyerId,
                    asset: quoteAsset
                }
            });

        if (buyerQuote) {

            await tx.balance.update({
                where: {
                    id: buyerQuote.id
                },
                data: {
                    amount: buyerQuote.amount - total
                }
            });
        }

        /*
            SELLER:
            gives BASE asset
            receives QUOTE asset
        */

        const sellerBase =
            await tx.balance.findFirst({
                where: {
                    userId: sellerId,
                    asset: baseAsset
                }
            });

        if (sellerBase) {

            await tx.balance.update({
                where: {
                    id: sellerBase.id
                },
                data: {
                    amount: sellerBase.amount - quantity
                }
            });
        }

        const sellerQuote =
            await tx.balance.findFirst({
                where: {
                    userId: sellerId,
                    asset: quoteAsset
                }
            });

        if (sellerQuote) {

            await tx.balance.update({
                where: {
                    id: sellerQuote.id
                },
                data: {
                    amount: sellerQuote.amount + total
                }
            });

        } else {

            await tx.balance.create({
                data: {
                    userId: sellerId,
                    asset: quoteAsset,
                    amount: total
                }
            });
        }

        /*
            CREATE FILL
        */

        await tx.fill.create({
            data: {
                market,

                price,
                quantity,

                buyerId,
                sellerId,
                buyerOrderId,
                sellerOrderId
            }
        });
    });
}