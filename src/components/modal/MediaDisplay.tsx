import styles from "./Modal.module.css";
import { MediaType } from "../../context/ViewContext";
import { Accessor, Component, createSignal, Match, Setter, Show, Switch } from "solid-js";
import Video from "./Types/Video";
import Photo from "./Types/Photo";
import Live from "./Types/Live";

interface MediaTypeProps {
  media: MediaType;
  index: number;
  refSetter?: (el: HTMLElement) => void;
  showImgOnly: Accessor<boolean>;
  setShowImgOnly: Setter<boolean>;
}

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  return (
    <div
      ref={props.refSetter}
      class={styles.mediaContainer}
      data-modalIdx={props.index}
      data-modalId={props.media.media_id}
      onClick={() => props.setShowImgOnly((prev) => !prev)}>
      <Switch fallback={<div>Unknown type</div>}>
        <Match when={props.media.FileType === "Photo"}>
          <Photo media={props.media} />
        </Match>
        <Match when={props.media.FileType === "Video"}>
          <Video media={props.media} showImgOnly={props.showImgOnly} setShowImgOnly={props.setShowImgOnly} />
        </Match>
        <Match when={props.media.FileType === "Live"}>
          <Live media={props.media} />
        </Match>
      </Switch>
    </div>
  );
};
export default MediaDisplay;
