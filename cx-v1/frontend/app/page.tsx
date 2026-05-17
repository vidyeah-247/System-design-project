"use client";

import OrderBook from "@/components/trading/orderbook";
import AuthBox from "@/components/trading/auth-box";
import OrderForm from "@/components/trading/order-form";
import RecentTrades from "@/components/trading/recent-trades";
import TradingChart from "@/components/trading/chart";

import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="h-14 border-b border-zinc-800 flex items-center px-4">
        <div className="text-xl font-bold">CX Exchange</div>
      </div>

      <div className="grid grid-cols-12 h-[calc(100vh-56px)]">
        <div className="col-span-9 border-r border-zinc-800">
          <div className="h-[70%] border-b border-zinc-800 p-2">
            <Card className="h-full bg-zinc-950 border-zinc-800">
              <CardContent className="h-full p-0">
                <TradingChart />
              </CardContent>
            </Card>
          </div>

          <div className="h-[30%] p-2 overflow-y-auto">
            <Card className="h-full bg-zinc-950 border-zinc-800 overflow-y-auto">
              <CardContent className="p-4">
                <RecentTrades />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-3 flex flex-col min-h-0">
          <div className="h-[40%] border-b border-zinc-800 p-2 overflow-y-auto">
            <Card className="h-full bg-zinc-950 border-zinc-800 overflow-y-auto">
              <CardContent className="p-4">
                <OrderBook />
              </CardContent>
            </Card>
          </div>

          <div className="h-[60%] p-2 overflow-y-auto">
            <Card className="h-full bg-zinc-950 border-zinc-800 overflow-y-auto">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <AuthBox />
                  <OrderForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}