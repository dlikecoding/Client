import styles from "./Types.module.css";

import { Accessor, Component, createMemo, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import { MediaType } from "../../../context/ViewContext";

interface VideoProps {
  media: MediaType;
  isVisible: boolean;

  showImgOnly: Accessor<boolean>;
  setShowImgOnly: Setter<boolean>;
}

const SEEK_AMOUNT = 10; //Amount seek video

const Video: Component<VideoProps> = (props) => {
  let videoRef: HTMLVideoElement | undefined;
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

  const isVisible = () => props.isVisible;

  /** Auto stop video playing when scroll to other element */
  createMemo(() => {
    if (isVisible()) return;
    if (videoRef && !videoRef.paused) return videoRef.pause(); //Video is not visible, pausing...
  });

  return (
    <>
      <Show when={!props.showImgOnly()}>
        <div class={styles.videoControler}>
          <button
            style={{ visibility: isPlaying() ? "visible" : "hidden" }}
            onClick={() => {
              props.setShowImgOnly(true);
              seekBackward(videoRef);
            }}>
            {BackwardButtonIcon()}
          </button>

          <button class={styles.playPauseBtn} onClick={() => toggleVideo(videoRef!)}>
            {isPlaying() ? PauseButtonIcon() : PlayButtonIcon()}
          </button>

          <button
            style={{ visibility: isPlaying() ? "visible" : "hidden" }}
            onClick={() => {
              props.setShowImgOnly(true);
              seekForward(videoRef);
            }}>
            {ForwardButtonIcon()}
          </button>
        </div>
      </Show>

      <video
        inert
        ref={videoRef}
        poster={props.media.ThumbPath}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          props.setShowImgOnly(false);
          setIsPlaying(false);
        }}
        preload="metadata"
        controls={false}
        playsinline={true}
        ///////// DEVELOPMENT ////////////////////////////////////////
        crossorigin="anonymous">
        <source src={`http://localhost:8080${props.media.SourceFile}`} type={props.media.MIMEType} />

        {/* // Need to change to  "use-credentials" - Remove localhost:8080 */}
        {/* crossorigin="use-credentials">
        <source src={props.media.SourceFile} type={props.media.MIMEType} /> */}

        <p>Your browser doesn't support the video tag.</p>
      </video>

      {/* <footer style={{ "z-index": 1 }}></footer> */}
    </>
  );
};

export default Video;

/**
 * Toggles video playback between play and pause.
 * @param videoRef - The video element.
 * @returns A promise if playing, otherwise undefined.
 */
const toggleVideo = (videoRef: HTMLVideoElement | null) => {
  if (!videoRef) return;
  if (videoRef.paused) return videoRef.play().catch((e) => console.error("Autoplay blocked", e));

  return videoRef.pause(); // if (videoRef.requestFullscreen) videoRef.requestFullscreen();
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

const seekForward = (videoRef?: HTMLVideoElement) => {
  if (videoRef) seekVideo(videoRef, SEEK_AMOUNT);
};

const seekBackward = (videoRef?: HTMLVideoElement) => {
  if (videoRef) seekVideo(videoRef, -SEEK_AMOUNT);
};

const PlayButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445l6.762 4.226Z" />
  </svg>
);

const PauseButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 25 25">
    <path d="M10 6.42a3 3 0 0 0-6 0v12a3 3 0 1 0 6 0v-12ZM20 6.42a3 3 0 1 0-6 0v12a3 3 0 1 0 6 0v-12Z" />
  </svg>
);

const BackwardButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
    <path d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906 0-11.531-8.437-21.305-19.383-23.46V3.706c0-1.664-1.148-2.11-2.437-1.195l-7.477 5.226c-1.054.75-1.078 1.875 0 2.649l7.453 5.25c1.313.937 2.461.492 2.461-1.196V11.09c8.86 2.015 15.375 9.914 15.375 19.406A19.84 19.84 0 0 1 28 50.418c-11.063 0-19.945-8.86-19.922-19.922.023-6.656 3.258-12.539 8.25-16.101.961-.727 1.266-1.829.656-2.813-.562-.96-1.851-1.219-2.883-.422C8.055 15.543 4.094 22.621 4.094 30.496c0 13.078 10.828 23.906 23.906 23.906Zm5.648-14.039c3.891 0 6.446-3.68 6.446-9.304 0-5.672-2.555-9.399-6.446-9.399-3.89 0-6.445 3.727-6.445 9.399 0 5.625 2.555 9.304 6.445 9.304Zm-12.21-.281c.913 0 1.5-.633 1.5-1.617V23.723c0-1.149-.61-1.875-1.665-1.875-.633 0-1.078.21-1.922.773l-3.257 2.18c-.516.375-.774.797-.774 1.36 0 .773.61 1.429 1.36 1.429.445 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.585 1.618 1.452 1.618Zm12.21-2.555c-2.062 0-3.398-2.46-3.398-6.468 0-4.079 1.312-6.563 3.398-6.563 2.11 0 3.375 2.461 3.375 6.563 0 4.007-1.289 6.468-3.375 6.468Z" />
  </svg>
);

const ForwardButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
    <path d="M28 54.402c13.055 0 23.906-10.828 23.906-23.906 0-7.875-3.984-14.953-10.008-19.336-1.03-.797-2.32-.539-2.906.422-.586.984-.281 2.086.656 2.813 4.992 3.562 8.25 9.445 8.274 16.101C47.945 41.56 39.039 50.418 28 50.418c-11.063 0-19.899-8.86-19.899-19.922 0-9.492 6.516-17.39 15.376-19.406v3.375c0 1.664 1.148 2.11 2.413 1.195l7.5-5.25c1.055-.726 1.079-1.851 0-2.625l-7.476-5.25c-1.29-.937-2.438-.492-2.438 1.196v3.304C12.509 9.168 4.095 18.965 4.095 30.496c0 13.078 10.828 23.906 23.906 23.906Zm5.672-14.039c3.89 0 6.422-3.68 6.422-9.304 0-5.672-2.532-9.399-6.422-9.399-3.89 0-6.445 3.727-6.445 9.399 0 5.625 2.554 9.304 6.445 9.304Zm-12.235-.281c.914 0 1.524-.633 1.524-1.617V23.723c0-1.149-.633-1.875-1.688-1.875-.633 0-1.054.21-1.922.773l-3.234 2.18c-.539.375-.773.797-.773 1.36 0 .773.609 1.429 1.359 1.429.422 0 .656-.094 1.125-.422l2.18-1.594v12.89c0 .962.562 1.618 1.43 1.618Zm12.235-2.555c-2.086 0-3.399-2.46-3.399-6.468 0-4.079 1.29-6.563 3.399-6.563 2.086 0 3.351 2.461 3.351 6.563 0 4.007-1.289 6.468-3.351 6.468Z" />
  </svg>
);
