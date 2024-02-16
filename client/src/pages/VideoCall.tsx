// VideoCall.tsx
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const peerConnection = new RTCPeerConnection();

const VideoCall: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        peerConnection.createOffer()
          .then(offer => {
            return peerConnection.setLocalDescription(offer);
          })
          .then(() => {
            socket.emit('offer', peerConnection.localDescription);
          });

        socket.on('answer', (answer) => {
          peerConnection.setRemoteDescription(answer);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('icecandidate', event.candidate);
          }
        };

        socket.on('icecandidate', (candidate) => {
          peerConnection.addIceCandidate(candidate);
        });

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      });
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;