import React, { useEffect, useRef, useState } from "react";

const CapturePhoto = ({ onCaptureConfirm, onCancel }) => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = streamData;
        setStream(streamData);
      } catch (err) {
        alert("Unable to access camera. Please allow camera access.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline style={styles.video}></video>
            <br />
            <button onClick={capturePhoto} style={styles.button}>Capture Photo</button>
            <button onClick={onCancel} style={styles.button}>Cancel</button>
          </>
        ) : (
          <>
            <h3>Preview:</h3>
            <img src={capturedImage} alt="Captured" style={styles.preview} />
            <button onClick={() => onCaptureConfirm(capturedImage)} style={styles.button}>Confirm & Proceed</button>
            <button onClick={onCancel} style={styles.button}>Retake / Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    maxWidth: "90%",
    maxHeight: "90%",
    overflowY: "auto",
  },
  video: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
  },
  preview: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    cursor: "pointer",
  }
};

export default CapturePhoto;

