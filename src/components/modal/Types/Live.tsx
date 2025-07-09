import styles from "./Types.module.css";
import { Component, createMemo, createSignal, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import EditLive from "../Editing/EditLive";

import { useMousePressed } from "solidjs-use";
import { safePlayVideo } from "../../extents/helper/helper";
import { LivePhotoIcon } from "../../svgIcons";
import { StyleKeys } from "../MediaDisplay";

interface LiveProps {
  media: MediaType;
  isVisible: boolean;

  clickableArea: HTMLDivElement;
  childDim: StyleKeys;
}

const Live: Component<LiveProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  const childDim = () => props.childDim;

  let liveRef: HTMLVideoElement;

  const isLiveVisible = createMemo(() => isVisible() && liveRef);

  const parentMediaRef = props.clickableArea;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  createMemo(async () => {
    if (!isLiveVisible()) return setIsLoading(true);
    liveRef!.load();
    setIsLoading(false);
  });

  // ================== Handle longpress to play live photos ===============================================
  const { openModal, setOpenModal } = useViewMediaContext();
  const { pressed } = useMousePressed({ target: parentMediaRef });

  let timeId: number | undefined;

  createMemo(() => {
    if (!isLiveVisible() || !liveRef) return;

    if (pressed()) {
      timeId = setTimeout(async () => {
        setOpenModal("showImage", true);

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

  return (
    <>
      <video
        ref={(el) => (liveRef = el)}
        style={{ ...childDim() }}
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
      <Show when={!openModal.showImage}>
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
      <Show when={openModal.isEditing && isLiveVisible()}>
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
