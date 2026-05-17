import { executeTrade } from "./trade";

import {
    broadcastDepth,
    broadcastTrade
} from "../ws";

export type Side = "buy" | "sell";

export interface Order {

    id: string;

    userId: string;

    side: Side;

    price: number;

    quantity: number;

    filled: number;

    market: string;
}

export class OrderBook {

    bids: Order[] = [];

    asks: Order[] = [];

    addOrder(order: Order) {

        if (order.side === "buy") {

            this.matchBuy(order);

            if (order.quantity > order.filled) {

                this.bids.push(order);

                /*
                    Highest bid first
                */

                this.bids.sort(
                    (a, b) => b.price - a.price
                );
            }

        } else {

            this.matchSell(order);

            if (order.quantity > order.filled) {

                this.asks.push(order);

                /*
                    Lowest ask first
                */

                this.asks.sort(
                    (a, b) => a.price - b.price
                );
            }
        }

        /*
            BROADCAST UPDATED DEPTH
        */

        broadcastDepth(
            order.market,
            this.getDepth()
        );
    }

    matchBuy(order: Order) {

        for (let i = 0; i < this.asks.length; i++) {

            const ask =
                this.asks[i];

            /*
                Buy cannot match
                more expensive ask
            */

            if (ask.price > order.price) {
                break;
            }

            const remainingBuy =
                order.quantity - order.filled;

            const remainingAsk =
                ask.quantity - ask.filled;

            const tradedQty = Math.min(
                remainingBuy,
                remainingAsk
            );

            /*
                UPDATE FILLED QTY
            */

            order.filled += tradedQty;

            ask.filled += tradedQty;

            console.log("TRADE EXECUTED");

            /*
                STORE TRADE
                UPDATE BALANCES
            */

            executeTrade(
                order.userId,
                ask.userId,

                order.id,
                ask.id,

                order.market,

                ask.price,

                tradedQty
            );

            /*
                BROADCAST TRADE
            */

            broadcastTrade(
                order.market,
                {
                    price: ask.price,
                    quantity: tradedQty
                }
            );

            /*
                REMOVE FILLED ASK
            */

            if (ask.quantity === ask.filled) {

                this.asks.splice(i, 1);

                i--;
            }

            /*
                ORDER FULLY FILLED
            */

            if (order.quantity === order.filled) {
                break;
            }
        }
    }

    matchSell(order: Order) {

        for (let i = 0; i < this.bids.length; i++) {

            const bid =
                this.bids[i];

            /*
                Sell cannot match
                cheaper bid
            */

            if (bid.price < order.price) {
                break;
            }

            const remainingSell =
                order.quantity - order.filled;

            const remainingBid =
                bid.quantity - bid.filled;

            const tradedQty = Math.min(
                remainingSell,
                remainingBid
            );

            /*
                UPDATE FILLED QTY
            */

            order.filled += tradedQty;

            bid.filled += tradedQty;

            console.log("TRADE EXECUTED");

            /*
                STORE TRADE
                UPDATE BALANCES
            */

            executeTrade(
                bid.userId,
                order.userId,

                bid.id,
                order.id,

                order.market,

                bid.price,

                tradedQty
            );

            /*
                BROADCAST TRADE
            */

            broadcastTrade(
                order.market,
                {
                    price: bid.price,
                    quantity: tradedQty
                }
            );

            /*
                REMOVE FILLED BID
            */

            if (bid.quantity === bid.filled) {

                this.bids.splice(i, 1);

                i--;
            }

            /*
                ORDER FULLY FILLED
            */

            if (order.quantity === order.filled) {
                break;
            }
        }
    }

    getDepth() {

        return {

            bids: this.bids.map((bid) => ({

                price: bid.price,

                quantity:
                    bid.quantity - bid.filled
            })),

            asks: this.asks.map((ask) => ({

                price: ask.price,

                quantity:
                    ask.quantity - ask.filled
            }))
        };
    }
}
