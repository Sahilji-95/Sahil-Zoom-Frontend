import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./VideoMeet.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import io from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import { height, width } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import SendIcon from "@mui/icons-material/Send";

const server_url = "http://localhost:8000";

let connection = {};
const peerConfigConnection = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
export default function VideoMeet() {
  let Navigate = useNavigate();
  const socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();
  const videoRef = useRef([]);

  let [videoAvalible, setVideoAvalible] = useState(true);
  let [audioAvalible, setAudioAvalible] = useState(true);
  let [audio, setAudio] = useState();
  let [video, setVideo] = useState([]);
  let [screen, setScreen] = useState();
  let [showModel, setShowModel] = useState(true);
  let [screenAvalible, setScreenAvalible] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(99);
  let [askForUsername, setAskForUsername] = useState(true);
  let [userName, setUserName] = useState("");
  let [videos, setVideos] = useState([]);

  const getPremissions = async () => {
    try {
      const videoPremissions = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPremissions) {
        setVideoAvalible(true);
      } else {
        setVideoAvalible(false);
      }
      const audioPremissions = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPremissions) {
        setAudioAvalible(true);
      } else {
        setAudioAvalible(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvalible(true);
      } else {
        setScreenAvalible(false);
      }

      if (videoAvalible || audioAvalible) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvalible,
          audio: audioAvalible,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMediaSuccsess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connection) {
      if (id === socketIdRef.current) {
        continue;
      }
      // connection[id].addStream(window.localStream);
      window.localStream.getTracks().forEach((track) => {
        connection[id].addTrack(track, window.localStream);
      });
      connection[id].createOffer().then((description) => {
        connection[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connection[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onEnded = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (error) {
            console.log(error);
          }
          let blacksilence = (...args) => {
            new MediaStream([black(...args), silence()]);
            window.localStream = blacksilence();
            localVideoRef.current.srcObject = window.localStream;
          };

          for (let id in connection) {
            // connection[id].addStream(window.localStream);
            window.localStream.getTracks().forEach((track) => {
              connection[id].addTrack(track, window.localStream);
            });
            connection[id].createOffer().then((description) => {
              connection[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connection[id].localDescription }),
                  );
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          }
        }),
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvalible) || (audio && audioAvalible)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccsess)
        .then((stream) => {})
        .catch((err) => {
          console.log(err);
        });
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (error) {}
    }
  };

  useEffect(() => {
    getPremissions();
  }, []);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMsgFromServer = (fromId, message) => {
    let signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connection[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connection[fromId]
                .createAnswer()
                .then((description) => {
                  connection[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connection[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
      if (signal.ice) {
        connection[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessage) => [
      ...prevMessage,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevMessage) => prevMessage + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMsgFromServer);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => {
          return videos.filter((video) => video.socketId !== id);
        });
      });

      socketRef.current.on("user-joined", (id, clients) => {
        console.log("User joined:", id, clients);
        if (!clients) return;
        clients.forEach((socketListId) => {
          connection[socketListId] = new RTCPeerConnection(
            peerConfigConnection,
          );

          connection[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connection[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current?.find(
              (video) => video.socketId === socketListId,
            );
            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) => {
                  return video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video;
                });

                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
          if (window.localStream !== undefined && window.localStream !== null) {
            connection[socketListId].addStream(window.localStream);
          } else {
            let blacksilence = (...args) => {
              new MediaStream([black(...args), silence()]);
              window.localStream = blacksilence();
              connection[socketListId].addStream(window.localStream);
            };
          }
        });
        if (id === socketIdRef.current) {
          for (let id2 in connection) {
            if (id2 === socketIdRef.current) {
              continue;
            }
            try {
              connection[id2].addStream(window.localStream);
            } catch (error) {}
            connection[id2].createOffer().then((description) => {
              connection[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connection[id2].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvalible);
    setAudio(audioAvalible);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };
  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connection) {
      if (id === socketIdRef.current) continue;
      // connection[id].addStream(window.localStream);
      window.localStream.getTracks().forEach((track) => {
        connection[id].addTrack(track, window.localStream);
      });
      connection[id].createOffer().then((description) => {
        connection[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connection[id].localDescription }),
            );
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let sendMessage = () => {
    socketRef.current.emit("chat-messages", message, userName);
    setMessage("");
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }
    Navigate("/home");
  };

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter the Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <br />
          <Button variant="contained" onClick={connect}>
            Join
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer">
          {showModel === true ? (
            <div className="chatRoom">
              <div className="chatContainer">
                <h1>Chat</h1>
                <div className="chattingDisplay">
                  {messages.length > 0 ? (
                    messages.map((item, index) => {
                      return (
                        <div key={index} style={{ marginBottom: "20px" }}>
                          <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                          <p>{item.data}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No msg Yet</p>
                  )}
                </div>
                <div className="chattingArea">
                  <TextField
                    id="filled-basic"
                    label="Enter Chat"
                    variant="filled"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={sendMessage}>
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="buttonContainer">
            <IconButton onClick={handleVideo}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleAudio}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            {screenAvalible === true ? (
              <IconButton onClick={handleScreen}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton onClick={handleEndCall}>
              <CallEndIcon style={{ color: "red" }} />
            </IconButton>
            <Badge badgeContent={newMessages} max={999} color="primary">
              <IconButton
                onClick={() => {
                  setShowModel(!showModel);
                }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>
          <video
            className="meetUserVideo"
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          <div className="confrenceView">
            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
