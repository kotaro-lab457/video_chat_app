// ポート番号とコネクト
const socket = io("/");

const myPeer = new Peer();
const videoWrap = document.getElementById("video-wrap");
const myVideo = document.createElement("video");
myVideo.muted = true;

const addVideoStream = (video, stream) => {
  // DOM要素（video）
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    // play()メソッド:再生する
    video.play();
  });
  videoWrap.append(video);
}

// デバイスから音声オーディオやビデオデータの取得
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  // 第一引数にDOM、第二引数に情報を格納
  addVideoStream(myVideo, stream);
});

// openイベントの受信
myPeer.on("open", userId => {
  // 受け取ったjoinIdを取得。
  socket.emit("join-room", ROOM_ID, userId);
});

// イベントの受信には on()メソッド
socket.on("user-connected", (userId) => {
  console.log("userId:", userId);
});