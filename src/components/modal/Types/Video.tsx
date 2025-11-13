import styles from "./Types.module.css";
import modalS from "./../ModalView.module.css";

import { Component, createMemo, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import { createStore } from "solid-js/store";
import { useManageURLContext } from "../../../context/ManageUrl";

// import Spinner from "../../extents/Spinner";
import EditVideo from "../Editing/EditVideo";
import { StyleKeys } from "../MediaDisplay";
// import { useMediaContext } from "../../../context/Medias";
// import { getKeyByItem, scrollToModalElement } from "../../extents/helper/helper";

interface VideoProps {
  media: MediaType;
  isVisible: boolean;
  childDim: StyleKeys;
}

type VideoStatus = {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  muted: boolean;
  isFullScreen: boolean;
};

// const SEEK_AMOUNT = 10; //Amount seek video

const Video: Component<VideoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  const childDim = () => props.childDim;

  const isVideoVisible = createMemo(() => isVisible() && videoRef);

  // Determine if video outside the view port, stop the video
  let videoRef: HTMLVideoElement;

  const [vidStatus, setVidStatus] = createStore<VideoStatus>({
    isLoading: true,
    isPlaying: false,
    currentTime: 0,
    muted: false,
    isFullScreen: false,
  });

  const { openModal } = useViewMediaContext(); //displayMedias
  // const { items } = useMediaContext();
  const { view } = useManageURLContext();

  /** Auto stop video playing when scroll to other element (videos) */
  createMemo(async () => {
    if (!isVideoVisible()) {
      if (videoRef && !videoRef.paused) return videoRef.pause(); //Video is not visible, pausing...
      return;
    }

    // On or off auto play video when it's visible
    if (!view.autoplay || !videoRef) return;
    if (videoRef.paused) togglePlayVideo(videoRef);
  });

  // const slowMode = createMemo(() => {
  //   if (!isVisible()) return 1;
  //   return !media().frame_rate || media().frame_rate < 200 ? 1 : 6;
  // });

  // const zoomSize = createMemo(() => {
  //   if (!isVideoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
  //   return zoomPhoto(videoRef!, view.zoomLevel);
  // });

  // const goToNextElement = () => {
  //   const current = getKeyByItem(items());
  //   if (!current || current.idx >= displayMedias.length - 1) return;

  //   const nextMedia = displayMedias[current.idx + 1];
  //   scrollToModalElement(nextMedia.media_id, "smooth");
  // };

  // const [seekButton, setSeekButton] = createStore({ backward: false, forward: false });
  // const seekAnimation = (direction: "backward" | "forward") => {
  //   setSeekButton(direction, true);
  //   direction === "backward" ? seekBackward(videoRef) : seekForward(videoRef);
  //   setTimeout(() => setSeekButton(direction, false), 300); // matches CSS transition duration
  // };

  return (
    <>
      <video
        ref={(el) => (videoRef = el)}
        style={{ ...childDim() }}
        inert={!vidStatus.isFullScreen}
        onFullscreenChange={() => setVidStatus("isFullScreen", (prev) => !prev)}
        onLoad={() => setVidStatus("isLoading", true)}
        onLoadedData={() => setVidStatus("isLoading", false)}
        onPlay={(e) => {
          e.preventDefault();
          setVidStatus("isPlaying", true);

          // if (media().frame_rate > 200) e.currentTarget.playbackRate = 1 / slowMode();
          // if (view.showThumb) setView("showThumb", false);
        }}
        onPause={() => {
          setVidStatus("isPlaying", false);
        }}
        onTimeUpdate={(e) => setVidStatus("currentTime", e.currentTarget.currentTime)}
        // onEnded={goToNextElement}
        preload="none"
        muted={vidStatus.muted}
        controls={false}
        controlslist="nodownload"
        playsinline
        crossorigin="use-credentials">
        <source src={`${VIDEO_API_URL}${media().source_file}`} type={media().mime_type} />

        <p>Your browser doesn't support the video tag.</p>
      </video>

      <img
        inert
        classList={{
          [styles.overlayImg]: true,
          [styles.pulse]: vidStatus.isLoading && vidStatus.isPlaying, //view.zoomLevel <= 1
        }}
        style={{ opacity: vidStatus.isLoading ? 1 : 0 }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      />
      {/* use image to display while video loading (Work but problems to adjust thumbnail width) */}

      {/* ////////////// All addon element must start here /////////////////////////////// */}
      {/* <Show when={isVisible() && vidStatus.isLoading && vidStatus.isPlaying}>
        <div class={styles.playPauseBtn}>
          <Spinner />
        </div>
      </Show> */}

      <Show when={isVideoVisible()}>
        {/* Design a videoPlayer control when video play, user able to control it */}
        {/* <div
          classList={{
            [modalS.fadeOut]: openModal.showImage,
          }}>
          <button
            classList={{
              [styles.seekBtn]: true,
              [styles.backward]: true,
              [styles.isDoubleClick]: seekButton.backward,
            }}
            onDblClick={() => seekAnimation("backward")}>
            <div class={styles.seekOverlay}>{BackwardButtonIcon()}</div>
          </button>

          <button
            classList={{
              [styles.seekBtn]: true,
              [styles.forward]: true,
              [styles.isDoubleClick]: seekButton.forward,
            }}
            onDblClick={() => seekAnimation("forward")}>
            <div class={styles.seekOverlay}>{ForwardButtonIcon()}</div>
          </button>
        </div> */}

        <div
          classList={{
            [modalS.modalThumbs]: true,
            [modalS.fadeOut]: openModal.showImage,
            [styles.videoControler]: true,
          }}>
          {/* <button class="buttonVideoPlayer" onClick={() => setVidStatus("muted", (prev) => !prev)}>
            {MuteIcon(vidStatus.muted)}
          </button> */}
          <div class={styles.playInfo}>
            <button onClick={async () => togglePlayVideo(videoRef)}>
              {vidStatus.isPlaying ? PauseButtonIcon() : PlayButtonIcon()}
            </button>
            <p>{formatDuration(vidStatus.currentTime)}</p>
            <button class="buttonVideoPlayer" onClick={(e) => fullScreenVideo(e, videoRef!)}>
              {FullScreenIcon()}
            </button>
          </div>

          <div class={styles.playbar}>
            <input
              class={styles.videoSlider}
              style={{ "--currentProcess": `${(vidStatus.currentTime / media().duration) * 100}%` }}
              type="range"
              min="0"
              max={Math.round(media().duration * 100) / 100}
              value={vidStatus.currentTime}
              step={0.01}
              onInput={(e) => {
                e.preventDefault();
                videoRef!.currentTime = Number(e.target.value);
                setVidStatus("currentTime", Number(e.target.value));
              }}
              onPointerDown={() => pauseVideo(videoRef)}
              onPointerUp={() => playVideo(videoRef)}
            />
          </div>
        </div>
      </Show>

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={openModal.isEditing && isVideoVisible()}>
        <EditVideo video={videoRef!} media={media()} />
      </Show>
    </>
  );
};

export default Video;

const pauseVideo = (videoRef: HTMLVideoElement) => {
  if (!videoRef) return;
  if (!videoRef.paused) videoRef.pause();
};
const playVideo = (videoRef: HTMLVideoElement) => {
  if (!videoRef) return;
  if (videoRef.paused) videoRef.play();
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toFixed(2).padStart(5, "0")}`;
};

/**
 * Toggles video playback between play and pause.
 * @param videoRef - The video element.
 * @returns A promise if playing, otherwise undefined.
 */
const togglePlayVideo = (videoRef: HTMLVideoElement) => {
  if (!videoRef) return;
  if (videoRef.readyState < 3) videoRef.load();

  if (videoRef.paused) return videoRef.play().catch((e) => console.warn("Autoplay blocked", e));

  return videoRef.pause();
};

const fullScreenVideo = (e: Event, videoRef: HTMLVideoElement) => {
  e.preventDefault();
  if (!videoRef) return;
  videoRef.requestFullscreen ? videoRef.requestFullscreen() : (videoRef as any).webkitEnterFullscreen();
};

/**
 * Seeks the video by a specified number of seconds.
 * @param videoRef - The video element.
 * @param seekAmount - The seconds to seek forward or backward.
 *
 * - `seekVideo`: Updates playback time if seekable.
 * - `seekForward`: Moves forward by `SEEK_AMOUNT`.
 * - `seekBackward`: Moves backward by `SEEK_AMOUNT`.
 */
const seekVideo = (videoRef: HTMLVideoElement, seekAmount: number) => {
  // Video is not ready or seekable.
  if (!videoRef || videoRef.readyState < 3 || videoRef.seekable.length === 0) return;

  const duration = videoRef.duration;
  if (isNaN(duration) || duration <= 0) return console.error("Invalid video duration.");

  const newTime = Math.min(Math.max(videoRef.currentTime + seekAmount, 0), duration);

  try {
    if (videoRef.currentTime === newTime) return;

    videoRef.currentTime = newTime; //console.log(`Seeked to ${newTime}s`);
  } catch (err) {
    console.error("Error seeking video:", err);
  }
};

const SEEK_AMOUNT = 10;
const seekForward = (videoRef: HTMLVideoElement) => {
  if (videoRef) seekVideo(videoRef, SEEK_AMOUNT);
};

const seekBackward = (videoRef: HTMLVideoElement) => {
  if (videoRef) seekVideo(videoRef, -SEEK_AMOUNT);
};

const PlayButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445l6.762 4.226Z" />
  </svg>
);

const PauseButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 25 25">
    <path
      stroke-width="0.1"
      d="M10 6.42a3 3 0 0 0-6 0v12a3 3 0 1 0 6 0v-12ZM20 6.42a3 3 0 1 0-6 0v12a3 3 0 1 0 6 0v-12Z"
    />
  </svg>
);

const BackwardButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.998 8.34v7.32c0 1.5-1.63 2.44-2.93 1.69l-3.17-1.83-3.17-1.83-.49-.28v-2.82l.49-.28 3.17-1.83 3.17-1.83c1.3-.75 2.93.19 2.93 1.69Z" />
    <path d="M12.241 8.34v7.32c0 1.5-1.63 2.44-2.92 1.69l-3.18-1.83-3.17-1.83c-1.29-.75-1.29-2.63 0-3.38l3.17-1.83 3.18-1.83c1.29-.75 2.92.19 2.92 1.69Z" />
  </svg>
);

const ForwardButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M2 8.34v7.32c0 1.5 1.63 2.44 2.93 1.69l3.17-1.83 3.17-1.83.49-.28v-2.82l-.49-.28L8.1 8.48 4.93 6.65C3.63 5.9 2 6.84 2 8.34ZM11.762 8.34v7.32c0 1.5 1.63 2.44 2.92 1.69l3.18-1.83 3.17-1.83c1.29-.75 1.29-2.63 0-3.38l-3.17-1.83-3.18-1.83c-1.29-.75-2.92.19-2.92 1.69Z" />
  </svg>
);

export const FullScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      stroke-width={2}
      d="M3 8.5a.5.5 0 0 1-1 0v-2A2.5 2.5 0 0 1 4.5 4h2a.5.5 0 0 1 0 1h-2A1.5 1.5 0 0 0 3 6.5v2ZM17.5 5a.5.5 0 1 1 0-1h2A2.5 2.5 0 0 1 22 6.5v2a.5.5 0 1 1-1 0v-2A1.5 1.5 0 0 0 19.5 5h-2ZM21 15.5a.5.5 0 1 1 1 0v2a2.5 2.5 0 0 1-2.5 2.5h-2a.5.5 0 1 1 0-1h2a1.5 1.5 0 0 0 1.5-1.5v-2ZM6.5 19a.5.5 0 1 1 0 1h-2A2.5 2.5 0 0 1 2 17.5v-2a.5.5 0 1 1 1 0v2A1.5 1.5 0 0 0 4.5 19h2Z"
    />
  </svg>
);

const MuteIcon = (isMuted: boolean = false) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 61 61">
    <g fill="none">
      {isMuted ? (
        <path stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" d="m45 33 12 11m0-11L45 43" />
      ) : (
        <g fill="none">
          <path stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" d="M48 28c4 4 4 12 0 16" />
          <path stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" d="M54 23c6 6 6 20 0 26" />
        </g>
      )}
      <path stroke-linejoin="round" stroke-miterlimit="10" stroke-width="4" d="M21 44h-7l-2-2V30l2-2h7" />
      <path
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="4"
        d="m21 43-1-1V30l1-1 12-13c2-2 4-1 4 1v37c0 3-2 4-4 2L21 43z"
      />
    </g>
  </svg>
);
