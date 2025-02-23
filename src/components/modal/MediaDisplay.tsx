import styles from "./Modal.module.css";
import { MediaType } from "../../context/ViewContext";
import { Component } from "solid-js";

interface MediaTypeProps {
  media: MediaType;
  index: number;
  refSetter?: (el: HTMLElement) => void;
}

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  return (
    <div
      ref={props.refSetter}
      class={styles.imageContainer}
      data-modalIdx={props.index}
      data-modalId={props.media.media_id}
      data-modalTime={props.media.CreateDate}
      onClick={() => console.log("Image clicked")}>
      <img inert loading="lazy" src={props.media.SourceFile} alt={`Modal Image ${props.index}`} />
    </div>
  );
};

export default MediaDisplay;
