import { Accessor, Component, createSignal, onMount, Setter, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";
import Spinner from "../../extents/Spinner";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;
}

const Live: Component<LiveProps> = (props) => {
  let videoRef: HTMLVideoElement;
  const isVisible = () => props.isVisible;

  const [isSeeking, setIsSeeking] = createSignal(false);
  const { isEditing, setIsEditing } = useViewMediaContext();

  return (
    <>
      <video
        style={{ display: isSeeking() ? "none" : "" }}
        ref={(el) => (videoRef = el)}
        inert
        poster={props.media.thumb_path}
        preload="metadata"
        controls={false}
        controlslist="nodownload"
        playsinline={true}
        crossorigin="use-credentials">
        <source src={`${VIDEO_API_URL}${props.media.source_file}`} type={props.media.mime_type} />
        <p>Your browser doesn't support the video tag.</p>
      </video>

      <Show when={isEditing() && isVisible()}>
        {isSeeking() && <Spinner />}
        {videoRef! && <EditLive video={videoRef} setLoading={setIsSeeking} setIsEditing={setIsEditing} />}
      </Show>
    </>
  );
};

export default Live;
