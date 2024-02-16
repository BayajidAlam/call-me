// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const kafka = require("kafka-node");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");

// const app = express();
// app.use(express.json());
// const server = http.createServer(app);
// const io = socketIo(server);

// // kafka
// const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
// const producer = new kafka.Producer(client);

// // redis
// const redis = require("redis");
// const redisClient = redis.createClient();

// // mongoose
// mongoose.connect("mongodb://localhost/my_database", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const chatSchema = new mongoose.Schema({

//   username: String,
//   message: String,
//   timestamp: Date,
// });

// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     username: String,
//     password: String,
//   })
// );

// const ChatMessage = mongoose.model("ChatMessage", chatSchema);
// const chatMessage = new ChatMessage({
//   username: "Alice",
//   message: "Hello, world!",
//   timestamp: new Date(),
// });
// chatMessage.save((err) => {
//   if (err) {
//     console.log("Error saving message:", err);
//   } else {
//     console.log("Message saved");
//   }
// });

// // socket
// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// // kafka
// producer.on("ready", () => {
//   console.log("Producer is ready");
// });

// producer.on("error", (err) => {
//   console.log("Producer is in error state");
//   console.log(err);
// });

// const payloads = [{ topic: "my-topic", messages: "hello kafka" }];
// producer.send(payloads, (err, data) => {
//   if (err) {
//     console.log("Error sending message:", err);
//   } else {
//     console.log("Message sent:", data);
//   }
// });

// // redis
// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });

// redisClient.on("error", (err) => {
//   console.log("Redis error", err);
// });

// // set to redis
// redisClient.set("my key", "my value", redis.print);
// redisClient.get("my key", redis.print);

// // Passport setup
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (res) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       });
//     });
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// app.use(
//   session({
//     secret: "my secret",
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // User registration and login routes
// app.post("/register", (req, res) => {
//   bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     const user = new User({
//       username: req.body.username,
//       password: hashedPassword,
//     });
//     user.save((err) => {
//       if (err) {
//         return res.status(500).json({ error: err });
//       }
//       res.status(200).json({ status: "Registration successful" });
//     });
//   });
// });

// app.post(
//   "/login",
//   passport.authenticate("local", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });