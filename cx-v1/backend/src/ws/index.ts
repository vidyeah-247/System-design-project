import { WebSocketServer, WebSocket } from "ws";
interface UserSocket {
    socket: WebSocket;
    markets: string[];
}

const users: UserSocket[] = [];

export const wss = new WebSocketServer({
    port: 8080
});

wss.on("connection", (socket) => {

    console.log("New websocket connection");

    users.push({
        socket,
        markets: []
    });

    socket.on("message", (message) => {

        try {

            const data =
                JSON.parse(message.toString());

            /*
                {
                    "type": "SUBSCRIBE",
                    "market": "SOL_USDC"
                }
            */

            if (data.type === "SUBSCRIBE") {

                const user =
                    users.find(
                        u => u.socket === socket
                    );

                if (!user) {
                    return;
                }

                if (
                    !user.markets.includes(
                        data.market
                    )
                ) {
                    user.markets.push(
                        data.market
                    );
                }

                socket.send(
                    JSON.stringify({
                        type: "SUBSCRIBED",
                        market: data.market
                    })
                );
            }

        } catch (e) {

            console.log(e);
        }
    });

    socket.on("close", () => {

        const index =
            users.findIndex(
                u => u.socket === socket
            );

        if (index !== -1) {
            users.splice(index, 1);
        }
    });
});

export function broadcastDepth(
    market: string,
    depth: any
) {

    users.forEach((user) => {

        if (
            user.markets.includes(market)
        ) {

            user.socket.send(
                JSON.stringify({
                    type: "DEPTH",
                    market,
                    data: depth
                })
            );
        }
    });
}

export function broadcastTrade(
    market: string,
    trade: any
) {

    users.forEach((user) => {

        if (
            user.markets.includes(market)
        ) {

            user.socket.send(
                JSON.stringify({
                    type: "TRADE",
                    market,
                    data: trade
                })
            );
        }
    });
}