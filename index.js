const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");

// Hardcoded MongoDB URL and Port
const MONGO_URL = "mongodb://127.0.0.1:27017/mydb"; // Replace with your MongoDB connection string
const PORT = 5000; // Replace with the desired port number

app.use(cors());
app.use(express.json());

// tsrat of the  this is the static database of the mongodb 





// mongoose
//   .connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connection Successful");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// end of the static datbase o fthe mongo 


// this is the start of the dynamics and realtime databse of the mongo db



mongoose.connect("mongodb+srv://raykushwaha0031:C1k4maJXzH2vAmh4@blog.zlf5agh.mongodb.net/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,  // Example: Increased timeout to 10 seconds
  socketTimeoutMS: 45000,           // Example: Increased socket timeout to 45 seconds
}).then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.error("Error connecting to database:", err);
});
 
//
//


// this is the end of the dynamics and realtime databse of the mongo db




app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
