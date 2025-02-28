import styles from "./../Modal.module.css";

import { Accessor, Component, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import { MediaType } from "../../../context/ViewContext";
import { useIntersectionObserver } from "solidjs-use";

interface VideoProps {
  media: MediaType;
  showImgOnly: Accessor<boolean>;
  setShowImgOnly: Setter<boolean>;
}

const SEEK_AMOUNT = 10; //Amount seek video

const Video: Component<VideoProps> = (props) => {
  let videoRef: HTMLVideoElement | undefined;
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

  onMount(() => {
    useIntersectionObserver(videoRef, ([{ isIntersecting }]) => {
      if (isIntersecting) return;
      if (videoRef && !videoRef.paused) videoRef.pause(); //Video is not visible, pausing...
    });
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
            {"<<"}
          </button>

          <button
            onClick={() => {
              toggleVideo(videoRef!);
              setIsPlaying((prev) => !prev);
            }}>
            {isPlaying() ? "Pause" : "Play"}
          </button>

          <button
            style={{ visibility: isPlaying() ? "visible" : "hidden" }}
            onClick={() => {
              props.setShowImgOnly(true);
              seekForward(videoRef);
            }}>
            {">>"}
          </button>
        </div>
      </Show>

      <video
        inert
        ref={videoRef}
        poster={props.media.ThumbPath}
        onPause={(e) => {
          e.preventDefault();

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
    videoRef.currentTime = newTime; //`Seeked to ${newTime}s`
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
