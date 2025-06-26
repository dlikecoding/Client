import { Component, createMemo, createSignal, JSX, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";
import { zoomPhoto } from "../../extents/helper/zoom";

import styles from "./Types.module.css";

interface PhotoProps {
  media: MediaType;
  currentChild: HTMLImageElement;
  isVisible: boolean;
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;
  const currentChild = () => props.currentChild;

  const { isEditing } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && currentChild());

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  const zoomSize = createMemo(() => {
    if (!isPhotoVisible() || view.zoomLevel <= 1) return { width: "100%", height: "100%" };
    return zoomPhoto(currentChild(), view.zoomLevel);
  });

  createMemo(() => {
    if (!isPhotoVisible()) return;
    setImgLoading(false);
  });

  return (
    <>
      <img
        style={{
          width: zoomSize().width,
          height: zoomSize().height,
        }}
        inert
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={media().source_file}
        alt={`Modal Image`}
      />

      <img
        inert
        class={styles.overlayImg}
        style={{ opacity: !isPhotoVisible() || imgLoading() ? 1 : 0, transition: "opacity 2s linear" }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      />

      {/* ////////////// All addon element must start here /////////////////////////////// */}

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={isEditing() && isPhotoVisible()}>
        <EditPhoto photo={currentChild()} />
      </Show>
    </>
  );
};
export default Photo;
