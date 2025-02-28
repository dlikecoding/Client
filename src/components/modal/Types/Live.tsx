import { Component } from "solid-js";
import { MediaType } from "../../../context/ViewContext";

interface LiveProps {
  media: MediaType;
}

const Live: Component<LiveProps> = (props) => {
  return (
    <video
      src={props.media.SourceFile}
      poster={props.media.ThumbPath}
      controls
      autoplay
      muted
      preload="metadata"
      playsinline
      crossorigin="use-credentials">
      <source src={props.media.SourceFile} type={props.media.MIMEType} />
      <p>Your browser doesn't support the video tag.</p>
    </video>
  );
};

export default Live;
