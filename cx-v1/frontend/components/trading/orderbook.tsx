"use client";

import { useEffect, useState } from "react";

import {
    connectWs,
    subscribe
} from "@/ws";

interface Depth {

    bids: {
        price: number;
        quantity: number;
    }[];

    asks: {
        price: number;
        quantity: number;
    }[];
}

export default function OrderBook() {

    const [depth, setDepth] =
        useState<Depth>({
            bids: [],
            asks: []
        });

    useEffect(() => {

        connectWs();

        subscribe((data) => {

            if (
                data.type === "DEPTH"
            ) {
                setDepth(data.data);
            }
        });

    }, []);

    return (

        <div className="text-sm">

            {/* ASKS */}

            <div className="mb-4">

                <div className="text-red-400 mb-2">
                    Asks
                </div>

                {
                    depth.asks
                        .slice(0, 10)
                        .reverse()
                        .map((ask, i) => (

                            <div
                                key={i}
                                className="
                                    flex
                                    justify-between
                                    py-1
                                "
                            >

                                <span className="text-red-400">
                                    {ask.price}
                                </span>

                                <span>
                                    {ask.quantity}
                                </span>

                            </div>
                        ))
                }

            </div>

            {/* BIDS */}

            <div>

                <div className="text-green-400 mb-2">
                    Bids
                </div>

                {
                    depth.bids
                        .slice(0, 10)
                        .map((bid, i) => (

                            <div
                                key={i}
                                className="
                                    flex
                                    justify-between
                                    py-1
                                "
                            >

                                <span className="text-green-400">
                                    {bid.price}
                                </span>

                                <span>
                                    {bid.quantity}
                                </span>

                            </div>
                        ))
                }

            </div>

        </div>
    );
}
