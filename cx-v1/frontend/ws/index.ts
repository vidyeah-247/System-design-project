let socket: WebSocket | null = null;

type Callback = (data: any) => void;

const callbacks: Callback[] = [];

export function connectWs() {

    if (socket) {
        return socket;
    }

    socket = new WebSocket(
    "wss://bookish-rotary-phone-wr9g7pj4jg5539v5q-8080.app.github.dev"
);

    socket.onopen = () => {

        console.log("WS connected");

        socket?.send(
            JSON.stringify({
                type: "SUBSCRIBE",
                market: "SOL_USDC"
            })
        );
    };

    socket.onmessage = (event) => {

        const data =
            JSON.parse(event.data);

        callbacks.forEach(
            cb => cb(data)
        );
    };

    return socket;
}

export function subscribe(
    cb: Callback
) {

    callbacks.push(cb);
}
