const express = require('express');
const app = express();
const server = require('http').Server(app);

// どの通信行うか（今回は http）で socket io側に知らせる。
const io = require("socket.io")(server);

// uuidから v4の関数を取り出す。
const { v4: uuidV4 } = require('uuid');

// ポート番号の設定
server.listen(process.env.PORT || 3030);

// テンプレートエンジンの設定
app.set("view engine", "ejs");

// CSSやJSファ入りの静的ファイルを読み込む
app.use(express.static("public"));

// uuidを含んだパスにする
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`)
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// ユーザーが接続されるたびの処理
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("roomId=", roomId);
    console.log("userId=", userId);
    // roomIdで入ったことを知らせる。（コネクトする必要がある）
    socket.join(roomId);

    // 入ってきたユーザー以外に知らせる。
    socket.to(roomId).emit("user-connected", userId);

    // どのユーザーが抜けたか知らせる。
    socket.on("disconnect", () => {
      // 同一ルーム内のみに投げる
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});