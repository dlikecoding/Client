import styles from "./Types.module.css";
import modalS from "./../ModalView.module.css";

import { Component, createMemo, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { VIDEO_API_URL } from "../../../App";
import { createStore } from "solid-js/store";
import { useManageURLContext } from "../../../context/ManageUrl";
// import { zoomPhoto } from "../../extents/helper/zoom";

import Spinner from "../../extents/Spinner";
import EditVideo from "../Editing/EditVideo";
// import { useMediaContext } from "../../../context/Medias";
// import { getKeyByItem, scrollToModalElement } from "../../extents/helper/helper";

interface VideoProps {
  media: MediaType;
  isVisible: boolean;

  currentChild: HTMLVideoElement;
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
  const currentChild = () => props.currentChild;

  const isVideoVisible = createMemo(() => isVisible() && currentChild());

  // Determine if video outside the view port, stop the video
  let videoRef: HTMLVideoElement | undefined;

  const [vidStatus, setVidStatus] = createStore<VideoStatus>({
    isLoading: true,
    isPlaying: false,
    currentTime: 0,
    muted: false,
    isFullScreen: false,
  });

  const { showImageOnly, isEditing } = useViewMediaContext(); //displayMedias
  // const { items } = useMediaContext();
  const { view } = useManageURLContext();

  /** Auto stop video playing when scroll to other element (videos) */
  createMemo(async () => {
    if (!isVideoVisible()) {
      if (videoRef && !videoRef.paused) return videoRef.pause(); //Video is not visible, pausing...
      return;
    }

    // On or off auto play video when it's visible
    if (!view.autoplay) return;

    if (currentChild().readyState < 3) currentChild().load();
    if (currentChild().paused) currentChild().play();
  });

  // const slowMode = createMemo(() => {
  //   if (!isVisible()) return 1;
  //   return !media().frame_rate || media().frame_rate < 200 ? 1 : 6;
  // });

  // const zoomSize = createMemo(() => {
  //   if (!isVideoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
  //   return zoomPhoto(currentChild(), view.zoomLevel);
  // });

  // const goToNextElement = () => {
  //   const current = getKeyByItem(items());
  //   if (!current || current.idx >= displayMedias.length - 1) return;

  //   const nextMedia = displayMedias[current.idx + 1];
  //   scrollToModalElement(nextMedia.media_id, "smooth");
  // };
  return (
    <>
      <video
        // style={{
        //   width: zoomSize().width,
        //   height: zoomSize().height,
        // }}
        inert={!vidStatus.isFullScreen}
        ref={(el) => (videoRef = el)}
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
        class={styles.overlayImg}
        style={{ opacity: vidStatus.isLoading ? 1 : 0 }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      />
      {/* use image to display while video loading (Work but problems to adjust thumbnail width) */}

      {/* ////////////// All addon element must start here /////////////////////////////// */}
      <Show when={isVisible() && vidStatus.isLoading && vidStatus.isPlaying}>
        <div class={styles.playPauseBtn}>
          <Spinner />
        </div>
      </Show>

      <Show when={isVideoVisible()}>
        {/* Design a videoPlayer control when video play, user able to control it */}
        <div
          classList={{ [modalS.modalThumbs]: true, [modalS.fadeOut]: showImageOnly(), [styles.videoControler]: true }}>
          <button class="buttonVideoPlayer" onClick={() => setVidStatus("muted", (prev) => !prev)}>
            {MuteIcon(vidStatus.muted)}
          </button>
          <button class="buttonVideoPlayer" onClick={(e) => fullScreenVideo(e, currentChild())}>
            {FullScreenIcon()}
          </button>

          {/* <button onClick={() => seekBackward(currentChild())}>{BackwardButtonIcon()}</button> */}
          {/* <button onClick={() => seekForward(currentChild())}>{ForwardButtonIcon()}</button> */}

          <div class={styles.playbar}>
            <button
              onClick={async () => {
                if (vidStatus.isLoading) currentChild().load();
                togglePlayVideo(currentChild());
              }}>
              {vidStatus.isPlaying ? PauseButtonIcon() : PlayButtonIcon()}
            </button>

            <input
              class={styles.videoSlider}
              style={{ "--currentProcess": `${(vidStatus.currentTime / media().duration) * 100}%` }}
              type="range"
              min="0"
              max={Math.round(media().duration)}
              value={vidStatus.currentTime}
              // step={1 / slowMode()}
              onInput={(e) => {
                e.preventDefault();
                currentChild().currentTime = Number(e.target.value);
              }}
            />
            {/* NEED TO-DO Improve this funtion to prevent calculate time every second */}
            {media().video_duration}
          </div>
        </div>
      </Show>

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isVideoVisible()}>
        <EditVideo video={currentChild()} media={media()} />
      </Show>
    </>
  );
};

export default Video;

/**
 * Toggles video playback between play and pause.
 * @param videoRef - The video element.
 * @returns A promise if playing, otherwise undefined.
 */
const togglePlayVideo = (videoRef: HTMLVideoElement) => {
  if (!videoRef) return;
  if (videoRef.paused) return videoRef.play().catch((e) => console.warn("Autoplay blocked", e));

  return videoRef.pause();
};

const fullScreenVideo = (e: Event, videoRef: HTMLVideoElement) => {
  e.preventDefault();
  if (!videoRef) return;
  videoRef.requestFullscreen ? videoRef.requestFullscreen() : (videoRef as any).webkitEnterFullscreen();
};

// /**
//  * Seeks the video by a specified number of seconds.
//  * @param videoRef - The video element.
//  * @param seekAmount - The seconds to seek forward or backward.
//  *
//  * - `seekVideo`: Updates playback time if seekable.
//  * - `seekForward`: Moves forward by `SEEK_AMOUNT`.
//  * - `seekBackward`: Moves backward by `SEEK_AMOUNT`.
//  */
// const seekVideo = (videoRef: HTMLVideoElement, seekAmount: number) => {
//   // Video is not ready or seekable.
//   if (!videoRef || videoRef.readyState < 3 || videoRef.seekable.length === 0) return;

//   const duration = videoRef.duration;
//   if (isNaN(duration) || duration <= 0) return console.error("Invalid video duration.");

//   const newTime = Math.min(Math.max(videoRef.currentTime + seekAmount, 0), duration);

//   try {
//     if (videoRef.currentTime === newTime) return;

//     videoRef.currentTime = newTime; //console.log(`Seeked to ${newTime}s`);
//   } catch (err) {
//     console.error("Error seeking video:", err);
//   }
// };

// const seekForward = (videoRef: HTMLVideoElement) => {
//   if (videoRef) seekVideo(videoRef, SEEK_AMOUNT);
// };

// const seekBackward = (videoRef: HTMLVideoElement) => {
//   if (videoRef) seekVideo(videoRef, -SEEK_AMOUNT);
// };

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

// const BackwardButtonIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
//     <path
//       stroke-width="0.1"
//       d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906 0-11.531-8.437-21.305-19.383-23.46V3.706c0-1.664-1.148-2.11-2.437-1.195l-7.477 5.226c-1.054.75-1.078 1.875 0 2.649l7.453 5.25c1.313.937 2.461.492 2.461-1.196V11.09c8.86 2.015 15.375 9.914 15.375 19.406A19.84 19.84 0 0 1 28 50.418c-11.063 0-19.945-8.86-19.922-19.922.023-6.656 3.258-12.539 8.25-16.101.961-.727 1.266-1.829.656-2.813-.562-.96-1.851-1.219-2.883-.422C8.055 15.543 4.094 22.621 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906Zm5.648-14.039c3.891 0 6.446-3.68 6.446-9.304 0-5.672-2.555-9.399-6.446-9.399-3.89 0-6.445 3.727-6.445 9.399 0 5.625 2.555 9.304 6.445 9.304Zm-12.21-.281c.913 0 1.5-.633 1.5-1.617V23.723c0-1.149-.61-1.875-1.665-1.875-.633 0-1.078.21-1.922.773l-3.257 2.18c-.516.375-.774.797-.774 1.36 0 .773.61 1.429 1.36 1.429.445 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.585 1.618 1.452 1.618Zm12.21-2.555c-2.062 0-3.398-2.46-3.398-6.468 0-4.079 1.312-6.563 3.398-6.563 2.11 0 3.375 2.461 3.375 6.563 0 4.007-1.289 6.468-3.375 6.468Z"
//     />
//   </svg>
// );

// const ForwardButtonIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
//     <path
//       stroke-width="0.1"
//       d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906 0-7.875-3.984-14.953-10.008-19.336-1.03-.797-2.32-.539-2.906.422-.586.984-.281 2.086.656 2.813 4.992 3.562 8.25 9.445 8.274 16.101C47.945 41.56 39.039 50.418 28 50.418c-11.063 0-19.899-8.86-19.899-19.922 0-9.492 6.516-17.39 15.376-19.406v3.375c0 1.664 1.148 2.11 2.413 1.195l7.5-5.25c1.055-.726 1.079-1.851 0-2.625l-7.476-5.25c-1.29-.937-2.438-.492-2.438 1.196v3.304C12.509 9.168 4.095 18.965 4.095 30.496c0 13.078 10.828 23.906 23.906 23.906Zm5.672-14.039c3.89 0 6.422-3.68 6.422-9.304 0-5.672-2.532-9.399-6.422-9.399-3.89 0-6.445 3.727-6.445 9.399 0 5.625 2.554 9.304 6.445 9.304Zm-12.235-.281c.914 0 1.524-.633 1.524-1.617V23.723c0-1.149-.633-1.875-1.688-1.875-.633 0-1.054.21-1.922.773l-3.234 2.18c-.539.375-.773.797-.773 1.36 0 .773.609 1.429 1.359 1.429.422 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.562 1.618 1.43 1.618Zm12.235-2.555c-2.086 0-3.399-2.46-3.399-6.468 0-4.079 1.29-6.563 3.399-6.563 2.086 0 3.351 2.461 3.351 6.563 0 4.007-1.289 6.468-3.351 6.468Z"
//     />
//   </svg>
// );

export const FullScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      stroke-width={1}
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
