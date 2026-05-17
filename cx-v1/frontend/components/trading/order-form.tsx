"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderForm() {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("100");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");

  async function placeOrder() {
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please sign in first");
      return;
    }

    const res = await fetch(
      "https://bookish-rotary-phone-wr9g7pj4jg5539v5q-3000.app.github.dev/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          market: "SOL_USDC",
          side,
          price: Number(price),
          quantity: Number(quantity),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Order failed");
      return;
    }

    setMessage("Order placed successfully");
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setSide("buy")}
          className={side === "buy" ? "bg-green-600" : "bg-zinc-800"}
        >
          Buy
        </Button>

        <Button
          onClick={() => setSide("sell")}
          className={side === "sell" ? "bg-red-600" : "bg-zinc-800"}
        >
          Sell
        </Button>
      </div>

      <Input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="bg-black border-zinc-800 text-white placeholder:text-zinc-500"
      />

      <Input
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="bg-black border-zinc-800 text-white placeholder:text-zinc-500"
      />

      <Button onClick={placeOrder} className="w-full">
        Place {side.toUpperCase()} Order
      </Button>

      {message && <div className="text-zinc-400">{message}</div>}
    </div>
  );
}
