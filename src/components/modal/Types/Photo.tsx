import { Component, createSignal } from "solid-js";
import { MediaType } from "../../../context/ViewContext";
import styles from "./Types.module.css";
interface PhotoProps {
  media: MediaType;
}

const Photo: Component<PhotoProps> = (props) => {
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  return (
    <div
      inert
      class={styles.blurLoad}
      style={{ "background-image": imgLoading() ? `url(${props.media.ThumbPath})` : "" }}>
      <img
        onLoad={() => setImgLoading(false)}
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={props.media.SourceFile}
        alt={`Modal Image`}
      />
    </div>
  );
};

export default Photo;
