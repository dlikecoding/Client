import styles from "../ModalView.module.css";
import { Component, createSignal, onMount, Setter } from "solid-js";
import { List } from "@solid-primitives/list";
import { useViewMediaContext } from "../../../context/ViewContext";
import LayoutEditing from "./LayoutEditing";

type LiveProps = {
  video: HTMLVideoElement;
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
  const [position, setposition] = createSignal<number>(0);

  const { setIsEditing } = useViewMediaContext();

  onMount(async () => {
    const extractFrames = async () => {
      const video = props.video;
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

    props.setLoading(true);
    await extractFrames();
    await waitForSeek(props.video, START_POSITION);
    setposition(START_POSITION);
    props.setLoading(false);
  });

  const changeTimePosition = async (position: number) => {
    await waitForSeek(props.video, position);
    setposition(position);
  };

  return (
    <LayoutEditing onCancel={() => setIsEditing(false)} onDone={() => console.log("Save frame")}>
      {/* Media-specific logic/UI */}
      <div class={styles.modalThumbs}>
        <List each={thumbnails()}>
          {(media) => (
            <div
              style={media().position === position() ? { width: "70px", height: "60px", margin: "0 5px" } : {}}
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
