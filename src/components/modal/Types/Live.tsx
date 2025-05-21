import styles from "./Types.module.css";
import { Accessor, Component, createMemo, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";
import Spinner from "../../extents/Spinner";
import { useMousePressed } from "solidjs-use";
import { safePlayVideo } from "../../extents/helper/helper";
import { LivePhotoIcon } from "../../svgIcons";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;

  clickableArea: HTMLDivElement;
}

const Live: Component<LiveProps> = (props) => {
  const parentMediaRef = props.clickableArea;
  let liveRef: HTMLVideoElement;
  const isVisible = () => props.isVisible;

  // ================== Handle longpress to play live photos ===============================================
  const [isSeeking, setIsSeeking] = createSignal(false);
  const { isEditing, setIsEditing } = useViewMediaContext();
  const { pressed } = useMousePressed({ target: parentMediaRef });

  let timeId: number | undefined;

  createMemo(() => {
    if (!isVisible()) return;
    if (!liveRef) return;

    if (pressed()) {
      timeId = setTimeout(async () => {
        props.setShowImageOnly(true);

        return await safePlayVideo(liveRef);
      }, 300);
    }

    if (!pressed()) {
      clearTimeout(timeId);
      if (!liveRef.paused) liveRef.pause();
    }
  });

  return (
    <>
      <Show when={!props.showImageOnly()}>
        <div class={styles.liveIcon}>
          {LivePhotoIcon()}
          <span>LIVE</span>
        </div>
      </Show>

      <video
        style={{ display: isSeeking() ? "none" : "" }}
        ref={(el) => (liveRef = el)}
        inert
        poster={props.media.thumb_path}
        onPlay={() => liveRef.fastSeek(0)}
        onPause={() => liveRef.fastSeek(props.media.selected_frame)}
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
        {liveRef! && (
          <EditLive
            media={props.media}
            liveRef={liveRef}
            setLoading={setIsSeeking}
            setIsEditing={setIsEditing}
            isLoading={isSeeking}
          />
        )}
      </Show>
    </>
  );
};

export default Live;
