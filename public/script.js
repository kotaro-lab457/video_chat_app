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

const connectToNewUser = (userId, stream) => {

  // 相手のユーザーを指定し、自分のストリーミング情報を渡す。
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");

  // 受信
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  // ビデオのコネクト切断の処理
  call.on("close", () => {
    video.remove();
  });
}

// デバイスから音声オーディオやビデオデータの取得
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  // 第一引数にDOM、第二引数に情報を格納
  addVideoStream(myVideo, stream);

  myPeer.on("call", call => {
    call.answer(stream);

    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  })

  // イベントの受信には on()メソッド
  socket.on("user-connected", (userId) => {
  // console.log("userId:", userId);
  
  connectToNewUser(userId, stream);
});
});

// openイベントの受信
myPeer.on("open", userId => {
  // 受け取ったjoinIdを取得。
  socket.emit("join-room", ROOM_ID, userId);
});
