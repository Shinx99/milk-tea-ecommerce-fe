import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";


let stompClient;
let subscription; // để unsubscribe khi reconnect/thoát trang

export function connectOrderSocket(onMessage) {
  if (stompClient?.active) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      // tránh subscribe chồng khi tự reconnect
      subscription?.unsubscribe();
      subscription = stompClient.subscribe("/topic/orders", (message) => {
        onMessage?.(JSON.parse(message.body));
      });
    },
  });

  stompClient.activate();
}

export function disconnectOrderSocket() {
  subscription?.unsubscribe();
  subscription = null;
  stompClient?.deactivate();
}
