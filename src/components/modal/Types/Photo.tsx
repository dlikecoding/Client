import { Component, createMemo, createSignal, JSX, onMount, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import EditPhoto from "../Editing/EditPhoto";
import { useManageURLContext } from "../../../context/ManageUrl";

import styles from "./Types.module.css";

interface PhotoProps {
  media: MediaType;
  isVisible: boolean;
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;

  let photoRef: HTMLImageElement;

  const { isEditing, mouseGesture } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && photoRef);

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  createMemo(() => {
    if (!isPhotoVisible()) return;
    setImgLoading(false);
  });

  const targetStyle = createMemo(() => {
    if (!isPhotoVisible()) return "";
    if (view.zoomLevel <= 1 || !mouseGesture.end) return "";
    return {
      transform: `scale(${view.zoomLevel}) translate(${mouseGesture.end?.x || 0}px , ${mouseGesture.end?.y || 0}px)`,
    };
  });

  return (
    <>
      <header
        style={{
          background: "#000",
          height: "100px",
          width: "300px",
          display: "flex",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}>
        <div>{mouseGesture.status ? "Y" : "N"}</div>
        <div>{mouseGesture.end?.x}</div>
        <div>{mouseGesture.end?.y}</div>
        <div>{mouseGesture.action}</div>

        <div>{view.zoomLevel}</div>
      </header>
      <img
        ref={(el) => (photoRef = el)}
        style={{
          // transition: mouseGesture.action === "dragHorizontal" ? "none" : "all 0.3s ease",
          ...targetStyle(),
          // transform: `scale(${view.zoomLevel})`,
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
        <EditPhoto photo={photoRef!} />
      </Show>
    </>
  );
};
export default Photo;
