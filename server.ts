import { createServer } from "http";
import { networkInterfaces } from "os";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("message", (msg) => {
    console.log(`Message from ${socket.id}`, msg);
    socket.emit("reply", `Server received: ${msg}`);
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
  console.log(`WebSocket server running on http://${IP}:${PORT}`);
});
