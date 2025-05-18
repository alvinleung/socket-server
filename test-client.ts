import { io } from "socket.io-client";

// const socket = io("http://24.199.108.142:3000");
const socket = io("https://server-chocopie.digital:3000");
console.log("attempting to start server");

socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);

  // Send a test message to the server
  socket.emit("message", "Hello from client.ts!");
});

socket.on("reply", (msg: string) => {
  console.log("Reply from server:", msg);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
