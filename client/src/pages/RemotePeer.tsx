// RemotePeer.tsx
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");
const peerConnection = new RTCPeerConnection();

const RemotePeer: React.FC = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket.on("offer", (offer) => {
      peerConnection
        .setRemoteDescription(offer)
        .then(() => {
          return peerConnection.createAnswer();
        })
        .then((answer) => {
          return peerConnection.setLocalDescription(answer);
        })
        .then(() => {
          socket.emit("answer", peerConnection.localDescription);
        });
    });

    socket.on("icecandidate", (candidate) => {
      peerConnection.addIceCandidate(candidate);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("icecandidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  }, []);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default RemotePeer;
