// ポート番号とコネクト
const socket = io("/");

const userId = 12345;

socket.emit("join-room", ROOM_ID, userId);

// イベントの受信には on()メソッド
socket.on("user-connected", (userId) => {
  console.log("userId:", userId);
});