import { Router } from "express";

import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {

    const balances = await prisma.balance.findMany({
        where: {
            userId: req.userId
        }
    });

    res.json({
        balances
    });
});

router.post("/deposit", authMiddleware, async (req: AuthRequest, res) => {

    const { asset, amount } = req.body;

    const existingBalance = await prisma.balance.findFirst({
        where: {
            userId: req.userId,
            asset
        }
    });

    if (existingBalance) {

        await prisma.balance.update({
            where: {
                id: existingBalance.id
            },
            data: {
                amount: existingBalance.amount + amount
            }
        });

    } else {

        await prisma.balance.create({
            data: {
                userId: req.userId!,
                asset,
                amount
            }
        });
    }

    res.json({
        message: "Deposit successful"
    });
});

export default router;
