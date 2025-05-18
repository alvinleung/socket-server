import { createServer } from "http";
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
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});
