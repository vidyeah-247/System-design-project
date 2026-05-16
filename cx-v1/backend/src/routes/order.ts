import { Router } from "express";
import crypto from "crypto";

import { ORDERBOOKS } from "../engine";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, (req: AuthRequest, res) => {

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

    const order = {
        id: crypto.randomUUID(),

        userId: req.userId!,

        side,
        price,
        quantity,

        filled: 0
    };

    orderbook.addOrder(order);

    res.json({
        order
    });
});

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
