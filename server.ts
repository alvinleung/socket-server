import fs from "fs";
import path from "path";
import { createServer } from "https";
import { networkInterfaces } from "os";
import { Server, Socket } from "socket.io";

import dotenv from "dotenv";
dotenv.config(); // Load .env

const keyPath = process.env.SSL_KEY_PATH!;
const certPath = process.env.SSL_CERT_PATH!;

// Read SSL certificate
const key = fs.readFileSync(path.resolve(keyPath), "utf8");
const cert = fs.readFileSync(path.resolve(certPath), "utf8");
const httpServer = createServer({
  key,
  cert,
});

// create https server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // have a more laxed policy as a proof of concept
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Client connected: ", socket.id);
  console.log("Client address: ", socket.handshake.address);

  // join the only room in the server
  socket.join("room");

  socket.on("message", (msg) => {
    console.log(`Message from ${socket.id}`, msg);

    // broadcast the message to the room

    // this would not emit to the rest of the room
    // socket.to("room").emit("message", {
    //   userId: socket.id,
    //   content: msg,
    // });

    // this emit to the rest of the room
    io.to("room").emit("message", {
      userId: socket.id,
      content: msg,
    });
  });

  socket.on("disconnect", () => {
    console.log(`client disconnected: `, socket.id);
  });
});

const PORT = 3000;

// Get the system IP address
const getSystemIP = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost"; // Fallback to localhost if no external IP is found
};

const IP = getSystemIP();
httpServer.listen(PORT, () => {
  console.log(
    "------------------------------------------------------------------------",
  );
  console.log(`WebSocket server running on http://${IP}:${PORT}`);
  console.log("Environment: ", process.env.NODE_ENV!);
  console.log(
    "------------------------------------------------------------------------",
  );
});
