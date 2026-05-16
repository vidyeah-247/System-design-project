import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (_, res) => {
    res.send("Exchange backend running");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
import balanceRoutes from "./routes/balance";
app.use("/balance", balanceRoutes);
import orderRoutes from "./routes/order";
app.use("/order", orderRoutes);
