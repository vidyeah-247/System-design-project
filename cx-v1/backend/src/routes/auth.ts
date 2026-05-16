import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET as string
        );

        res.json({
            token
        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET as string
        );

        res.json({
            token
        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default router;

