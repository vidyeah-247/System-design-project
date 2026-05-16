export type Side = "buy" | "sell";

export interface Order {
    id: string;
    userId: string;

    side: Side;

    price: number;
    quantity: number;

    filled: number;
}
export class OrderBook {

    bids: Order[] = [];
    asks: Order[] = [];

    addOrder(order: Order) {

        if (order.side === "buy") {

            this.matchBuy(order);

            if (order.quantity > order.filled) {
                this.bids.push(order);

                this.bids.sort(
                    (a, b) => b.price - a.price
                );
            }

        } else {

            this.matchSell(order);

            if (order.quantity > order.filled) {
                this.asks.push(order);

                this.asks.sort(
                    (a, b) => a.price - b.price
                );
            }
        }
    }

    matchBuy(order: Order) {

        for (let i = 0; i < this.asks.length; i++) {

            const ask = this.asks[i];

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

            order.filled += tradedQty;
            ask.filled += tradedQty;

            console.log("TRADE EXECUTED");

            if (ask.quantity === ask.filled) {
                this.asks.splice(i, 1);
                i--;
            }

            if (order.quantity === order.filled) {
                break;
            }
        }
    }

    matchSell(order: Order) {

        for (let i = 0; i < this.bids.length; i++) {

            const bid = this.bids[i];

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

            order.filled += tradedQty;
            bid.filled += tradedQty;

            console.log("TRADE EXECUTED");

            if (bid.quantity === bid.filled) {
                this.bids.splice(i, 1);
                i--;
            }

            if (order.quantity === order.filled) {
                break;
            }
        }
    }

    getDepth() {

        return {
            bids: this.bids,
            asks: this.asks
        };
    }
}
