import styles from "./Modal.module.css";
import { MediaType } from "../../context/ViewContext";
import { Accessor, Component, Setter } from "solid-js";

interface MediaTypeProps {
  media: MediaType;
  target?: () => HTMLDivElement | undefined;
  index: number;
}

const MediaDisplay: Component<MediaTypeProps> = (props: any) => {
  const index = () => props.index;
  const media = () => props.media;
  const target = () => props.target;

  return (
    <div ref={target()} class={styles.imageContainer} data-id={media().media_id} data-time={media().CreateDate}>
      <img loading="lazy" src={media().SourceFile} alt={`Modal Image ${index()}`} />
    </div>
  );
};

export default MediaDisplay;
