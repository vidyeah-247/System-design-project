"use client";

import { useEffect, useState } from "react";

import {
    connectWs,
    subscribe
} from "@/ws";

interface Trade {

    price: number;

    quantity: number;
}

export default function RecentTrades() {

    const [trades, setTrades] =
        useState<Trade[]>([]);

    useEffect(() => {

        connectWs();

        subscribe((data) => {

            if (
                data.type === "TRADE"
            ) {

                setTrades(prev => [

                    data.data,

                    ...prev
                ].slice(0, 20));
            }
        });

    }, []);

    return (

        <div className="text-sm">

            <div className="space-y-2">

                {
                    trades.map(
                        (trade, i) => (

                            <div
                                key={i}
                                className="
                                    flex
                                    justify-between
                                "
                            >

                                <span className="text-yellow-400">
                                    {trade.price}
                                </span>

                                <span>
                                    {trade.quantity}
                                </span>

                            </div>
                        )
                    )
                }

            </div>

        </div>
    );
}
