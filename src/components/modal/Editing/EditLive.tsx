import styles from "../ModalView.module.css";
import { Component, createSignal, Index, onMount, Setter } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import LayoutEditing from "./LayoutEditing";
import { fetchNewFrameLivePhoto } from "../../extents/request/fetching";
import { useMediaContext } from "../../../context/Medias";

type LiveProps = {
  media: MediaType;
  currentChild: HTMLVideoElement;
  isLoading: boolean;
  setIsLoading: Setter<boolean>; // Show loading while seeking video
};

type FrameLive = {
  imageBase: string;
  position: number;
};

const THUMB_HEIGHT = 50;
const NUMBER_OF_FRAMES = 11;

const EditLive: Component<LiveProps> = (props) => {
  const currentChild = () => props.currentChild;
  const media = () => props.media;
  const isLoading = () => props.isLoading;

  const [thumbnails, setThumbnails] = createSignal<FrameLive[]>([]);
  const [framePosition, setFramePosition] = createSignal<number>(media().selected_frame);

  const { setIsEditing } = useViewMediaContext();

  onMount(async () => {
    props.setIsLoading(true);

    await extractFrames(currentChild(), setThumbnails);

    await waitForSeek(currentChild(), media().selected_frame);
    props.setIsLoading(false);
  });

  const changeTimePosition = async (position: number) => {
    await waitForSeek(currentChild(), position);
    setFramePosition(position);
  };

  const { items } = useMediaContext();
  const { setDisplayMedia } = useViewMediaContext();

  const onDone = async () => {
    // Update frame to new frame
    const res = await fetchNewFrameLivePhoto(media().media_id, framePosition());
    if (!res.ok) alert("Failed to update frame position");

    // Update UI with new pos
    setDisplayMedia([...items().keys()], "selected_frame", framePosition());

    setIsEditing(false);
  };

  return (
    <LayoutEditing onCancel={() => setIsEditing(false)} onDone={onDone}>
      <div class={styles.modalThumbs} style={{ bottom: "38px", "align-items": "start" }}>
        <div class={styles.thumbSlider}>
          <div class={styles.thumbsLive}>
            <Index each={thumbnails()}>{(thumbs) => <img inert src={thumbs().imageBase} />}</Index>
          </div>

          <input
            classList={{ [styles.inputSlider]: true, [styles.onloadSlider]: isLoading() }}
            type="range"
            min="0"
            max={media().duration}
            step="any"
            value={framePosition()}
            onInput={(e) => {
              e.preventDefault();
              changeTimePosition(parseFloat(e.currentTarget.value));
            }}
          />
        </div>
      </div>
    </LayoutEditing>
  );
};

export default EditLive;

const extractFrames = async (video: HTMLVideoElement, setThumbnails: Setter<FrameLive[]>) => {
  if (!video || !video.readyState) return;

  const aspect = video.videoWidth / video.videoHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const duration = video.duration;
  const interval = duration / NUMBER_OF_FRAMES; // seconds between frames
  const frames: FrameLive[] = [];

  canvas.height = THUMB_HEIGHT;
  canvas.width = THUMB_HEIGHT * aspect;

  for (let t = interval; t < duration; t += interval) {
    await waitForSeek(video, t);

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = canvas.toDataURL("image/jpeg");
    frames.push({ imageBase: img, position: t });
  }

  setThumbnails(frames);
};

function waitForSeek(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
  });
}
