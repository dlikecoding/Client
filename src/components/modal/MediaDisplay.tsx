import styles from "./Modal.module.css";
import { MediaType } from "../../context/ViewContext";
import { Accessor, Component, Setter } from "solid-js";

interface MediaTypeProps {
  media: MediaType;
  curTarget?: () => HTMLDivElement | undefined;
  index: number;
}

const MediaDisplay: Component<MediaTypeProps> = (props: any) => {
  const index = () => props.index;
  const media = () => props.media;
  const curTarget = () => props.curTarget;

  return (
    <div ref={curTarget()} class={styles.imageContainer} data-id={media().media_id} data-time={media().CreateDate}>
      <img inert loading="lazy" src={media().SourceFile} alt={`Modal Image ${index()}`} />
    </div>
  );
};

export default MediaDisplay;
