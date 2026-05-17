"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL =
  "https://bookish-rotary-phone-wr9g7pj4jg5539v5q-3000.app.github.dev";

export default function AuthBox() {
  const [username, setUsername] = useState("buyer");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  async function signin() {
    setMessage("");

    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Signin failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setMessage("Signed in successfully");
  }

  return (
    <div className="space-y-3 text-sm">
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-black border-zinc-800 text-white placeholder:text-zinc-500"
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-black border-zinc-800 text-white placeholder:text-zinc-500"
      />

      <Button onClick={signin} className="w-full">
        Sign In
      </Button>

      {message && <div className="text-zinc-400">{message}</div>}
    </div>
  );
}
