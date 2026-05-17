import { Router } from "express";

import { prisma } from "../lib/prisma";

import { ORDERBOOKS } from "../engine";

import {
    authMiddleware,
    AuthRequest
} from "../middleware/auth";

const router = Router();

router.post(
    "/",
    authMiddleware,
    async (req: AuthRequest, res) => {

        try {

            const {
                side,
                price,
                quantity,
                market
            }: {
                side: "buy" | "sell";
                price: number;
                quantity: number;
                market: keyof typeof ORDERBOOKS;
            } = req.body;

            const orderbook =
                ORDERBOOKS[market];

            if (!orderbook) {
                return res.status(400).json({
                    message: "Invalid market"
                });
            }

            /*
                STORE ORDER IN DATABASE
            */

            const dbOrder =
                await prisma.order.create({
                    data: {
                        userId: req.userId!,

                        market,

                        side:
                            side === "buy"
                                ? "BUY"
                                : "SELL",

                        price,
                        quantity
                    }
                });

            /*
                CREATE ENGINE ORDER
            */

            const order = {

                id: dbOrder.id,

                userId: req.userId!,

                side,

                price,
                quantity,

                filled: 0,

                market
            };

            /*
                SEND TO MATCHING ENGINE
            */

            orderbook.addOrder(order);

            res.json({
                message: "Order placed",
                order
            });

        } catch (e) {

            console.log(e);

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);

router.get("/:market", (req, res) => {

    const market =
        req.params.market as keyof typeof ORDERBOOKS;

    const orderbook =
        ORDERBOOKS[market];

    if (!orderbook) {
        return res.status(400).json({
            message: "Invalid market"
        });
    }

    res.json(
        orderbook.getDepth()
    );
});

export default router;
