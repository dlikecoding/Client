import styles from "../ModalView.module.css";
import { Component, createMemo, createSignal, onMount, Setter } from "solid-js";
import { List } from "@solid-primitives/list";
import { useViewMediaContext } from "../../../context/ViewContext";
import LayoutEditing from "./LayoutEditing";

type LiveProps = {
  liveRef: HTMLVideoElement;
  setLoading: Setter<boolean>; // Show loading while seeking video
  setIsEditing: Setter<boolean>;
};

type FrameLive = {
  imageBase: string;
  position: number;
};

const THUMB_HEIGHT = 50;
const NUMBER_OF_FRAMES = 11;

const EditLive: Component<LiveProps> = (props) => {
  const [thumbnails, setThumbnails] = createSignal<FrameLive[]>([]);
  const [framePosition, setFramePosition] = createSignal<number>(0);

  const [maxDuration, setMaxDuration] = createSignal<number>(0);

  const { setIsEditing } = useViewMediaContext();

  onMount(async () => {
    const liveRef = props.liveRef;
    props.setLoading(true);

    await extractFrames(liveRef, setThumbnails);
    setMaxDuration(liveRef.duration);
    props.setLoading(false);
  });

  const changeTimePosition = async (position: number) => {
    await waitForSeek(props.liveRef, position);
    setFramePosition(position);
  };

  createMemo(() => {
    console.log(framePosition());
  });

  const onDone = () => {
    console.log("Clicked Done!");
    // Update frame to new frame
    // Create new thumbnail with new position
    // Set new current frame
  };

  return (
    <LayoutEditing onCancel={() => setIsEditing(false)} onDone={onDone}>
      <div class={styles.modalThumbs}>
        <div class={styles.thumbSlider}>
          <div class={styles.thumbsVideos}>
            <List each={thumbnails()}>{(media) => <img inert src={media().imageBase} />}</List>
          </div>

          <input
            class={styles.inputSlider}
            type="range"
            min="0"
            max={maxDuration()}
            step="any"
            value={framePosition()}
            onInput={(e) => changeTimePosition(parseFloat(e.currentTarget.value))}
          />
        </div>
      </div>
    </LayoutEditing>
  );
};

export default EditLive;

const extractFrames = async (video: HTMLVideoElement, setThumbnails: Setter<FrameLive[]>) => {
  if (!video) return;

  // Wait for metadata to load
  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve();
    video.load();
  });

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
