import styles from "../ModalView.module.css";
import { Component, createSignal, onMount, Setter } from "solid-js";
import { List } from "@solid-primitives/list";
import { useViewMediaContext } from "../../../context/ViewContext";
import LayoutEditing from "./LayoutEditing";

type LiveProps = {
  liveRef: HTMLVideoElement;
  setLoading: Setter<boolean>;
  setIsEditing: Setter<boolean>;
};

type FrameLive = {
  imageBase: string;
  position: number;
};

const START_POSITION = 0.5;

const EditLive: Component<LiveProps> = (props) => {
  const [thumbnails, setThumbnails] = createSignal<FrameLive[]>([]);
  const [framePosition, setFramePosition] = createSignal<number>(0);

  const { setIsEditing } = useViewMediaContext();

  onMount(async () => {
    const liveRef = props.liveRef;
    props.setLoading(true);

    await extractFrames(liveRef, setThumbnails);
    await waitForSeek(liveRef, START_POSITION);
    setFramePosition(START_POSITION);

    props.setLoading(false);
  });

  const changeTimePosition = async (position: number) => {
    await waitForSeek(props.liveRef, position);
    setFramePosition(position);
  };

  const onDone = () => {
    console.log("Clicked Done!");
    // Update frame to new frame
    // Create new thumbnail with new position
    // Set new current frame
  };

  return (
    <LayoutEditing onCancel={() => setIsEditing(false)} onDone={onDone}>
      <div class={styles.modalThumbs}>
        <List each={thumbnails()}>
          {(media) => (
            <div
              style={media().position === framePosition() ? { width: "70px", height: "60px", margin: "0 5px" } : {}}
              onClick={() => changeTimePosition(media().position)}>
              <img inert src={media().imageBase} />
            </div>
          )}
        </List>
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

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const interval = START_POSITION; // seconds between frames
  const duration = video.duration;
  const frames: FrameLive[] = [];

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  for (let t = START_POSITION; t < duration; t += interval) {
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
