import styles from "./Modal.module.css";
import { MediaType } from "../../context/ViewContext";
import { Component, Setter } from "solid-js";

interface MediaTypeProps {
  media: MediaType;
  index: number;
  refSetter?: (el: HTMLElement) => void;
  setShowImgOnly: Setter<boolean>;

  // itemTop: number;
  // itemHeight: number;
}

const MediaDisplay: Component<MediaTypeProps> = (props) => {
  return (
    <div
      ref={props.refSetter}
      // style={{
      //   position: "absolute",
      //   top: `${props.itemTop}px`,
      //   // height: `${props.itemHeight}px`,
      //   // width: "100%",
      //   background: `${props.index % 2 === 0 ? "#000" : "#999"}`,
      // }}
      class={styles.imageContainer}
      data-modalIdx={props.index}
      data-modalId={props.media.media_id}
      data-modalTime={props.media.CreateDate}
      onClick={() => props.setShowImgOnly((prev) => !prev)}>
      <img inert loading="lazy" src={props.media.SourceFile} alt={`Modal Image ${props.index}`} />
    </div>
  );
};

export default MediaDisplay;
