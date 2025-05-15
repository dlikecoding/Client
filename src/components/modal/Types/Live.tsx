import { Accessor, Component, createMemo, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";
import Spinner from "../../extents/Spinner";
import { useMousePressed } from "solidjs-use";
import { safePlayVideo } from "../../extents/helper/helper";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;

  clickableArea: HTMLDivElement;
}

const Live: Component<LiveProps> = (props) => {
  let liveRef: HTMLVideoElement;
  const isVisible = () => props.isVisible;

  const [isSeeking, setIsSeeking] = createSignal(false);
  const { isEditing, setIsEditing } = useViewMediaContext();

  const parentMediaRef = props.clickableArea;

  const CURRENT_FRAME = 0;
  // ================== Handle longpress to play live photos ===============================================

  const { pressed } = useMousePressed({ target: parentMediaRef });

  let timeId: number | undefined;

  createMemo(() => {
    if (!isVisible()) return;
    if (!liveRef) return;

    if (pressed()) {
      timeId = setTimeout(async () => {
        props.setShowImageOnly(true);
        await safePlayVideo(liveRef);
        return;
      }, 500);
    }

    if (!pressed()) {
      clearTimeout(timeId);
      if (!liveRef.paused) {
        liveRef.pause();
        liveRef.fastSeek(CURRENT_FRAME);
      }
    }
  });

  return (
    <>
      <video
        style={{ display: isSeeking() ? "none" : "" }}
        ref={(el) => (liveRef = el)}
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
        {liveRef! && <EditLive liveRef={liveRef} setLoading={setIsSeeking} setIsEditing={setIsEditing} />}
      </Show>
    </>
  );
};

export default Live;

const playLivePhoto = (video: HTMLVideoElement, delay: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      video.play().then(resolve).catch(reject);
    }, delay);
  });
};
