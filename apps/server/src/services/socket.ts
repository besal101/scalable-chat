import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: process.env.REDISHOST!,
  port: parseInt(process.env.REDISPORT!),
  username: process.env.REDISUSERNAME!,
  password: process.env.REDISPASSWORD!,
});

const sub = new Redis({
  host: process.env.REDISHOST!,
  port: parseInt(process.env.REDISPORT!),
  username: process.env.REDISUSERNAME!,
  password: process.env.REDISPASSWORD!,
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received", message);
        //publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
        await produceMessage(message);
        console.log("MESSAGE PRODUCED TO KAFKA BROKER");
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
