import styles from "./Types.module.css";
import { Component, createMemo, createSignal, Setter, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";

import { useMousePressed } from "solidjs-use";
import { safePlayVideo } from "../../extents/helper/helper";
import { LivePhotoIcon } from "../../svgIcons";
import { useManageURLContext } from "../../../context/ManageUrl";
import { zoomPhoto } from "../../extents/helper/zoom";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;

  clickableArea: HTMLDivElement;
}

const Live: Component<LiveProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;

  let liveRef: HTMLVideoElement;

  const isLiveVisible = createMemo(() => isVisible() && liveRef);

  const parentMediaRef = props.clickableArea;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  createMemo(async () => {
    if (!isLiveVisible()) return setIsLoading(true);
    liveRef!.load();
    setIsLoading(false);
  });

  // ================== Handle longpress to play live photos ===============================================
  const { isEditing, setShowImageOnly, showImageOnly } = useViewMediaContext();
  const { pressed } = useMousePressed({ target: parentMediaRef });

  let timeId: number | undefined;

  createMemo(() => {
    if (!isLiveVisible() || !liveRef) return;

    if (pressed()) {
      timeId = setTimeout(async () => {
        setShowImageOnly(true);

        return await safePlayVideo(liveRef);
      }, 200);
    }

    if (!pressed()) {
      clearTimeout(timeId);
      if (!liveRef.paused) liveRef.pause();
    }
  });

  const seekToSelectedFrame = (e: Event) => {
    seekingTo(e, liveRef!, media().selected_frame);
  };

  const zoomSize = createMemo(() => {
    if (!isLiveVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
    return zoomPhoto(liveRef!, view.zoomLevel);
  });

  return (
    <>
      <video
        ref={(el) => (liveRef = el)}
        style={{
          width: zoomSize().width,
          height: zoomSize().height,
        }}
        inert
        onLoad={() => setIsLoading(true)}
        onLoadedData={(e) => seekToSelectedFrame(e)}
        onPlay={(e) => seekingTo(e, liveRef!, 0)}
        onPause={(e) => seekToSelectedFrame(e)}
        controls={false}
        controlslist="nodownload"
        preload="none"
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
        style={{ "z-index": isLoading() ? 1 : -1 }}
        inert
        loading="lazy"
        src={media().thumb_path}
        alt={`Image not found`}
      />

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isLiveVisible()}>
        <EditLive media={media()} currentChild={liveRef!} isLoading={isLoading()} setIsLoading={setIsLoading} />
      </Show>
    </>
  );
};

export default Live;

const seekingTo = (e: Event, video: HTMLVideoElement, time: number) => {
  if (video) {
    e.preventDefault();
    video.currentTime = time;
  }
};
