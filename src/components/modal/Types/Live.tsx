import styles from "./Types.module.css";
import { Accessor, Component, createMemo, createSignal, Setter, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";

import { useMousePressed } from "solidjs-use";
import { safePlayVideo } from "../../extents/helper/helper";
import { LivePhotoIcon } from "../../svgIcons";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;
  currentChild: HTMLVideoElement;

  clickableArea: HTMLDivElement;
}

const Live: Component<LiveProps> = (props) => {
  const currentChild = () => props.currentChild;
  const media = () => props.media;
  const isVisible = () => props.isVisible;

  const isLiveVisible = createMemo(() => isVisible() && currentChild());

  const parentMediaRef = props.clickableArea;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  createMemo(async () => {
    if (!isLiveVisible()) return setIsLoading(true);
    currentChild().load();
    setIsLoading(false);
  });

  // ================== Handle longpress to play live photos ===============================================
  const { isEditing, setShowImageOnly, showImageOnly } = useViewMediaContext();
  const { pressed } = useMousePressed({ target: parentMediaRef });

  let timeId: number | undefined;

  createMemo(() => {
    if (!isLiveVisible()) return;

    if (pressed()) {
      timeId = setTimeout(async () => {
        setShowImageOnly(true);

        return await safePlayVideo(currentChild());
      }, 300);
    }

    if (!pressed()) {
      clearTimeout(timeId);
      if (!currentChild().paused) currentChild().pause();
    }
  });

  return (
    <>
      <video
        style={{ opacity: isLoading() ? 0 : 1 }}
        inert
        onLoad={() => setIsLoading(true)}
        onLoadedData={(e) => (e.currentTarget.currentTime = media().selected_frame)}
        onPlay={() => currentChild().fastSeek(0)}
        onPause={() => currentChild().fastSeek(media().selected_frame)}
        preload={isVisible() && currentChild() ? "metadata" : "none"}
        controls={false}
        controlslist="nodownload"
        playsinline={true}
        crossorigin="use-credentials">
        <source src={`${VIDEO_API_URL}${media().source_file}`} type={media().mime_type} />
        <p>Your browser doesn't support the video tag.</p>
      </video>

      {/* ////////////// All addon element must start here /////////////////////////////// */}
      <Show when={!showImageOnly()}>
        <div class={styles.liveIcon}>
          {LivePhotoIcon()}
          <span>LIVE</span>
        </div>
      </Show>

      {/* /////////////////////////////////////// */}
      <img
        class={styles.overlayImg}
        style={{ opacity: isLoading() ? 1 : 0 }}
        inert
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      />

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isLiveVisible()}>
        <EditLive media={media()} currentChild={currentChild()} isLoading={isLoading()} setIsLoading={setIsLoading} />
      </Show>
    </>
  );
};

export default Live;
