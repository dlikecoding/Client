import { Component, createSignal } from "solid-js";
import { useManageURLContext } from "../../../context/ManageUrl";
import { MediaType } from "../../../context/ViewContext";
import styles from "./Types.module.css";
interface PhotoProps {
  media: MediaType;
}

const Photo: Component<PhotoProps> = (props) => {
  const { view } = useManageURLContext();
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  return (
    <div
      inert
      class={styles.blurLoad}
      style={{
        "background-image": imgLoading() ? `url(${props.media.ThumbPath})` : "",
        "background-size": view.modalObjFit ? "cover" : "contain",
      }}>
      <img
        style={{ "object-fit": view.modalObjFit ? "cover" : "contain" }}
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
