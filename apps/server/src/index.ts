import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
import "dotenv/config";

async function init() {
  startMessageConsumer();
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`Http Server Started at PORT: ${PORT}`)
  );

  socketService.initListeners();
}

init();
