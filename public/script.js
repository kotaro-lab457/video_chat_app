// ポート番号とコネクト
const socket = io("/");

const myPeer = new Peer();

// openイベントの受信
myPeer.on("open", userId => {
  // 受け取ったjoinIdを取得。
  socket.emit("join-room", ROOM_ID, userId);
});

// イベントの受信には on()メソッド
socket.on("user-connected", (userId) => {
  console.log("userId:", userId);
});