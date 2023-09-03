import React, { useState } from "react";
import "./Recording.css";
import axios from "axios";
import { backendUrl } from "../../backendUrl";
import { ToastContainer, toast } from "react-toastify";
import { toastErrortInvoke, toastSuccesstInvoke } from "../../custoToast";

function disableIntraction(intractionPause) {
  intractionPause.classList.add("Recordig--uploadEngage");
  intractionPause.classList.remove("disable");
}
function enableIntraction(intractionPause) {
  intractionPause.classList.remove("Recordig--uploadEngage");
  intractionPause.classList.add("disable");
}

const uploadVideo = async (url, formdata) => {
  const uploadedLink = document.getElementById("uploadedLink");
  const intractionPause = document.getElementById("intractionPause");
  try {
    disableIntraction(intractionPause);

    //uploading video.
    const result = await axios.post(url, formdata);
    console.log(result);

    toastSuccesstInvoke("Uploaded Successfully");

    //
    uploadedLink.classList.remove("disable");
    uploadedLink.href = result.data.url;

    //making data to pass
    const recordingData = {
      title: "ScreenRecording",
      description:
        "Video is recorded and saved through client direct upload method",
      cloudianryUrl: result.data.url,
      id: sessionStorage.getItem("id"),
    };

    enableIntraction(intractionPause);

    //sending saved video url to server
    let result2 = await fetch(backendUrl() + "saveVideoUrl", {
      method: "POST",
      body: JSON.stringify(recordingData),
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    result2 = await result2.json();
    if (result2.status === 400) {
      throw Error("failed to save url");
    }
    console.log(result2);
    toastSuccesstInvoke("Saved successfully");
    console.log("result2", result2);
  } catch (err) {
    toastErrortInvoke("failed", err);
    console.log("error in cloudnary upload response", err);

    enableIntraction(intractionPause);
  }
};

function Recording() {
  let video;
  let stream;
  let cloudinaryUploadUrl;
  let chunk = [];
  const formdata = new FormData();

  const [recordingOption, setRecordingOption] = useState("screenRecording");

  // start recording fucntion.
  const handleRecording = async (e) => {
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;

    //hiding and showing some links
    const uploadedLink = document.getElementById("uploadedLink");
    uploadedLink.classList.add("disable");
    const download = document.getElementById("download");
    download.classList.add("disable");

    const result = await axios.get(backendUrl() + "startRecording", {
      withCredentials: true,
    });

    // fromation of uploading parameters along with file
    const data = result.data.result;
    console.log(data);
    cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${data.cloudinary_name}/auto/upload`;
    formdata.append("timestamp", data.timestamp);
    formdata.append("api_key", data.api_key);
    formdata.append("signature", data.signature);

    console.log(cloudinaryUploadUrl);
    //just to get Idea that stream is actuly working;
    video = document.getElementById("video");

    if (recordingOption == "screenRecording") {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    }

    video.srcObject = stream;
    const options = { mimeType: "video/webm; codecs=vp9" };
    const record = new MediaRecorder(stream, options);
    record.start();

    // stream data availabel to upload.
    record.ondataavailable = async (e) => {
      if (e.data.size > 0) chunk.push(e.data);
      const file = new Blob(chunk, { type: "video/webm" });
      console.log(file);
      formdata.append("file", file);
      download.classList.remove("disable");
      download.href = URL.createObjectURL(file);
      download.download = "demo.webm";

      //userconfermation to upload
      if (confirm("Want to upload this recording"))
        await uploadVideo(cloudinaryUploadUrl, formdata);
    };
  };

  // handling stop recording.
  const handleStopRecording = async (e) => {
    stream.getTracks().forEach((track) => track.stop());
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
  };

  return (
    <div className="Recording--container">
      <div>
        <select
          name="RecordingOption"
          id="recordingOption"
          onChange={(e) => setRecordingOption(e.target.value)}
          value={recordingOption}
        >
          <option value={"screenRecording"}> ScreenRecording</option>
          <option value={"webCamera"}> Web Camera</option>
        </select>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <video id="video" className="Recording--video" autoPlay></video>
      </div>
      <div className="Recording--BtnsDiv">
        <button
          id="startBtn"
          className="Recording--btn Recording--btn--start "
          onClick={handleRecording}
        >
          {" "}
          Start Recording
        </button>
        <button
          id="stopBtn"
          className="Recording--btn Recording--btn--stop"
          onClick={handleStopRecording}
        >
          {" "}
          Stop Recording
        </button>
        <a id="download" href="#" className="disable Recording--download">
          Download
        </a>
        <a
          id="uploadedLink"
          href="#"
          className="disable Recording--uploadedLlink"
        >
          {" "}
          Uploded Link
        </a>
      </div>
      <div id="intractionPause" className="disable">
        <h1>Wait Uploading *....</h1>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Recording;
