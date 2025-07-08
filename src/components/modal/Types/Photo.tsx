import styles from "./Types.module.css";
import { Component, createMemo, createSignal, Show } from "solid-js";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import { useManageURLContext } from "../../../context/ManageUrl";

import EditPhoto from "../Editing/EditPhoto";

interface PhotoProps {
  media: MediaType;
  isVisible: boolean;
  childDim: {
    width: string;
    height: string;
  };
}

const Photo: Component<PhotoProps> = (props) => {
  const media = () => props.media;
  const isVisible = () => props.isVisible;

  const childDim = () => props.childDim;

  let photoRef: HTMLImageElement;

  const { openModal, mouseGesture, translate } = useViewMediaContext();

  const isPhotoVisible = createMemo(() => isVisible() && photoRef);

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const { view } = useManageURLContext();

  createMemo(() => {
    if (!isPhotoVisible()) return;
    setImgLoading(false);
  });

  // =========================================================

  return (
    <>
      {/* ================================================ */}
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
        <div>{mouseGesture.drag ? "dragging" : "No Drag"}</div>
        <div>{mouseGesture.end?.x}</div>
        <div>{mouseGesture.end?.y}</div>
        <div>{mouseGesture.action}</div>
        <br>---------------------------</br>
        <br />
        <div>{translate.x}</div>
        <div>{translate.y}</div>

        <div>{view.zoomLevel}</div>
      </header>
      {/* ================================================ */}

      <img
        // onMouseDown={onMouseDown}
        ref={(el) => (photoRef = el)}
        style={{
          width: childDim().width,
          height: childDim().height,

          // transition: mouseGesture.drag ? "none" : "width 250ms ease, height 250ms ease",
          // transform:
          //   view.zoomLevel <= 1 || !isPhotoVisible()
          //     ? "translate(0, 0)"
          //     : `translate(${translate.x}px, ${translate.y}px)`,
        }}
        inert
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={media().source_file}
        alt={`Modal Image`}
      />

      {/* <img
        inert
        class={styles.overlayImg}
        style={{ opacity: imgLoading() ? 1 : 0 }}
        loading="lazy"
        src={media().thumb_path}
        alt={`Modal Image Overlay`}
      /> */}

      {/* ////////////// All addon element must start here /////////////////////////////// */}

      {/* ////////////// For editing /////////////////////////////// */}
      <Show when={openModal.isEditing && isPhotoVisible()}>
        <EditPhoto photo={photoRef!} />
      </Show>
    </>
  );
};
export default Photo;
