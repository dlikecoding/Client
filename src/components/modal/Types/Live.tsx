import { Component } from "solid-js";
import { MediaType } from "../../../context/ViewContext";

interface LiveProps {
  media: MediaType;
}

const Live: Component<LiveProps> = (props) => {
  return (
    <>
      <video
        inert
        // ref={videoRef}
        poster={props.media.ThumbPath}
        // onPlay={() => setIsPlaying(true)}
        // onPause={() => {
        //   props.setShowImageOnly(false);
        //   setIsPlaying(false);
        // }}
        preload="metadata"
        controls={false}
        playsinline={true}
        crossorigin="use-credentials">
        <source src={`http://localhost:8080${props.media.SourceFile}`} type={props.media.MIMEType} />
        {/* <source src={props.media.SourceFile} type={props.media.MIMEType} /> */}

        <p>Your browser doesn't support the video tag.</p>
      </video>
    </>
  );
};

export default Live;
